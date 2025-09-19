import { useState, useEffect } from "react";
import { events } from "../../util";
import pubsub from "../../pubsub";
export function useCarrito() {

    const [items, setItems] = useState([]);

    useEffect(() => {
        /*function handlerClick({detail}) {
            ev.stopPropagation();
            detail && setItems((prevItems) => [...prevItems, detail]);
        }
        document.addEventListener(events.CARRITO, handlerClick);
        return () => {
            document.removeEventListener(events.CARRITO, handlerClick);
        };*/

        function suscribe(item) {
            setItems((prevItems) => [...prevItems, item]);
        }
        const dispose = pubsub.on(events.CARRITO, suscribe)
        return ()=>dispose()

    }, []);

    const sum = items.reduce((a, pizza) => a + pizza.price, 0);
    return {
        sum
    }

}

