import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import CurrentWeather from "../components/weatherCards/CurrentWeatherCard"
import Footer from "../components/Footer"


export default function HomePage() {



    return (<>
        <Navbar />
        <CurrentWeather />
        <Footer />
    </>)
}