import { Link } from "react-router-dom"
import CityForm from "./CityForm"
import { NavbarContainer } from "./NavbarLinker"

export default function Navbar() {
    return (<div className="flex flex-row justify-around items-center mt-4 mx-4 my-2 bg-white
    p-3 rounded-2xl">
        <span className="material-symbols-outlined ">
menu
</span>
        <Link className=" ml-2 mr-auto font-poppins font-bold text-blue-800 text-l" to={'/'}>SkyView</Link>
        <CityForm />
    </div>)
}

