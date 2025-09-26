import { useParams } from "react-router"
export default function Page1(){
    //capturar el parametro
    console.log(useParams)

    let {id} = useParams()
    console.log(id) //string
    id=10
    console.log(id) //integer
    
    return <div>Página1</div>
}