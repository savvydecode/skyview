import axios from "axios";


export default async function CurrentWeatherData(userCity) {
    // get api key from .env file
    const apiKey = import.meta.env.VITE_API_KEY;
    let city = 'techiman'
    
    city = userCity ?? city;
    //merge requirements into a single url
    const Url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    console.log(Url)
    try {
        const res = await axios.get(Url)
        return (res.data)

    } catch (error) {
        return (error.message) //"Network Error"
        
    }
}

 
