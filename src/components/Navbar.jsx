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
                        {/* Forecast link added after Map (desktop) */}
                        <NavLink
                            to="/forecast"
                            className={({ isActive }) =>
                                `${linkBase} ${isActive ? active : ""}`
                            }
                        >
                            Forecast
                        </NavLink>

                        {/* Desktop search on the navbar */}
                        <div className="w-72">
                            <SearchBar />
                        </div>
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
                        {/* Forecast link added after Map (mobile) */}
                        <NavLink
                            to="/forecast"
                            className={({ isActive }) =>
                                `${linkBase} mt-1 ${isActive ? active : ""}`
                            }
                            onClick={closeMenu}
                        >
                            Forecast
                        </NavLink>

                        {/* New Favorites link (after Forecast) */}
                        <NavLink
                            to="/favorites"
                            className={({ isActive }) =>
                                `${linkBase} ${isActive ? active : ""}`
                            }
                        >
                            Favorites
                        </NavLink>
                    </div>
                )}
            </div>
        </nav >
    );
}