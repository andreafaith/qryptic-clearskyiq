"use client";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/* WELCOME SECTION */}
      <section className="w-full bg-[var(--deep-blue)] text-white text-center py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-medium opacity-80">
            Welcome to
          </h1>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[var(--neon-yellow)] mt-2">
            ClearSkyIQ
          </h1>
          <p className="text-base md:text-lg opacity-90 mt-6 leading-relaxed">
            A space-data intelligence platform empowering researchers and
            innovators to visualize, analyze, and understand our skies.
          </p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="w-full bg-[var(--blue-yonder)] text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 py-20 px-6">
          {/* LEFT SIDE — Text */}
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              What is ClearSkyIQ?
            </h2>
            <p className="text-base md:text-lg opacity-90 leading-relaxed">
              ClearSkyIQ is a data-driven platform designed to empower researchers,
              students, and innovators with insights about atmospheric and satellite
              conditions. Our mission is to make complex space and environmental data
              accessible, actionable, and visually engaging for everyone.
              <br />
              <br />
              Whether you’re analyzing air quality trends or contributing to global
              sustainability goals, ClearSkyIQ helps you see the bigger picture — one
              dataset at a time.
            </p>
          </div>

          {/* RIGHT SIDE — Image */}
          <div className="flex-1 flex justify-center">
            <Image
              src="/clearsky-preview.png"
              alt="Illustration of ClearSkyIQ data visualization"
              width={500}
              height={400}
              className="rounded-2xl shadow-lg object-cover"
            />
          </div>
        </div>
      </section>

      {/* EXPLORE SECTION */}
      <section className="w-full bg-[var(--deep-blue)] text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Title */}
          <h2 className="text-4xl font-bold mb-12 tracking-tight">Explore</h2>

          {/* 3x2 GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="border border-white rounded-2xl flex items-center justify-center h-56 transition-transform hover:scale-105"
              >
                <Image
                  src={`/explore-${i}.png`}
                  alt={`Explore item ${i}`}
                  width={160}
                  height={160}
                  className="object-contain rounded-xl"
                />
              </div>
            ))}
          </div>

          {/* CTA BOX */}
          <div className="border border-white rounded-xl py-6 px-8 inline-block">
            <p className="text-lg font-medium">
              Explore the Machine Learning Model Used Here
            </p>
          </div>
        </div>
      </section>

      {/* MEET THE TEAM SECTION */}
      <section className="w-full bg-[var(--blue-yonder)] text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Title */}
          <h2 className="text-4xl font-bold mb-12 tracking-tight">
            Meet the Team
          </h2>

          {/* 3x2 GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                name: "Andrea Faith Alimorong",
                position: "A",
                img: "/team-1.png",
              },
              {
                name: "Loyd Martin Vendiola",
                position: "B",
                img: "/team-2.png",
              },
              {
                name: "Harold Martin Patacsil",
                position: "C",
                img: "/team-3.png",
              },
              {
                name: "Scheidj Bleu Villados",
                position: "D",
                img: "/team-4.png",
              },
              {
                name: "Francheska Ivonne Ojastro",
                position: "E",
                img: "/team-5.png",
              },
              {
                name: "Jean Carlo San Juan",
                position: "F",
                img: "/team-6.png",
              },
            ].map((member, i) => (
              <div
                key={i}
                className="border border-white rounded-2xl flex flex-col items-center justify-center p-6 transition-transform hover:scale-105"
              >
                <Image
                  src={member.img}
                  alt={member.name}
                  width={140}
                  height={140}
                  className="rounded-full mb-4 object-cover border border-white"
                />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-sm opacity-80">{member.position}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
