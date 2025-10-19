import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

// Utility: normalize city names for case-insensitive matching
const normalize = (name) => (name || '').trim().toLowerCase();

/**
 * Global app store:
 * - city: selected city string
 * - favorites: list of favorite city names (stored as { name, key, addedAt })
 *
 * Persisted to localStorage so favorites and selected city survive reloads.
 */
const useCityStore = create(
    persist(
        (set, get) => ({
            // Selected city
            city: '',
            setCity: (value) =>
                set(() => ({
                    city: (value ?? '').trim(),
                })),
            deleteCity: () =>
                set(() => ({
                    city: '',
                })),

            // Favorites (city names only)
            favorites: [],

            addFavorite: (name) => {
                const n = (name || '').trim();
                if (!n) return;
                const key = normalize(n);
                const list = get().favorites || [];
                if (list.some((i) => i.key === key)) return; // already exists
                set({ favorites: [{ name: n, key, addedAt: Date.now() }, ...list] });
            },

            removeFavorite: (name) => {
                const key = normalize(name);
                set((state) => ({
                    favorites: (state.favorites || []).filter((i) => i.key !== key),
                }));
            },

            toggleFavorite: (name) => {
                const n = (name || '').trim();
                if (!n) return false;
                const key = normalize(n);
                const list = get().favorites || [];
                if (list.some((i) => i.key === key)) {
                    set({ favorites: list.filter((i) => i.key !== key) });
                    return false; // removed
                } else {
                    set({ favorites: [{ name: n, key, addedAt: Date.now() }, ...list] });
                    return true; // added
                }
            },

            isFavorite: (name) => {
                const key = normalize(name);
                const list = get().favorites || [];
                return list.some((i) => i.key === key);
            },

            clearFavorites: () => set({ favorites: [] }),

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
        }),
        {
            name: 'sv:store:v1',
            version: 1,
            storage: createJSONStorage(() => localStorage),
            // Only persist serializable state
            partialize: (state) => ({
                city: state.city,
                favorites: state.favorites,
            }),
            migrate: (persistedState, version) => {
                // Simple passthrough migration; adjust if shape changes in the future
                return persistedState;
            },
        }
    )
);

export default useCityStore;