import useCityStore from "../../store";
import CurrentWeatherData from "../../services/WeatherService";
import { useState, useEffect } from "react";

export default function CurrentWeather() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [temp, setTemp] = useState("");
    const [unit, setUnit] = useState("celsius"); // "celsius" | "fahrenheit" | "kelvin"

    // get city from store
    const city = useCityStore((state) => state.city);
    const initCityFromGeolocation = useCityStore((state) => state.initCityFromGeolocation);

    // ADDED: favorites selectors from zustand store (no changes to existing lines)
    const favorites = useCityStore((state) => state.favorites);
    const toggleFavorite = useCityStore((state) => state.toggleFavorite);

    // try to find the user's city on first load and save to store
    useEffect(() => {
        if (!city) {
            initCityFromGeolocation();
        }
    }, []); // run only once on mount

    // helper: convert kelvin to selected unit
    const convertTemp = (kelvin, selectedUnit) => {
        if (kelvin == null) return null;
        if (selectedUnit === "celsius") return Math.round(kelvin - 273.15);
        if (selectedUnit === "fahrenheit") return Math.round((kelvin - 273.15) * 9 / 5 + 32);
        return Math.round(kelvin); // kelvin
    };

    // helper: format unix time with timezone offset (in seconds)
    const formatTime = (unixSeconds, tzOffsetSeconds) => {
        if (!unixSeconds && unixSeconds !== 0) return "";
        const date = new Date((unixSeconds + (tzOffsetSeconds || 0)) * 1000);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    // helper: degrees to compass direction (e.g., N, NE, E, ...)
    const degToCompass = (deg) => {
        if (deg == null) return "";
        const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "S", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        const idx = Math.round(deg / 22.5) % 16;
        return dirs[idx];
    };

    // helper: title-case description
    const titleCase = (s) => {
        if (!s || typeof s !== "string") return "";
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    // fetch weather when city changes
    useEffect(() => {
        const fetchData = async () => {
            setError("");
            setData(null);

            if (!city) {
                return;
            } else {
                setLoading(true);
            }

            try {
                const getData = await CurrentWeatherData(city);
                // if response is okay, it won't have a .message (based on current service)
                if (getData?.message === undefined) {
                    setData(getData);
                    setTemp(convertTemp(getData.main?.temp, unit));
                    setError(null);
                    setLoading(false);
                } else {
                    setError(getData.message);
                    setData(null);
                    setLoading(false);
                }
            } catch (err) {
                setLoading(false);
            }
        };

        fetchData();
    }, [city]);

    // if unit changes or data changes, recompute main temp display
    useEffect(() => {
        if (data?.main?.temp != null) {
            setTemp(convertTemp(data.main.temp, unit));
        }
    }, [unit, data]);

    // handle unit change from the select
    const handleChange = (e) => {
        const selectedUnit = e.target.value;
        setUnit(selectedUnit);
        if (data?.main?.temp != null) {
            setTemp(convertTemp(data.main.temp, selectedUnit));
        }
    };

    // derived values (safe checks everywhere)
    const name = data?.name || city || "";
    const country = data?.sys?.country || "";
    const icon = data?.weather?.[0]?.icon || "";
    const desc = titleCase(data?.weather?.[0]?.description || "");
    const feels = data?.main?.feels_like != null ? convertTemp(data.main.feels_like, unit) : null;
    const tMin = data?.main?.temp_min != null ? convertTemp(data.main.temp_min, unit) : null;
    const tMax = data?.main?.temp_max != null ? convertTemp(data.main.temp_max, unit) : null;
    const humidity = data?.main?.humidity;
    const pressure = data?.main?.pressure;
    const visibilityKm = data?.visibility != null ? (data.visibility / 1000).toFixed(1) : null;
    const windMs = data?.wind?.speed != null ? data.wind.speed : null;
    const windKmh = windMs != null ? Math.round(windMs * 3.6) : null;
    const windDeg = data?.wind?.deg;
    const windGust = data?.wind?.gust;
    const clouds = data?.clouds?.all;
    const sunrise = data?.sys?.sunrise;
    const sunset = data?.sys?.sunset;
    const tzOffset = data?.timezone || 0;
    const updatedAt = data?.dt;

    // ADDED: compute favorite state for the current city (subscribes to favorites via selector above)
    const isFav = (favorites || []).some(
        (i) => i.key === (name || "").trim().toLowerCase()
    );

    return (
        <div className={[
            "mx-4 my-3 rounded-2xl p-5",
            "bg-gradient-to-br from-blue-50 to-indigo-100",
            "shadow-md"
        ].join(" ")}>

            {/* Display error if there is */}
            {error && (
                <div className="text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                    Error fetching data: {error}
                </div>
            )}

            {/* render loading if loading state is true */}
            {loading && <div className="text-center text-gray-600">Loading...</div>}

            {!city && !loading && !error && (
                <div className="text-center text-gray-500">Enter a City or allow location</div>
            )}

            {city && !loading && !data && !error && <div className="text-center">Data Not Found</div>}

            {data && !loading && !error && (
                <div className="space-y-4">

                    {/* Header: Location, time, unit select */}
                    <div className="flex flex-col sm:flex-row  sm:items-center sm:justify-between gap-3">
                        <div>
                            <div className="text-2xl font-semibold text-gray-900">
                                {name}{country ? `, ${country}` : ""}
                            </div>
                            <div className="text-sm text-gray-600">
                                Last updated: {updatedAt ? formatTime(updatedAt, tzOffset) : "--:--"} (local)
                            </div>
                        </div>
                        <div className="flex  flex-col xs:flex-row items-center gap-3">
                            <label htmlFor="temperature" className="text-sm text-gray-700">Units:</label>
                            <select
                                name="temperature"
                                id="temperature"
                                className="border border-gray-300 rounded-xl px-3 py-2 text-gray-900 bg-white"
                                value={unit}
                                onChange={handleChange}
                            >
                                <option value="celsius">Celsius (°C)</option>
                                <option value="fahrenheit">Fahrenheit (°F)</option>
                                <option value="kelvin">Kelvin (K)</option>
                            </select>

                            {/* ADDED: Favorite toggle button */}
                            <button
                                type="button"
                                onClick={() => { if (name) toggleFavorite(name); }}
                                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm   ${
                                    isFav
                                        ? "border-yellow-400 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                                aria-pressed={isFav}
                                aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                                title={isFav ? "Remove from favorites" : "Add to favorites"}
                            >
                                <span aria-hidden="true">{isFav ? "★" : "☆"}</span>
                                {isFav ? "Favorite" : "Add to favorites"}
                            </button>
                        </div>
                    </div>

                    {/* Main row: Icon + Big Temp + Description */}
                    <div className="flex items-center gap-4">
                        {icon && (
                            <img
                                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                                alt={desc}
                                width={72}
                                height={72}
                                className="shrink-0"
                            />
                        )}
                        <div className="flex items-baseline gap-3">
                            <div className="text-5xl font-bold text-gray-900">
                                {temp !== "" && temp !== null ? temp : "--"}
                                <span className="text-2xl ml-1">
                                    {unit === "celsius" ? "°C" : unit === "fahrenheit" ? "°F" : "K"}
                                </span>
                            </div>
                            <div className="text-gray-700 text-lg">{desc}</div>
                        </div>
                    </div>

                    {/* Key stats grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="text-sm text-gray-600">Feels Like</div>
                            <div className="text-xl font-semibold text-gray-900">
                                {feels != null ? feels : "--"}
                                <span className="text-base ml-1">
                                    {unit === "celsius" ? "°C" : unit === "fahrenheit" ? "°F" : "K"}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="text-sm text-gray-600">Min / Max</div>
                            <div className="text-xl font-semibold text-gray-900">
                                {tMin != null ? tMin : "--"} / {tMax != null ? tMax : "--"}
                                <span className="text-base ml-1">
                                    {unit === "celsius" ? "°C" : unit === "fahrenheit" ? "°F" : "K"}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="text-sm text-gray-600">Humidity</div>
                            <div className="text-xl font-semibold text-gray-900">
                                {humidity != null ? `${humidity}%` : "--"}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="text-sm text-gray-600">Pressure</div>
                            <div className="text-xl font-semibold text-gray-900">
                                {pressure != null ? `${pressure} hPa` : "--"}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="text-sm text-gray-600">Visibility</div>
                            <div className="text-xl font-semibold text-gray-900">
                                {visibilityKm != null ? `${visibilityKm} km` : "--"}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="text-sm text-gray-600">Cloudiness</div>
                            <div className="text-xl font-semibold text-gray-900">
                                {clouds != null ? `${clouds}%` : "--"}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="text-sm text-gray-600">Wind</div>
                            <div className="text-xl font-semibold text-gray-900">
                                {windMs != null ? `${windMs} m/s` : "--"}
                                {windKmh != null ? <span className="text-gray-600 text-base"> ({windKmh} km/h)</span> : null}
                            </div>
                            <div className="text-sm text-gray-600">
                                {windDeg != null ? `${degToCompass(windDeg)} (${windDeg}°)` : ""}
                                {windGust != null ? ` • Gust: ${Math.round(windGust * 3.6)} km/h` : ""}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="text-sm text-gray-600">Sunrise / Sunset</div>
                            <div className="text-xl font-semibold text-gray-900">
                                {sunrise ? formatTime(sunrise, tzOffset) : "--"} / {sunset ? formatTime(sunset, tzOffset) : "--"}
                            </div>
                        </div>
                    </div>

                    {/* Footer info: coordinates */}
                    <div className="text-sm text-gray-700">
                        Coords:{" "}
                        <span className="font-medium">
                            lat {data?.coord?.lat != null ? Number(data.coord.lat).toFixed(3) : "--"}, lon {data?.coord?.lon != null ? Number(data.coord.lon).toFixed(3) : "--"}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}