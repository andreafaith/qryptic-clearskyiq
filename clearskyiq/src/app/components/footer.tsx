"use client";

import Image from "next/image";

export default function Footer() {
  return (
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
  );
}
