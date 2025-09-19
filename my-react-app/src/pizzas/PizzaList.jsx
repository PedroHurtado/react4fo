import PizzaItem from "./PizzaItem"
import {events,/*sendEvent*/} from '../util'
import pubsub from '../pubsub'


export default function PizzaList(){
    const pizzas = [
        {id:1,name:'Carbonara', price:12},
        {id:2,name:'Meditarraneo', price:15},
    ]
    function handlerClick(ev){
        ev.stopPropagation()
        const {pizzaId} = ev.target?.dataset || {}       
        const pizza = pizzas.find(p=>p.id === Number(pizzaId))
        //sendEvent(events.CARRITO,ev.target,pizza && {...pizza})
       
        pizza && pubsub.emit(events.CARRITO,{...pizza})
        
    }
    return(
        <div onClick={handlerClick}>
            <div>Lista de pizzas</div>
            {
                pizzas.map(p=><PizzaItem key={p.id} {...p}/>)
            }
        </div>
    )
}