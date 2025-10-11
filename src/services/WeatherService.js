import axios from "axios";


export default async function CurrentWeatherData(userCity) {

    const apiKey = import.meta.env.VITE_API_KEY;
    let city = 'techiman'

    city = userCity ?? city;
    const Url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    console.log(Url)
    try {
        const res = await axios.get(Url)
        console.log(res.data)
        return (res.data)

    } catch (error) {
        return (error)
    }
}


