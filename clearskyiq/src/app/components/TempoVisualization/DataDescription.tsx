interface DataDescriptionProps {
  startTime: string;
  endTime: string;
  bbox?: number[];
  variable: string;
}

export default function DataDescription({ startTime, endTime, bbox, variable }: DataDescriptionProps) {
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatBbox = (bbox: number[]) => {
    if (!bbox || bbox.length !== 4) return 'Global';
    const [west, south, east, north] = bbox;
    return `${west.toFixed(1)}°W, ${south.toFixed(1)}°N to ${east.toFixed(1)}°W, ${north.toFixed(1)}°N`;
  };

  return (
    <div className="bg-white/5 rounded-xl p-6 mb-8">
      <h4 className="text-lg font-semibold mb-4 text-[var(--neon-yellow)]">Sample Data Information</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-white/70">Time Range:</span>
          <div className="font-medium text-white">
            {formatDateTime(startTime)} to {formatDateTime(endTime)}
          </div>
        </div>
        <div>
          <span className="text-white/70">Geographic Area:</span>
          <div className="font-medium text-white">
            {bbox ? formatBbox(bbox) : 'Global'}
          </div>
        </div>
        <div>
          <span className="text-white/70">Variable:</span>
          <div className="font-medium text-white">
            {variable.replace('product/', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
        </div>
        <div>
          <span className="text-white/70">Data Source:</span>
          <div className="font-medium text-white">
            NASA TEMPO L2
          </div>
        </div>
      </div>
    </div>
  );
}
