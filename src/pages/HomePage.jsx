import Navbar from "../components/Navbar"
import { useEffect } from "react"
import CurrentWeatherData from "../services/WeatherService"

console.log()
export default function HomePage() {

    const fetchData = async () => {
        try{
            const data = await(CurrentWeatherData())
            console.log(data)
        } catch{

        }
    }
    fetchData()

    return (<>
        <Navbar />

    </>)
}