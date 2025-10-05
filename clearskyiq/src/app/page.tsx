"use client";
import Image from "next/image";
import Explore from "./components/Explore";

export default function Home() {
  return (
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
