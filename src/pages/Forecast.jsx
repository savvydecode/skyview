import React, { useEffect, useMemo, useState } from 'react';
import { getSevenDayForecast, iconUrl, fmtDate, fmtTime, degToCompass } from '../services/weatherApi';

export default function Forecast() { // Intentionally named per user request
    const [coords, setCoords] = useState(null);
    const [daily, setDaily] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedIndex, setExpandedIndex] = useState(null);

    // Resolve coordinates (geolocation with fallback)
    useEffect(() => {
        let mounted = true;
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    if (!mounted) return;
                    setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                },
                () => {
                    if (!mounted) return;
                    setCoords({ lat: 40.7128, lon: -74.0060 }); // Fallback: NYC
                },
                { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
            );
        } else {
            setCoords({ lat: 40.7128, lon: -74.0060 });
        }
        return () => { mounted = false; };
    }, []);

    // Fetch 7-day forecast
    useEffect(() => {
        let active = true;
        async function load() {
            if (!coords?.lat || !coords?.lon) return;
            try {
                setLoading(true);
                setError(null);
                const res = await getSevenDayForecast({ lat: coords.lat, lon: coords.lon });
                if (!active) return;
                setDaily(res);
            } catch (e) {
                if (!active) return;
                setError(e.message || String(e));
            } finally {
                if (active) setLoading(false);
            }
        }
        load();
        return () => { active = false; };
    }, [coords]);

    const grid = useMemo(() => {
        if (loading) {
            return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} style={{
                            height: 180,
                            borderRadius: 12,
                            background: 'rgba(0,0,0,0.06)',
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }} />
                    ))}
                </div>
            );
        }
        if (error) {
            return <div role="alert" style={{ color: '#b91c1c' }}>Unable to load forecast: {error}</div>;
        }
        if (!daily?.length) {
            return <div>No forecast data available.</div>;
        }

        return (
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: 16
                }}
            >
                {daily.map((d, idx) => {
                    const w = d.weather?.[0];
                    const isOpen = expandedIndex === idx;
                    const pop = Math.round((d.pop ?? 0) * 100);
                    const min = Math.round(d.temp?.min ?? 0);
                    const max = Math.round(d.temp?.max ?? 0);
                    const dayTemp = Math.round(d.temp?.day ?? 0);
                    const nightTemp = Math.round(d.temp?.night ?? 0);

                    return (
                        <div
                            key={d.dt || idx}
                            style={{
                                border: '1px solid rgba(0,0,0,0.08)',
                                borderRadius: 14,
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                overflow: 'hidden'
                            }}
                        >
                            <button
                                onClick={() => setExpandedIndex(isOpen ? null : idx)}
                                aria-expanded={isOpen}
                                aria-controls={`day-details-${idx}`}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr auto',
                                    alignItems: 'center',
                                    width: '100%',
                                    padding: 14,
                                    gap: 10,
                                    background: 'transparent',
                                    border: 'none',
                                    textAlign: 'left',
                                    cursor: 'pointer'
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>
                                        {fmtDate(d.dt, { weekday: 'long', month: 'short', day: 'numeric' })}
                                    </div>
                                    <div style={{ color: '#374151', fontSize: 13 }}>
                                        {w?.main || 'Weather'}{w?.description ? ` • ${capitalize(w.description)}` : ''}
                                    </div>
                                    <div style={{ marginTop: 6, fontSize: 14 }}>
                                        <strong>{max}°</strong>
                                        <span style={{ color: '#6b7280' }}> / {min}°</span>
                                        {pop > 0 && <span style={{ color: '#2563eb' }}> • {pop}% precip</span>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ textAlign: 'right', color: '#374151', fontSize: 13 }}>
                                        <div>Day {dayTemp}°</div>
                                        <div>Night {nightTemp}°</div>
                                    </div>
                                    <img src={iconUrl(w?.icon || '01d')} alt={w?.description || 'weather'} width={64} height={64} />
                                </div>
                            </button>

                            {isOpen && (
                                <div id={`day-details-${idx}`} style={{ padding: '12px 14px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                                        <Detail label="Feels like (day)" value={`${Math.round(d.feels_like?.day ?? 0)}°`} />
                                        <Detail label="Feels like (night)" value={`${Math.round(d.feels_like?.night ?? 0)}°`} />
                                        <Detail label="Humidity" value={`${d.humidity ?? 0}%`} />
                                        <Detail label="Pressure" value={`${d.pressure ?? 0} hPa`} />
                                        <Detail label="Wind" value={`${Math.round(d.wind_speed ?? 0)} m/s ${degToCompass(d.wind_deg)}`} />
                                        {d.wind_gust != null && <Detail label="Wind gust" value={`${Math.round(d.wind_gust)} m/s`} />}
                                        <Detail label="Clouds" value={`${d.clouds ?? 0}%`} />
                                        <Detail label="UV Index" value={String(d.uvi ?? 0)} />
                                        {d.rain != null && <Detail label="Rain (24h)" value={`${d.rain} mm`} />}
                                        {d.snow != null && <Detail label="Snow (24h)" value={`${d.snow} mm`} />}
                                        <Detail label="Sunrise" value={fmtTime(d.sunrise)} />
                                        <Detail label="Sunset" value={fmtTime(d.sunset)} />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }, [daily, loading, error, expandedIndex]);

    return (
        <main style={{ padding: 16, maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ margin: '6px 0 14px', fontSize: 22, color: '#111827' }}>7-Day Forecast</h2>
            {grid}
        </main>
    );
}

function Detail({ label, value }) {
    return (
        <div style={{
            padding: 10,
            borderRadius: 10,
            background: 'rgba(0,0,0,0.035)',
            border: '1px solid rgba(0,0,0,0.05)'
        }}>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 14, color: '#111827', fontWeight: 600 }}>{value}</div>
        </div>
    );
}

function capitalize(s) {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}