import { useTimer } from "./useTimer"
import './Timer.css'

const DELAY = 1000

export default function Timer(){

    const {time} = useTimer(new Date,DELAY)

    return(
        <div className="timer">{time}</div>
    )
}