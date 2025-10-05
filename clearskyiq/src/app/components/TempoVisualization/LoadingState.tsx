interface LoadingStateProps {
  isPreloading: boolean;
  loadingMessage: string;
  jobStatus?: {
    status: string;
    progress: number;
    completed_plots: string[];
    failed_plots: string[];
  } | null;
}

export default function LoadingState({ isPreloading, loadingMessage, jobStatus }: LoadingStateProps) {
  return (
    <div className="mt-8 p-8 bg-white/5 rounded-xl">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--neon-yellow)] mb-6"></div>
        <h3 className="text-2xl font-semibold mb-3">
          {isPreloading ? 'Loading Sample Data' : 'Processing Request'}
        </h3>
        <p className="text-white/70 text-lg mb-4">{loadingMessage}</p>
        
        {/* Progress bar for parallel processing */}
        {jobStatus && jobStatus.status === 'processing' && (
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-white/70 mb-2">
              <span>Progress: {jobStatus.progress}%</span>
              <span>{jobStatus.completed_plots.length}/{jobStatus.completed_plots.length + jobStatus.failed_plots.length} completed</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-[var(--neon-yellow)] h-2 rounded-full transition-all duration-300"
                style={{ width: `${jobStatus.progress}%` }}
              ></div>
            </div>
            {jobStatus.completed_plots.length > 0 && (
              <div className="mt-4 text-sm text-white/60">
                Completed: {jobStatus.completed_plots.join(', ')}
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6 text-sm text-white/50 max-w-md mx-auto">
          {isPreloading 
            ? 'Loading sample TEMPO visualizations to get you started...' 
            : jobStatus?.status === 'processing'
            ? 'Processing visualizations in parallel...'
            : 'This may take a few minutes depending on data availability and processing time...'
          }
        </div>
      </div>
    </div>
  );
}
