"use client";
import Image from "next/image";
import TempoVisualization from "./components/TempoVisualization";
import Explore from "./components/Explore";

export default function Home() {
  const exploreItems = [
    {
      id: 1,
      title: "Air Quality Analysis",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop&crop=center"
    },
    {
      id: 2,
      title: "Satellite Data",
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=200&h=200&fit=crop&crop=center"
    },
    {
      id: 3,
      title: "Weather Patterns",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=200&h=200&fit=crop&crop=center"
    },
    {
      id: 4,
      title: "Climate Trends",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&h=200&fit=crop&crop=center"
    },
    {
      id: 5,
      title: "Atmospheric Data",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&crop=center"
    },
    {
      id: 6,
      title: "Environmental Insights",
      image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=200&h=200&fit=crop&crop=center"
    }
  ];

  return (
    <>
      <div className="container">
        {/* WELCOME SECTION */}
        <section className="w-full bg-[var(--blue-yonder)] text-white text-center py-20">
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
        <div>
      <Explore />

      {/* ABOUT SECTION */}
      <section className="w-full text-white">
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
            <img
              src="https://static.vecteezy.com/system/resources/previews/010/282/151/large_2x/clear-sky-pictures-bright-sky-background-cloudless-sky-free-photo.jpeg"
              alt="Illustration of ClearSkyIQ data visualization"
              width={500}
              height={400}
              className="rounded-2xl shadow-lg object-cover"
            />
          </div>
        </div>
      </section>

      {/* EXPLORE SECTION */}
      <section className="w-full bg-[var(--blue-yonder)] text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Title */}
          <h2 className="text-4xl font-bold mb-12 tracking-tight">Explore</h2>

         
        {/* 3x2 GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
          {exploreItems.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden flex items-center justify-center h-56 group transition-transform hover:scale-105"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={200}
                height={200}
                className="object-contain"
              />

              {/* Overlay with Title */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <h3 className="text-lg font-semibold">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

          {/* CTA BOX */}
          <div className="bg-[var(--deep-blue)] border border-white rounded-xl py-6 px-8 inline-block">
            <p className="text-lg font-medium">
              Explore the Machine Learning Model Used Here
            </p>
          </div>
        </div>
      </section>

      {/* NASA TEMPO DATA VISUALIZATION SECTION */}
      <TempoVisualization />

      {/* MEET THE TEAM SECTION */}
      <section className="w-full text-white py-20 px-6">
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
                position: "Engineer",
                img: "/team-1.png",
              },
              {
                name: "Loyd Martin Vendiola",
                position: "Engineer",
                img: "/team-2.png",
              },
              {
                name: "Harold Martin Patacsil",
                position: "Engineer",
                img: "/team-3.png",
              },
              {
                name: "Scheidj Bleu Villados",
                position: "Engineer",
                img: "/team-4.png",
              },
              {
                name: "Francheska Ivonne Ojastro",
                position: "UI Designer",
                img: "/team-5.png",
              },
              {
                name: "Jean Carlo San Juan",
                position: "Engineer",
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
      </div>
    </>
  );
}
