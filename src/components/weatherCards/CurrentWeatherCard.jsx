import useCityStore from "../../store";
import CurrentWeatherData from "../../services/WeatherService";
import { useState, useEffect } from "react";
export default function CurrentWeather() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const [temp, setTemp] = useState("")
    // get store userInput from store
    const city = useCityStore(state => state.city)
    useEffect(() => {
        const fetchData = async () => {
            setError('');
            setLoading(true);
            setData(null)

            if (!city) { return };
            try {
                const getData = await (CurrentWeatherData(city))
                console.log(getData)
                console.log(getData?.message)
                // an Error has .message object, use that to detect if there is an error
                if (getData?.message == undefined) {
                    setData(getData)
                    setTemp(Math.round(getData.main.temp - 273.5)) //conver the unit value to celcius
                    setError(null)
                    setLoading(false)
                } else {
                    setError(getData.message)
                    setData(null)
                    setLoading(false)
                    throw new Error(`${getData.message}`)
                }
            } catch (error) {
                console.log(error)
            }

        }
        fetchData()
    }, [city])


    //Convert temperature to the appropriate unit
    const handleChange = (e) => {
        e.preventDefault()
        let selectedUnit = e.target.value;
        if (selectedUnit === "celsius") {
            setTemp(Math.round(data.main.temp - 273.5))
        } else
            if (selectedUnit === "fahrenheit") {
                setTemp(Math.round((data.main.temp - 273.15) * 9 / 5 + 32));
                console.log(temp)
            } else {
                setTemp(Math.round(data.main.temp))
            }

    }

    return (<div className={[
        "flex flex-col font-poppins bg-white my-2 mx-4 rounded-2xl p-3"
    ].join(" ")}>

        {/* Display error if there is */}
        {error && <div className="text-red-500 mx-auto"> Error fetching data: {error}</div>}

        {/* render loading if loading state is true */}
        {loading ? <div className="mx-auto">Loading</div>
            : !data ? <div>Data Not Found</div> :
                //Render the current weather
                <div
                    className={[
                        ""
                    ].join(' ')}
                >
                    <div className="flex flex-row justify-between">
                        <p>Current Weather</p>
                        <select name="temperature" id="temperature" className="border border-gray-300 rounded-2xl px-3 py-2 text-black bg-blue-100"
                            onChange={handleChange}
                        >
                            <option value="celsius">Celsius</option>
                            <option value="fahrenheit">Fahrenheit</option>
                            <option value="kelvin">Kelvin</option>

                        </select>

                    </div>

                    <div>

                    </div>
                    <div>{temp}</div>


                </div>}
    </div>)
}

