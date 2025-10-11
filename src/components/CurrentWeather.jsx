import useCityStore from "../store";
import CurrentWeatherData from "../services/WeatherService";
import { useState, useEffect } from "react";
export default function CurrentWeather() {
    
    const [city, setCity] = useState('')
    const fetchData = async () => {
        try {
            const data = await (CurrentWeatherData())
            console.log(data)
        } catch {

        }
    }

    return (<div className={[
        ""
    ].join(" ")}>

    </div>)
}

