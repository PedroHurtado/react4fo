import { NavLink} from "react-router";
export default function Menu(){
    return (
        <nav>
            <NavLink to="/page1"/>
            <NavLink to="/page2"/>
            <NavLink to="/page3"/>      
        </nav>
    )
}