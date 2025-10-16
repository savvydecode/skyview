import { useState } from "react";
import useCityStore from "../store";

/**
 * Simple search bar that sets the city name in the Zustand store.
 * - On submit, it trims the input and saves it to the store.
 * - Shows a small inline error if input is empty.
 * - Works in both navbar (desktop) and stacked layout (mobile).
 */
export default function SearchBar({ className = "" }) {
    const [value, setValue] = useState("");
    const [err, setErr] = useState("");
    const setCity = useCityStore((s) => s.setCity);

    const onSubmit = (e) => {
        e.preventDefault();
        const city = (value || "").trim();

        if (!city) {
            setErr("Type a city name");
            return;
        }

        setErr("");
        setCity(city);
        // Optional: keep text for quick tweaks or clear it
        // setValue("");
    };

    return (
        <form
            onSubmit={onSubmit}
            className={[
                "flex items-center gap-2",
                "w-full",
                className,
            ].join(" ")}
            aria-label="Search city"
        >
            <div className="flex-1">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        if (err) setErr("");
                    }}
                    placeholder="Search city..."
                    className={[
                        "w-full",
                        "px-3 py-2",
                        "rounded-xl",
                        "border border-gray-300",
                        "bg-white text-gray-900",
                        "placeholder:text-gray-400",
                        "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent",
                    ].join(" ")}
                    aria-invalid={err ? "true" : "false"}
                    aria-describedby={err ? "searchbar-error" : undefined}
                />
                {err ? (
                    <p id="searchbar-error" className="mt-1 text-xs text-red-600">
                        {err}
                    </p>
                ) : null}
            </div>

            <button
                type="submit"
                className={[
                    "shrink-0",
                    "px-4 py-2",
                    "rounded-xl",
                    "bg-blue-600 text-white",
                    "hover:bg-blue-700",
                    "active:bg-blue-800",
                    "transition-colors",
                ].join(" ")}
                aria-label="Search"
            >
                Search
            </button>
        </form>
    );
}