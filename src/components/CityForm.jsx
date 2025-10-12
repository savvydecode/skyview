
import { useState } from "react"
import useCityStore from "../store"

export default function CityForm() {
//states
const [value, setValue] = useState('')
const setCity = useCityStore(state => state.setCity);

const handleSubmit = (e) => {
    e.preventDefault();
    setCity(value)
    setValue("")
}
    return (<>
        <form onSubmit={handleSubmit} className="ml-2">
            <div className="relative">
                <input value={value} onChange={((e) => setValue(e.target.value))}
                    className={[
                        "pr-10 border-2  border-blue-400 rounded-2xl px-4 py-1 text-l max-w-xs w-full ",
                        "placeholder:text-sm placeholder-blue-300  bg-gray-200 text-black ",
                        "hover:border-blue-700 hover:shadow-2xl focus:border-blue-700 focus:outline-none transition duration-300 ease-in-out"
                    ].join(" ")}

                    type="text" id="city" placeholder="Search Location" />
                <button className="absolute right-0 top-0 bg-gray-300 w-12 h-full border-2  border-blue-400 outline-none z-10 rounded-tr-2xl rounded-br-2xl">
                    <span className="  outline-blue-300 border-blue-300 bg-red absolute right-4 top-1.5 width z-20 ">
                    🔍
                </span>
                
                </button>
            </div>

        </form>
    </>)
}