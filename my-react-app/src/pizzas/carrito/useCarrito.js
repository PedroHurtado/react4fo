import { useState, useEffect } from "react";
import { events } from "../../util";
export function useCarrito() {
    
    const [items, setItems] = useState([]);

    useEffect(() => {
        function handlerClick(ev) {
            ev.stopPropagation();
            ev.detail && setItems((prevItems) => [...prevItems, ev.detail]);
        }
        document.addEventListener(events.CARRITO, handlerClick);
        return () => {
            document.removeEventListener(events.CARRITO, handlerClick);
        };
    }, []);

    const sum = items.reduce((a, pizza) => a + pizza.price, 0);
    return {
        sum
    }

}

