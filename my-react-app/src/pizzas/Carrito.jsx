import { useState, useEffect } from "react";
import {events } from '../util'
function Carrito() {

  const [items, setItems] = useState([]);
  
  function handlerClick(ev) {
    ev.stopPropagation();        
    ev.detail && setItems([...items, ev.detail]);
  }

  useEffect(()=>{
    document.addEventListener(events.CARRITO, handlerClick)
    return ()=>document.removeEventListener(events.CARRITO,handlerClick)
  })

  

  const sum = items.reduce((a, pizza) => a + pizza.price,0);

  return (
    <>
      <div>Total :{sum}</div>      
    </>
  );
}

export default Carrito;
