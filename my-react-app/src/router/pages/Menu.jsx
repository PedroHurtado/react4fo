import { NavLink} from "react-router";
export default function Menu(){
    return (
        <nav>
            <NavLink to="/page1/1"/>
            <NavLink to="/page2?name=pedro&page=1&size=25"/>
            <NavLink to="/page3"/>      
        </nav>
    )
}