interface ErrorDisplayProps {
  error: string;
  retryCount: number;
  onRetry: () => void;
}

export default function ErrorDisplay({ error, retryCount, onRetry }: ErrorDisplayProps) {
  return (
    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-6 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-lg mb-2">Error</h4>
          <p>{error}</p>
          {retryCount > 0 && (
            <p className="text-sm mt-2 opacity-80">
              Retry attempt: {retryCount}
            </p>
          )}
        </div>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
