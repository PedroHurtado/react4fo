import { useSearchParams, Route } from "react-router"
function Page2(){
    //capturar el query string
    const [searchParams, setSearchParams] = useSearchParams();
    console.log(searchParams)
    console.log(setSearchParams)
    
    return <div>Página2</div>
}
export default Page2