import useCityStore from "../store";
import CurrentWeatherData from "../services/WeatherService";
import { useState, useEffect } from "react";
export default function CurrentWeather() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // get store userInput from store
    const city = useCityStore(state => state.city)
    useEffect(() => {
        const fetchData = async () => {
            setError(false);
            setLoading(true);
            setData(null)
            //check if city is not null or undefined
            if (!city) { return };
            try {
                const data = await (CurrentWeatherData(city))
                if (data === "Network Error") {
                    setError(data)
                    setData(null)
                    setLoading(false)
                } else {
                    setData(data)
                    setLoading(false)
                    console.log(data)
                }
            } catch (err) {
                setLoading(false)
                setError(err ?? error)
                console.error(`Error!: ${error}`)
            }
        }
        fetchData()
    }, [city])

    return (<div className={[
        ""
    ].join(" ")}>
        hello
    </div>)
}

