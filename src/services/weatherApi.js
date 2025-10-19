const API_BASE = 'https://api.openweathermap.org/data/2.5/onecall';

// Helpers
export function iconUrl(icon) {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

export function degToCompass(deg) {
    if (typeof deg !== 'number') return '';
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
}

export function fmtDate(tsSec, options = { weekday: 'short', month: 'short', day: 'numeric' }) {
    return new Date(tsSec * 1000).toLocaleString(undefined, options);
}

export function fmtTime(tsSec) {
    return new Date(tsSec * 1000).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

// Internal: resolve env safely across contexts
function getEnv(name) {
    try {
        return import.meta?.env?.[name];
    } catch {
        return undefined;
    }
}

function resolveApiKey(override) {
    if (override) return override;
    // Try common Vite client-exposed names
    const key = import.meta.env.VITE_API_KEY;;

    return key || '';
}

function resolveUnits(units) {
    return units || getEnv('VITE_UNITS') || 'metric';
}

function resolveLang(lang) {
    return lang || getEnv('VITE_LANG') || 'en';
}

/**
 * Fetch 7-day forecast using OpenWeather One Call API.
 * @param {Object} params
 * @param {number} params.lat
 * @param {number} params.lon
 * @param {string} [params.units] 'metric' | 'imperial' | 'standard'
 * @param {string} [params.lang]
 * @param {string} [params.apiKey] Optional override for environments where import.meta.env is unavailable
 * @returns {Promise<Array>} 7 daily forecasts
 */
export async function getSevenDayForecast({ lat, lon, units, lang, apiKey } = {}) {
    const key = resolveApiKey(apiKey);
    if (!key) {
        const known = Object.keys((() => { try { return import.meta?.env || {}; } catch { return {}; } })());
        const hint = known.length
            ? `Known env keys at runtime: ${known.join(', ')}`
            : 'No Vite env available at runtime (import.meta.env is empty). Are you running under Vite and did you restart the dev server?';
        throw new Error(
            'Missing VITE_OPENWEATHER_API_KEY in environment. ' +
            'Ensure .env is at project root with VITE_OPENWEATHER_API_KEY and restart the dev server. ' +
            'Alternatively, pass apiKey to getSevenDayForecast({... , apiKey}). ' +
            hint
        );
    }

    const resolvedUnits = resolveUnits(units);
    const resolvedLang = resolveLang(lang);

    const url = new URL(API_BASE);
    url.search = new URLSearchParams({
        lat,
        lon,
        exclude: 'minutely,hourly,alerts',
        units: resolvedUnits,
        lang: resolvedLang,
        appid: key
    }).toString();

    const res = await fetch(url);
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Forecast request failed: ${res.status} ${res.statusText} ${text}`);
    }
    const data = await res.json();
    const daily = Array.isArray(data?.daily) ? data.daily.slice(0, 7) : [];
    return daily;
}