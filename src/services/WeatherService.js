import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;
let city = 'Accra'
const Url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
console.log(Url)
export default async function CurrentWeatherData() {
    try {
        const res = await axios.get(Url)
        console.log(res.data)
        return (res.data)

    } catch (error) {
        return (error)
    }
}