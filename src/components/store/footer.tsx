import { Link } from "@tanstack/react-router";
import { Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-ivory/10 bg-night text-ivory">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-8 px-4 py-12 text-center md:flex-row md:items-start md:justify-between md:px-8 md:text-left">
        {/* Brand */}
        <div>
          <p className="font-display text-3xl">ICXC XZS</p>
          <p className="mt-1 font-typewriter text-sm text-ivory/60">Talitha cumi</p>
        </div>

        {/* Pages */}
        <nav className="flex flex-col gap-2 text-sm uppercase tracking-widest text-ivory/70">
          <Link to="/" className="hover:text-ember">
            Home
          </Link>
          <Link to="/gallery" className="hover:text-ember">
            Gallery
          </Link>
          <Link to="/fashion" className="hover:text-ember">
            Fashion
          </Link>
        </nav>

        {/* Contact */}
        <div className="flex flex-col gap-3 text-sm">
          <a
            href="mailto:shortbeachann@gmail.com"
            className="flex items-center gap-2 text-ivory/70 hover:text-ember"
          >
            <Mail className="size-4" /> shortbeachann@gmail.com
          </a>
          <a
            href="https://instagram.com/icxc_xzs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-ivory/70 hover:text-ember"
          >
            <Instagram className="size-4" /> @icxc_xzs
          </a>
        </div>
      </div>

      <p className="border-t border-ivory/10 py-5 text-center text-xs text-ivory/40">
        © {new Date().getFullYear()} ICXC XZS. All rights reserved.
      </p>
    </footer>
  );
}
