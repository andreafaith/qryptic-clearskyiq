"use client";

import Image from "next/image";
import Link from "next/link";

export default function Explore() {
  const exploreItems = [
    {
      id: 1,
      title: "Dynamic Air Quality Timeline",
      description:
        "Interactive time-lapse visualization showing AQI evolution across hours or days, with color gradients to represent pollution intensity changes over time.",
      image: "/aqi.png",
      href: "/explore/air-quality-timeline",
    },
    {
      id: 2,
      title: "3D Atmospheric Layer View",
      description:
        "A 3D globe that visualizes pollutant dispersion vertically through the atmosphere using NASA CALIPSO and MERRA-2 aerosol data.",
      image: "/phm.png",
      href: "/explore/3d-layer-view",
    },
    {
      id: 3,
      title: "Comparative City Dashboard",
      description:
        "Side-by-side visualization comparing AQI, temperature, and pollutant breakdowns across multiple cities or regions.",
      image: "/dashboard.png",
      href: "/explore/city-dashboard",
    },
    {
      id: 4,
      title: "Pollutant Composition Wheel",
      description:
        "A radial chart showing pollutant composition (PM2.5, NO₂, O₃, CO) as percentage slices — helpful for quickly assessing pollutant dominance.",
      image: "/healthrecoms.png",
      href: "/explore/composition-wheel",
    },
    {
      id: 5,
      title: "Correlation Heatmap",
      description:
        "A matrix heatmap displaying relationships between pollutants, meteorological conditions (wind, humidity), and AQI variation.",
      image: "/wildfire.png",
      href: "/explore/correlation-heatmap",
    },
    {
      id: 6,
      title: "Historical Trend Explorer",
      description:
        "Visualize long-term trends and seasonal pollution cycles with smooth animation transitions and time controls.",
      image: "/anomaly.png",
      href: "/explore/historical-trends",
    },
  ];

  return (
    <section className="w-full text-white py-20 px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,254,7,0.1)_0%,transparent_70%)]"></div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Section Title */}
        <h2 className="text-3xl font-extrabold mb-12 tracking-tight uppercase text-[var(--neon-yellow)]">
          Explore the Machine Learning Models
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
          {exploreItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
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
              <h3 className="text-xl uppercase font-bold mb-3 text-[var(--neon-yellow)]">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                {item.description}
              </p>

              {/* Button */}
              <div className="mt-auto flex justify-center">
                <span className="uppercase text-sm flex items-center gap-2 bg-[var(--neon-blue)] text-white font-semibold px-6 py-3  shadow-md hover:scale-105 transition-all duration-300">
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
