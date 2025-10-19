import { useState } from "react";
import { NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const linkBase =
        "block px-4 py-2 rounded-lg text-gray-800 hover:bg-blue-100 hover:text-blue-700";
    const active =
        "bg-blue-600 text-white hover:bg-blue-700 hover:text-white";

    const closeMenu = () => setOpen(false);

    // Added: local dark mode toggle (no changes to existing logic)
    const [isDark, setIsDark] = useState(() => {
        if (typeof document === "undefined") return false;
        const saved = (() => {
            try { return localStorage.getItem("theme"); } catch { return null; }
        })();
        if (saved === "dark") return true;
        if (saved === "light") return false;
        return document.documentElement.classList.contains("dark");
    });

    const toggleTheme = () => {
        const root = document.documentElement;
        const next = !isDark;
        setIsDark(next);
        if (next) {
            root.classList.add("dark");
            root.style.colorScheme = "dark";
            try { localStorage.setItem("theme", "dark"); } catch { }
        } else {
            root.classList.remove("dark");
            root.style.colorScheme = "light";
            try { localStorage.setItem("theme", "light"); } catch { }
        }
    };

    return (
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4">
                {/* Top bar row */}
                <div className="flex items-center justify-between h-14">
                    {/* Brand */}
                    <NavLink
                        to="/"
                        className="flex items-center gap-2 text-xl font-semibold text-blue-700"
                        onClick={closeMenu}
                    >
                        <span role="img" aria-label="weather">⛅</span>
                        <span>SkyView</span>
                    </NavLink>

                    {/* Desktop: links + search inline */}
                    <div className="hidden md:flex items-center gap-3">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `${linkBase} ${isActive ? active : ""}`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/map"
                            className={({ isActive }) =>
                                `${linkBase} ${isActive ? active : ""}`
                            }
                        >
                            <span className="mr-2" role="img" aria-label="map">🗺️</span>
                            Map
                        </NavLink>

                        {/* Added: Favorites link (desktop) */}
                        <NavLink
                            to="/favorites"
                            className={({ isActive }) =>
                                `${linkBase} ${isActive ? active : ""}`
                            }
                        >
                            Favorites
                        </NavLink>

                        {/* If Forecast/Favorites links already exist in your file, keep them as-is.
                           We are only adding the dark mode toggle button below. */}

                        {/* Desktop search on the navbar */}
                        <div className="w-72">
                            <SearchBar />
                        </div>

                        {/* Added: Dark mode toggle (desktop) */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-pressed={isDark}
                            aria-label="Toggle dark mode"
                            title="Toggle dark mode"
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-800 hover:bg-blue-100 hover:text-blue-700"
                        >
                            {isDark ? "☀️ Light" : "🌙 Dark"}
                        </button>
                    </div>

                    {/* Mobile: hamburger */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100"
                        aria-label="Toggle menu"
                        aria-expanded={open}
                    >
                        <svg
                            className="w-6 h-6 text-gray-800"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {open ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile: search shown below the navbar (always visible on small screens) */}
                <div className="md:hidden pt-2 pb-2">
                    <SearchBar />
                </div>

                {/* Mobile menu (links) */}
                {open && (
                    <div className="md:hidden pb-3">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `${linkBase} mt-1 ${isActive ? active : ""}`
                            }
                            onClick={closeMenu}
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/map"
                            className={({ isActive }) =>
                                `${linkBase} mt-1 ${isActive ? active : ""}`
                            }
                            onClick={closeMenu}
                        >
                            <span className="mr-2" role="img" aria-label="map">🗺️</span>
                            Map
                        </NavLink>

                        {/* If Forecast/Favorites links already exist in your file, keep them as-is. */}

                        {/* Added: Dark mode toggle (mobile) */}
                        <button
                            type="button"
                            onClick={() => { toggleTheme(); closeMenu(); }}
                            aria-pressed={isDark}
                            aria-label="Toggle dark mode"
                            title="Toggle dark mode"
                            className={`${linkBase} mt-1 border border-gray-200`}
                        >
                            {isDark ? "☀️ Light mode" : "🌙 Dark mode"}
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}