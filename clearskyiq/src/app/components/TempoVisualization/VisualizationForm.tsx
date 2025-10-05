interface VisualizationFormProps {
  formData: {
    startTime: string;
    endTime: string;
    bbox: string;
    variable: string;
    plotType: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTestConnection: () => void;
  isLoading: boolean;
}

export default function VisualizationForm({ 
  formData, 
  onInputChange, 
  onSubmit, 
  onTestConnection, 
  isLoading 
}: VisualizationFormProps) {
  const plotOptions = [
    { value: 'map', label: 'Geographic Map', desc: 'Spatial distribution' },
    { value: 'zonal_mean', label: 'Zonal Mean', desc: 'Latitude averages' },
    { value: 'contour', label: 'Contour Plot', desc: '2D patterns' },
    { value: 'all_three', label: 'All Three', desc: 'Complete analysis' }
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium mb-3">
              Start Time:
            </label>
            <input
              type="datetime-local"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={onInputChange}
              min="2023-01-01T00:00"
              max="2024-12-31T23:59"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[var(--neon-yellow)]"
            />
          </div>
          
          <div className="mt-2">
            <label htmlFor="endTime" className="block text-sm font-medium mb-3">
              End Time:
            </label>
            <input
              type="datetime-local"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={onInputChange}
              min="2023-01-01T00:00"
              max="2024-12-31T23:59"
              required
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[var(--neon-yellow)]"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="bbox" className="block text-sm font-medium mb-3">
              Bounding Box (West, South, East, North):
            </label>
            <input
              type="text"
              id="bbox"
              name="bbox"
              value={formData.bbox}
              onChange={onInputChange}
              placeholder="e.g., -150, -40, 14, 65"
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[var(--neon-yellow)]"
            />
            <p className="text-xs text-white/60">
              Format: longitude_min, latitude_min, longitude_max, latitude_max
            </p>
          </div>

          <div>
            <label htmlFor="variable" className="block text-sm font-medium mb-3">
              Variable:
            </label>
            <select
              id="variable"
              name="variable"
              value={formData.variable}
              onChange={onInputChange}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-[var(--neon-yellow)]"
            >
              <option value="product/vertical_column">Vertical Column (Total)</option>
              <option value="product/vertical_column_troposphere">Vertical Column Troposphere</option>
              <option value="product/main_data_quality_flag">Data Quality Flag</option>
            </select>
            <p className="text-xs text-white/60 mt-2">
              {formData.variable === 'product/vertical_column' && 'Total atmospheric column density (molecules/cm²)'}
              {formData.variable === 'product/vertical_column_troposphere' && 'Tropospheric column density (molecules/cm²)'}
              {formData.variable === 'product/main_data_quality_flag' && 'Data quality indicator (0=good, 1=questionable, 2=bad)'}
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-4">Visualization Type:</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plotOptions.map((option) => (
            <label key={option.value} className="cursor-pointer">
              <input
                type="radio"
                name="plotType"
                value={option.value}
                checked={formData.plotType === option.value}
                onChange={onInputChange}
                className="sr-only"
              />
              <div className={`p-4 rounded-lg border-2 transition-all ${
                formData.plotType === option.value
                  ? 'border-[var(--neon-yellow)] bg-[var(--neon-yellow)]/20'
                  : 'border-white/30 hover:border-white/50'
              }`}>
                <div className="font-semibold text-sm">{option.label}</div>
                <div className="text-xs text-white/70 mt-1">{option.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-4 bg-[var(--neon-yellow)] text-[var(--deep-blue)] font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {isLoading ? 'Generating...' : 'Generate Visualization'}
        </button>
        
        <button
          type="button"
          onClick={onTestConnection}
          disabled={isLoading}
          className="px-8 py-4 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          Test API Connection
        </button>
      </div>
    </form>
  );
}
