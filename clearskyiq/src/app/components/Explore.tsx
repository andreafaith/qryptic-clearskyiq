"use client";

import Image from "next/image";

export default function Explore() {
  const exploreItems = [
    {
      id: 1,
      title: "Dynamic Air Quality Timeline",
      description:
        "Interactive time-lapse visualization showing AQI evolution across hours or days, with color gradients to represent pollution intensity changes over time.",
      image: "/aqi.png",
    },
    {
      id: 2,
      title: "3D Atmospheric Layer View",
      description:
        "A 3D globe that visualizes pollutant dispersion vertically through the atmosphere using NASA CALIPSO and MERRA-2 aerosol data.",
      image: "/phm.png",
    },
    {
      id: 3,
      title: "Comparative City Dashboard",
      description:
        "Side-by-side visualization comparing AQI, temperature, and pollutant breakdowns across multiple cities or regions.",
      image: "/dashboard.png",
    },
    {
      id: 4,
      title: "Pollutant Composition Wheel",
      description:
        "A radial chart showing pollutant composition (PM2.5, NO₂, O₃, CO) as percentage slices — helpful for quickly assessing pollutant dominance.",
      image: "/healthrecoms.png",
    },
    {
      id: 5,
      title: "Correlation Heatmap",
      description:
        "A matrix heatmap displaying relationships between pollutants, meteorological conditions (wind, humidity), and AQI variation.",
      image: "/wildfire.png",
    },
    {
      id: 6,
      title: "Historical Trend Explorer",
      description:
        "Visualize long-term trends and seasonal pollution cycles with smooth animation transitions and time controls.",
      image: "/anomaly.png",
    },
  ];

  return (
    <section className="w-full text-white py-20 px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,254,7,0.1)_0%,transparent_70%)]"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Section Title */}
        <h2 className="text-4xl font-extrabold mb-12 tracking-tight uppercase text-[var(--neon-yellow)] drop-shadow-[0_0_10px_rgba(234,254,7,0.8)]">
          Explore
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
          {exploreItems.map((item) => (
            <div
              key={item.id}
              className="relative group bg-[#0f1f47] border border-[var(--neon-yellow)]/20 rounded-2xl overflow-hidden p-6 flex flex-col items-center text-center shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:border-[var(--neon-yellow)]/70 hover:shadow-[0_0_25px_rgba(234,254,7,0.4)] transition-all duration-300"
            >
              {/* Image */}
              <div className="w-24 h-24 mb-5 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={100}
                  height={100}
                  className="object-contain w-full h-full"
                />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-3 text-[var(--neon-yellow)] group-hover:text-white transition-colors">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                {item.description}
              </p>

              {/* Button */}
              <button className="mt-auto flex items-center gap-2 bg-[var(--neon-blue)] text-white font-semibold px-6 py-3 shadow- hover:scale-105 transition-all duration-300">
                Learn More
              </button>
            </div>
          ))}
        </div>

        {/* CTA BOX */}
        <div className="bg-[#142b5f]/80 border border-[var(--neon-yellow)]/40 rounded-xl py-6 px-8 inline-block shadow-[0_0_25px_rgba(234,254,7,0.2)] hover:shadow-[0_0_40px_rgba(234,254,7,0.3)] transition-shadow duration-300">
          <p className="text-lg font-medium text-[var(--neon-yellow)]">
            Explore the Machine Learning Model Powering These Features
          </p>
        </div>
      </div>
    </section>
  );
}
