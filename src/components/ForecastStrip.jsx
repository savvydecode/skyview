import React, { useEffect, useMemo, useState } from 'react';
import { getSevenDayForecast, iconUrl, fmtDate } from '../services/weatherApi';

/**
 * Props:
 * - coords?: { lat: number, lon: number } (optional, will try geolocation if not provided)
 * - currentWeather?: object (optional; if contains coord {lat, lon}, will use it)
 * - className?: string
 * - onDayClick?: (day, idx) => void
 * - title?: string
 */
export default function ForecastStrip({ coords, currentWeather, className = '', onDayClick, title = '7-Day Forecast' }) {
    const [position, setPosition] = useState(coords || null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Resolve coordinates from props, currentWeather, or geolocation
    useEffect(() => {
        let mounted = true;

        async function resolve() {
            try {
                if (coords?.lat && coords?.lon) {
                    setPosition({ lat: coords.lat, lon: coords.lon });
                    return;
                }
                const cw = currentWeather;
                if (cw?.coord?.lat && cw?.coord?.lon) {
                    setPosition({ lat: cw.coord.lat, lon: cw.coord.lon });
                    return;
                }
                if ('geolocation' in navigator) {
                    await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(
                            (pos) => {
                                if (!mounted) return;
                                setPosition({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                                resolve();
                            },
                            () => {
                                // Fallback to a default location if denied
                                if (!mounted) return;
                                setPosition({ lat: 40.7128, lon: -74.0060 }); // NYC fallback
                                resolve();
                            },
                            { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
                        );
                    });
                    return;
                }
                // No geolocation available
                setPosition({ lat: 40.7128, lon: -74.0060 });
            } catch (e) {
                setPosition({ lat: 40.7128, lon: -74.0060 });
            }
        }

        resolve();
        return () => { mounted = false; };
    }, [coords, currentWeather]);

    useEffect(() => {
        let active = true;
        async function load() {
            if (!position?.lat || !position?.lon) return;
            try {
                setLoading(true);
                setError(null);
                const daily = await getSevenDayForecast({ lat: position.lat, lon: position.lon });
                if (!active) return;
                setData(daily);
            } catch (e) {
                if (!active) return;
                setError(e.message || String(e));
            } finally {
                if (active) setLoading(false);
            }
        }
        load();
        return () => { active = false; };
    }, [position]);

    const content = useMemo(() => {
        if (loading) {
            return (
                <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '4px 2px' }}>
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} style={{
                            flex: '0 0 auto',
                            width: 90,
                            height: 110,
                            borderRadius: 10,
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
        if (!data?.length) {
            return <div>No forecast data available.</div>;
        }

        return (
            <div
                style={{
                    display: 'flex',
                    gap: 12,
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    padding: '8px 2px'
                }}
                aria-label="7 day forecast, horizontally scrollable"
            >
                {data.map((day, idx) => {
                    const weather = day.weather?.[0];
                    const max = Math.round(day.temp?.max ?? 0);
                    const min = Math.round(day.temp?.min ?? 0);
                    const pop = Math.round((day.pop ?? 0) * 100);

                    return (
                        <button
                            key={day.dt || idx}
                            onClick={() => onDayClick?.(day, idx)}
                            style={{
                                flex: '0 0 auto',
                                width: 110,
                                borderRadius: 12,
                                border: '1px solid rgba(0,0,0,0.08)',
                                background: 'rgba(255,255,255,0.8)',
                                backdropFilter: 'blur(4px)',
                                padding: 8,
                                textAlign: 'center',
                                cursor: onDayClick ? 'pointer' : 'default',
                                scrollSnapAlign: 'start',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                            aria-label={`Forecast for ${fmtDate(day.dt, { weekday: 'long' })}, high ${max}, low ${min}${pop ? ', ' + pop + '% precip' : ''}`}
                        >
                            <div style={{ fontWeight: 600, fontSize: 12, color: '#111827' }}>
                                {fmtDate(day.dt, { weekday: 'short' })}
                            </div>
                            <img
                                src={iconUrl(weather?.icon || '01d')}
                                alt={weather?.description || 'weather'}
                                width={48}
                                height={48}
                                style={{ display: 'block', margin: '2px auto' }}
                            />
                            <div style={{ fontSize: 12, color: '#111827' }}>
                                <span style={{ fontWeight: 600 }}>{max}°</span>
                                <span style={{ color: '#6b7280' }}> / {min}°</span>
                            </div>
                            {typeof pop === 'number' && pop > 0 && (
                                <div style={{ fontSize: 11, color: '#2563eb' }}>{pop}%</div>
                            )}
                        </button>
                    );
                })}
            </div>
        );
    }, [data, loading, error, onDayClick]);

    return (
        <section className={className} style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: '6px 0', fontSize: 14, color: '#374151' }}>{title}</h3>
            </div>
            {content}
        </section>
    );
}