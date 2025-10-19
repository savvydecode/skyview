import React from "react";
import { useNavigate } from "react-router-dom";
import useCityStore from "../store";

export default function FavoriteSearches() {
    const favorites = useCityStore((s) => s.favorites);
    const removeFavorite = useCityStore((s) => s.removeFavorite);
    const navigate = useNavigate();

    const goToCity = (name) => {
        if (!name) return;
        navigate(`/?q=${encodeURIComponent(name)}`);
    };

    return (
        <main className="max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Favorites</h1>

            {!favorites?.length ? (
                <div className="text-gray-600">
                    No favorites yet. Use the "Add to favorites" button on the current weather card.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {favorites.map((c) => (
                        <div
                            key={c.key || c.name}
                            className="border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                        >
                            <div>
                                <div className="font-semibold text-gray-900">{c.name}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
                                    onClick={() => goToCity(c.name)}
                                    aria-label={`Search weather for ${c.name}`}
                                >
                                    View
                                </button>
                                <button
                                    className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-100"
                                    onClick={() => removeFavorite(c.name)}
                                    aria-label={`Remove ${c.name} from favorites`}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}