import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import CurrentWeather from "../components/CurrentWeather"


export default function HomePage() {



    return (<>
        <Navbar />
        <CurrentWeather />
    </>)
}