import './Calendar.css'

function* getDays(){
    for(let i=0;i<31;i++)    
        yield i+1
}
function Calendar(){
    
    const days = [...getDays()]
    return (
        <div className='calendar'>
            {
                days.map(day=>{
                    return <div className='day' key={day}>{day}</div>
                })
            }
        </div>
    )
}

export default Calendar