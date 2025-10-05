"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 
        w-[35%] transition-all duration-500 
        ${
          scrolled
            ? "bg-white/20 backdrop-blur-md border border-white/10 shadow-[0_0_25px_rgba(234,254,7,0.2)]"
            : "bg-white/10 backdrop-blur-sm border border-white/5"
        } 
        rounded-2xl`}
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Image
            src="/logo.png"
            alt="ClearSkyIQ logo"
            width={80}
            height={80}
            className="rounded"
          />
        </div>

        {/* Nav */}
        <nav className="flex space-x-6 text-sm md:text-base font-medium  tracking-wide">
          <a
            href="#"
            className="text-white hover:text-[var(--neon-yellow)] transition-colors duration-300"
          >
            Home
          </a>
          <a
            href="#"
            className="text-white hover:text-[var(--neon-yellow)] transition-colors duration-300"
          >
            Learn More
          </a>
          <a
            href="#"
            className="text-white hover:text-[var(--neon-yellow)] transition-colors duration-300"
          >
            About Us
          </a>
        </nav>
      </div>
    </header>
  );
}
