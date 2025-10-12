import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import CurrentWeather from "../components/weatherCards/CurrentWeatherCard"


export default function HomePage() {



    return (<>
        <Navbar />
        <CurrentWeather />
    </>)
}