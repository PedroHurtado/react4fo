import { useState, useEffect } from "react";


function getTime(date) {
    let options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Intl.DateTimeFormat('es-ES', options).format(date);
}

export function useTimer(date, delay) {
    
    const [time, setTime] = useState(date)

    useEffect(() => {

        function changeTime() {
            setTime(() => new Date)
        }
        const intervalID = setInterval(changeTime, delay)

        return () => clearInterval(intervalID)
        
    }, [delay])

    return {
        time: getTime(time)
    }
}