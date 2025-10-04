"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--electric-blue)] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left: Logo + tagline */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="ClearSkyIQ logo"
              width={56}
              height={56}
              className="rounded-md shadow-md"
            />
            <span className="text-2xl font-semibold tracking-wide">
              ClearSkyIQ
            </span>
          </div>
          <p className="text-base text-white/70 max-w-sm leading-relaxed">
            Empowering space innovation through data, technology, and global collaboration.
          </p>
        </div>

        {/* Middle: Quick Links */}
        <div>
          <h4 className="font-semibold mb-5 text-[var(--neon-yellow)] tracking-wide uppercase text-sm">
            Quick Links
          </h4>
          <ul className="space-y-3 text-base">
            {["Home", "About", "Projects", "Team", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-[var(--neon-yellow)] hover:drop-shadow-[0_0_6px_var(--neon-yellow)] transition-all duration-200"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Contact Info */}
        <div>
          <h4 className="font-semibold mb-5 text-[var(--neon-yellow)] tracking-wide uppercase text-sm">
            Contact
          </h4>
          <ul className="space-y-3 text-base">
            <li>
              <a
                href="mailto:team@clearskyiq.org"
                className="hover:text-[var(--neon-yellow)] hover:drop-shadow-[0_0_6px_var(--neon-yellow)] transition-all duration-200"
              >
                team@clearskyiq.org
              </a>
            </li>
            <li>
              <a
                href="tel:+1234567890"
                className="hover:text-[var(--neon-yellow)] hover:drop-shadow-[0_0_6px_var(--neon-yellow)] transition-all duration-200"
              >
                +1 (234) 567-890
              </a>
            </li>
            <li className="text-white/70">
              123 Orbit Street, Innovation City, Earth
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 mt-8 py-6 text-center text-sm text-white/60">
        © {new Date().getFullYear()} <span className="text-white font-medium">ClearSkyIQ</span> — Built for NASA Space Apps Challenge 🚀
      </div>
    </footer>
  );
}
