import PizzaItem from "./PizzaItem";
import { events /*sendEvent*/ } from "../util";
import pubsub from "../pubsub";
import { useQuery } from "../useQuery";
import { useState } from "react";
import Paginator from "./Paginator";
const URL = "http://localhost:3000/pizzas";

export default function PizzaList() {
  const [page, setPage] = useState(1);
  const { loading, error, data: pizzas } = useQuery(`${URL}/${page}`);

  function changePage(newPage) {
    setPage(newPage);
  }
  function handlerClick(ev) {
    ev.stopPropagation();
    const { pizzaId } = ev.target?.dataset || {};
    const pizza = pizzas.find((p) => p.id === pizzaId);
    //sendEvent(events.CARRITO,ev.target,pizza && {...pizza})

    pizza && pubsub.emit(events.CARRITO, { ...pizza });
  }

  if (loading) return <div>...Loading</div>

  if (error) return (
       <>
          <div>Lista de pizzas</div>          
          <Paginator setPage={changePage} />
          <div>{error}</div>  
       </>
      
)

  return (
    <div onClick={handlerClick}>      
      <div>Lista de pizzas</div>
      <Paginator setPage={changePage} />
      {pizzas.map((p) => (
        <PizzaItem key={p.id} {...p} />
      ))}
    </div>
  );
}
