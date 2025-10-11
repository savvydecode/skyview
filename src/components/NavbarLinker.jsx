
import { NavLink } from "react-router-dom";

// navbarLineker  component to style the navbar and mostly add a feature to the active page's link on the navbar. 

function cx(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function NavbarLinker({ to, href = '#', text, children, className = '', end, ...rest }) {
    //Resolve destination: prefer `to`, else `href`, else fallback to
    const destination = to ?? href ?? "#";
    const base = 'mx-3 my-4 folt-bold border-b-2 border-b-transparent transition duration-300 ease-in-out';
    const inactiveHover = 'hover:border-b-white';
    const Pressed = 'active:border-b-red-700'; //while pressed
    const activeRoute = 'border-b-blue-700 hover:border-b-blue-700 '; //persistent active
    return (
        <NavLink to={destination} end={end} {...rest} className={
            ({ isActive, isPending }) => cx(
                base,
                Pressed,
                isActive ? activeRoute : inactiveHover, // If route matches, use active styles; otherwise use inactive hover
                isPending && 'opacity-70',
                className // Append other supplied classes last
            )
        }>
            {/* Render children if provided; otherwise fall back to `text` prop for the label */}
            {children ?? text}
        </NavLink>
    );
}


export function NavbarContainer({children}){
    return(<nav
    className="bg-red-700"
    >
            {children}
    </nav>)
}