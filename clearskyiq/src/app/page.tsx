"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="w-full bg-[var(--deep-blue)] text-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="ClearSkyIQ logo"
              width={40}
              height={40}
              className="rounded"
            />
            <span className="font-semibold text-lg tracking-wide">ClearSkyIQ</span>
          </div>

          {/* Nav */}
          <nav className="flex space-x-6 text-sm md:text-base">
            <a href="#" className="hover:text-[var(--neon-yellow)] transition">
              Home
            </a>
            <a href="#" className="hover:text-[var(--neon-yellow)] transition">
              Learn More
            </a>
            <a href="#" className="hover:text-[var(--neon-yellow)] transition">
              About Us
            </a>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-grow flex items-center justify-center bg-[var(--blue-yonder)] text-white">
        <p className="text-xl font-medium opacity-80">
          [Main content goes here]
        </p>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[var(--electric-blue)] text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between p-6 gap-8">
          {/* Left logo */}
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="ClearSkyIQ logo"
              width={40}
              height={40}
              className="rounded"
            />
            <span className="font-semibold text-lg tracking-wide">ClearSkyIQ</span>
          </div>

          {/* Right columns */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-2">ClearSkyIQ</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="#" className="hover:text-[var(--neon-yellow)] transition">
                    home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[var(--neon-yellow)] transition">
                    about
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[var(--neon-yellow)] transition">
                    contact us
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Details */}
            <div>
              <h4 className="font-semibold mb-2">Contact</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <a
                    href="mailto:team@clearskyiq.org"
                    className="hover:text-[var(--neon-yellow)] transition"
                  >
                    team@clearskyiq.org
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+1234567890"
                    className="hover:text-[var(--neon-yellow)] transition"
                  >
                    +1 (234) 567-890
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
