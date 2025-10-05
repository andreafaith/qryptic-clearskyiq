interface EmptyStateProps {
  onStartVisualizing: () => void;
  onLearnMore: () => void;
}

export default function EmptyState({ onStartVisualizing, onLearnMore }: EmptyStateProps) {
  return (
    <div className="mt-8 p-8 bg-white/5 rounded-xl">
      <div className="text-center">
        <div className="text-6xl mb-6">🌍</div>
        <h3 className="text-2xl font-semibold mb-4">Welcome to TEMPO Data Visualization</h3>
        <p className="text-white/70 text-lg mb-6 max-w-2xl mx-auto">
          Explore atmospheric pollution data from NASA&apos;s TEMPO satellite. 
          Generate visualizations to understand air quality patterns across North America.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onStartVisualizing}
            className="px-6 py-3 bg-[var(--neon-yellow)] text-[var(--deep-blue)] font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Start Visualizing
          </button>
          <button
            onClick={onLearnMore}
            className="px-6 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
