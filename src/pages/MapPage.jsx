import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import useCityStore from '../store';
import Navbar from '../components/Navbar';

export default function MapPage() {
    const city = useCityStore((s) => s.city);
    const location = city && city.trim() !== '' ? city : 'Techiman';

    const [coords, setCoords] = useState(null); // { lat, lon }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Use OpenWeatherMap direct geocoding to get lat/lon for the current city.
    useEffect(() => {
        let cancelled = false;
        const apiKey = import.meta.env?.VITE_API_KEY;

        async function run() {
            setLoading(true);
            setError('');
            setCoords(null);

            if (!location || location.trim() === '') {
                setLoading(false);
                return;
            }

            if (!apiKey) {
                setError('Missing API key (VITE_API_KEY). Please set it in your .env file.');
                setLoading(false);
                return;
            }

            try {
                const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
                    location
                )}&limit=1&appid=${apiKey}`;
                const res = await axios.get(url);
                const first = Array.isArray(res.data) ? res.data[0] : null;

                if (!cancelled) {
                    if (first && typeof first.lat === 'number' && typeof first.lon === 'number') {
                        setCoords({ lat: first.lat, lon: first.lon });
                        setError('');
                    } else {
                        setError('Could not find coordinates for that place.');
                    }
                }
            } catch (e) {
                if (!cancelled) {
                    setError('Failed to load map location.');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, [location]);

    // Build OpenStreetMap embed URL when we have coordinates.
    const osmEmbedSrc = useMemo(() => {
        if (!coords) return '';
        const { lat, lon } = coords;
        const delta = 0.05; // ~5-6 km box
        const left = lon - delta;
        const right = lon + delta;
        const top = lat + delta;
        const bottom = lat - delta;
        return `https://www.openstreetmap.org/export/embed.html?bbox=${left},${bottom},${right},${top}&layer=mapnik&marker=${lat},${lon}`;
    }, [coords]);

    const openStreetMapLink = useMemo(() => {
        if (!coords) return `https://www.openstreetmap.org/search?query=${encodeURIComponent(location)}`;
        const { lat, lon } = coords;
        return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`;
    }, [coords, location]);

    return (
        <div>
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                    <h1 className="text-2xl font-semibold text-gray-900">Map - {location}</h1>
                    <a
                        href={openStreetMapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-700 hover:text-blue-800 underline"
                    >
                        Open full map
                    </a>
                </div>

                {loading && <div className="text-center text-gray-600">Loading map…</div>}

                {!loading && error && (
                    <div className="text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                        {error}
                        <div className="mt-2 text-sm">Tip: set VITE_API_KEY in .env and ensure the city name is valid.</div>
                    </div>
                )}

                {!loading && !error && coords && (
                    <div className="w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                        <iframe
                            title="city-map"
                            src={osmEmbedSrc}
                            className="w-full"
                            style={{ height: '70vh', border: 0 }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                )}

                {!loading && !error && !coords && (
                    <div className="text-center text-gray-600">Enter a valid city to see the map.</div>
                )}

                <p className="text-gray-600 mt-2 text-sm">
                    The map centers on your selected city. Change it from the search bar in the navbar.
                </p>
            </div>
        </div>
    );
}