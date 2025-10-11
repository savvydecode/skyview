import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import CurrentWeatherData from "../services/WeatherService"

console.log()
export default function HomePage() {

    const [city, setCity] = useState('')
    const fetchData = async () => {
        try{
            const data = await(CurrentWeatherData())
            console.log(data)
        } catch{

        }
    }
    fetchData()

    return (<>
        <Navbar city />

    </>)
}