"use client";
import Image from "next/image";
import Explore from "./components/Explore";
import TempoVisualization from "./components/TempoVisualization";

export default function Home() {
  return (
    <div className="container py-50">
      
      <Explore />


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
