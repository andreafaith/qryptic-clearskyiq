import Image from 'next/image';

interface VisualizationCardProps {
  plotType: string;
  plotData: {
    success: boolean;
    image_base64?: string;
    error?: string;
  };
  plotNames: { [key: string]: string };
}

export default function VisualizationCard({ plotType, plotData, plotNames }: VisualizationCardProps) {
  return (
    <div className="bg-white/5 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-lg font-semibold">
          {plotNames[plotType] || plotType}
        </h5>
        {plotData.success ? (
          <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
            Success
          </span>
        ) : (
          <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
            Error
          </span>
        )}
      </div>
      
      {plotData.success && plotData.image_base64 ? (
        <div className="text-center">
          <Image
            src={`data:image/png;base64,${plotData.image_base64}`}
            alt={`TEMPO ${plotNames[plotType] || plotType}`}
            width={900}
            height={675}
            className="mx-auto rounded-lg shadow-lg max-w-full h-auto"
          />
        </div>
      ) : (
        <div className="text-center py-8 text-white/50">
          <p>Failed to generate visualization</p>
          {plotData.error && (
            <p className="text-sm mt-2 text-red-300">{plotData.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
