import React from "react";
import { Link } from "react-router-dom";

// Footer component for all pages
// - Matches existing styling (Tailwind, max width, blur, borders)
// - Supports dark mode via Tailwind `dark:` classes
// - Shows brand, quick navigation links, and © Stephen Addo with the current year
export default function Footer({ className = "" }) {
    const year = new Date().getFullYear();

    return (
        <footer
            className={[
                "mt-8 border-t border-gray-200 bg-white/80 backdrop-blur",
                "dark:bg-gray-900/80 dark:border-gray-800",
                className
            ].join(" ")}
        >
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    {/* Brand */}
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold">
                        <span role="img" aria-label="weather">⛅</span>
                        <span>SkyView</span>
                    </div>

                    {/* Quick links */}
                    <nav
                        aria-label="Footer navigation"
                        className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
                    >
                        <Link className="text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-300" to="/">Home</Link>
                        <Link className="text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-300" to="/map">Map</Link>
                        <Link className="text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-300" to="/forecast">Forecast</Link>
                        <Link className="text-gray-700 hover:text-blue-700 dark:text-gray-200 dark:hover:text-blue-300" to="/favorites">Favorites</Link>
                    </nav>

                    {/* Copyright */}
                    <div className="text-sm text-gray-600 dark:text-gray-300 text-center">
                        © {year} Stephen Addo. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}