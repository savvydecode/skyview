import { Link } from "react-router-dom"
import CityForm from "./CityForm"
import { NavbarContainer } from "./NavbarLinker"

export default function Navbar(){
    return(<div className="flex flex-row justify-around items-center mt-4 mx-4 bg-white
    p-3 rounded-2xl">
        <Link className=" ml-2 font-poppins font-bold text-blue-700 text-xl" to={'/'}>SkyView</Link>
        <CityForm />
    </div>)
}

