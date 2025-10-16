import { create } from 'zustand';
import axios from 'axios';

// This store keeps the selected city and can auto-detect the user's city on load.
const useCityStore = create((set, get) => ({
    city: '',
    setCity: (value) =>
        set(() => ({
            city: (value ?? '').trim(),
        })),
    deleteCity: () =>
        set(() => ({
            city: '',
        })),

    // Try to get user's city from geolocation and reverse geocoding.
    // It only runs if city is empty.
    initCityFromGeolocation: () => {
        const currentCity = get().city;
        if (currentCity && currentCity.trim() !== '') {
            return;
        }

        if (!('geolocation' in navigator)) {
            // geolocation not available; do nothing
            return;
        }

        const apiKey = import.meta.env?.VITE_API_KEY;
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;

                    if (!apiKey) {
                        // no api key set, skip
                        return;
                    }

                    // Use OpenWeatherMap reverse geocoding to get nearest place name
                    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
                    const res = await axios.get(url);

                    const first = Array.isArray(res.data) ? res.data[0] : null;
                    const name =
                        first?.name ||
                        first?.local_names?.en ||
                        first?.state ||
                        '';

                    if (name) {
                        set(() => ({
                            city: String(name).trim(),
                        }));
                    }
                } catch (e) {
                    // Reverse geocode failed; keep city empty
                }
            },
            () => {
                // denied or failed; keep city empty
            },
            {
                enableHighAccuracy: false,
                timeout: 8000,
                maximumAge: 0,
            }
        );
    },
}));

export default useCityStore;