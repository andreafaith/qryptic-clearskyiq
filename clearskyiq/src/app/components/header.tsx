"use client";

import Image from "next/image";

export default function Header() {
  return (
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
          {/* <span className="font-semibold text-lg tracking-wide">
            ClearSkyIQ
          </span> */}
        </div>

        {/* Nav */}
        <nav className="flex space-x-6 text-sm md:text-base">
          <a href="#" className="hover:text-[var(--neon-yellow)] transition">
            home
          </a>
          <a href="#" className="hover:text-[var(--neon-yellow)] transition">
            learn more
          </a>
          <a href="#" className="hover:text-[var(--neon-yellow)] transition">
            about us
          </a>
        </nav>
      </div>
    </header>
  );
}
