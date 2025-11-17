import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const halls = [
    { name: "SHPH", path: "/halls/shph" },
    { name: "B24H", path: "/halls/b24h" },
    { name: "SMAH", path: "/halls/smah" },
    { name: "ASH", path: "/halls/ash" },
    { name: "BSCH", path: "/halls/bsch" },
    { name: "FTZH", path: "/halls/ftzh" },
  ];

  return (
    <header className="bg-black text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-[#00df9a]">SUST Hall Management System</Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-[#00df9a]">Home</Link>
          <Link to="/about" className="hover:text-[#00df9a]">About</Link>

          <div
            className="relative"
            onMouseEnter={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
          >
            <button className="hover:text-[#00df9a] flex items-center gap-2">
              Halls <span className="text-sm">▾</span>
            </button>

            {dropdown && (
              <ul className="absolute right-0 mt-2 w-48 bg-black border border-gray-700 rounded-md shadow-lg p-2 z-20">
                {halls.map((h) => (
                  <li key={h.name} className="px-2 py-1 rounded-md hover:bg-[#00df9a] hover:text-black">
                    <Link to={h.path}>{h.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link to="/contact" className="hover:text-[#00df9a]">Hall Administration</Link>

          <Link to="/login" className="bg-[#00df9a] text-black px-3 py-1 rounded-md font-semibold hover:bg-white">Login</Link>
          <Link to="/register" className="border border-[#00df9a] px-3 py-1 rounded-md font-semibold hover:bg-[#00df9a] hover:text-black">Register</Link>
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)} aria-label="toggle menu">
          {open ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-gray-800">
          <div className="px-4 py-4 flex flex-col gap-3">
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/about" onClick={() => setOpen(false)}>About</Link>

            <details className="bg-transparent">
              <summary className="cursor-pointer">Halls</summary>
              <ul className="mt-2 pl-4 space-y-1">
                {halls.map((h) => (
                  <li key={h.name}>
                    <Link to={h.path} onClick={() => setOpen(false)}>{h.name}</Link>
                  </li>
                ))}
              </ul>
            </details>

            <Link to="/contact" onClick={() => setOpen(false)}>Hall Administration</Link>
            <Link to="/login" onClick={() => setOpen(false)} className="bg-[#00df9a] text-black px-3 py-1 rounded-md text-center">Login</Link>
            <Link to="/register" onClick={() => setOpen(false)} className="border border-[#00df9a] px-3 py-1 rounded-md text-center">Register</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;