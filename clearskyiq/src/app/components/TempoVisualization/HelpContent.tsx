export default function HelpContent() {
  return (
    <div className="mt-8 space-y-8">
      <div className="bg-white/5 rounded-xl p-8">
        <h3 className="text-2xl font-bold mb-6 text-[var(--neon-yellow)]">What is TEMPO?</h3>
        <div className="prose prose-invert max-w-none">
          <p className="text-lg leading-relaxed mb-4">
            TEMPO (Tropospheric Emissions: Monitoring of Pollution) is NASA's first space-based instrument 
            designed to monitor air quality across North America. It provides hourly measurements of 
            atmospheric pollutants including nitrogen dioxide, ozone, and other trace gases.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            This visualization tool allows you to explore TEMPO data through three different visualization types:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-3 text-[var(--neon-yellow)]">Geographic Map</h4>
              <p className="text-white/80">
                Shows pollution levels across geographic regions, helping identify hotspots and spatial patterns.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-3 text-[var(--neon-yellow)]">Zonal Mean Plot</h4>
              <p className="text-white/80">
                Displays average pollution levels by latitude, revealing north-south trends and seasonal patterns.
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-3 text-[var(--neon-yellow)]">Contour Plot</h4>
              <p className="text-white/80">
                Shows detailed 2D patterns of pollution levels with contour lines for precise analysis.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-8">
        <h3 className="text-2xl font-bold mb-6 text-[var(--neon-yellow)]">How to Use</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="bg-[var(--neon-yellow)] text-[var(--deep-blue)] rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
            <div>
              <h4 className="font-semibold text-lg">Select Time Range</h4>
              <p className="text-white/80">Choose start and end times for your data analysis. Data is available from 2023 onwards.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-[var(--neon-yellow)] text-[var(--deep-blue)] rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
            <div>
              <h4 className="font-semibold text-lg">Define Geographic Area</h4>
              <p className="text-white/80">Set a bounding box (west, south, east, north) to focus on specific regions.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-[var(--neon-yellow)] text-[var(--deep-blue)] rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
            <div>
              <h4 className="font-semibold text-lg">Choose Visualization</h4>
              <p className="text-white/80">Select the type of plot that best suits your analysis needs.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-[var(--neon-yellow)] text-[var(--deep-blue)] rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
            <div>
              <h4 className="font-semibold text-lg">Generate & Analyze</h4>
              <p className="text-white/80">Click generate to create your visualization and explore the results.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-8">
        <h3 className="text-2xl font-bold mb-6 text-[var(--neon-yellow)]">Data Sources</h3>
        <div className="space-y-4">
          <p className="text-white/80">
            This tool uses data from NASA's TEMPO mission, processed through the Harmony cloud services platform. 
            The data is freely available through NASA's Earthdata system.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="https://www.earthdata.nasa.gov/data/instruments/tempo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[var(--neon-yellow)] text-[var(--deep-blue)] rounded-lg hover:bg-yellow-400 transition-colors font-semibold"
            >
              TEMPO Mission Info
            </a>
            <a 
              href="https://nasa.github.io/ASDC_Data_and_User_Services/TEMPO/how_to_examine_TEMPO_data_using_harmony-py.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors font-semibold"
            >
              Technical Documentation
            </a>
            <a 
              href="https://www.earthdata.nasa.gov/learn" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors font-semibold"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
