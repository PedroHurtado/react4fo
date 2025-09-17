import './Calendar.css'

function* getDays(){
    for(let i=0;i<31;i++)    
        yield i+1
}
function Calendar(){
    
    const days = [...getDays()]
    function handlerClick(ev){
        const {nativeEvent} = ev
        const node = nativeEvent.composedPath().find(n=>n.dataset && 'day' in n.dataset)
        if(node){
            const {day} = node.dataset
            console.log(day)
        }
    }
    return (
        <div className='calendar' onClick={handlerClick}>
            {
                days.map(day=>{
                    return <div data-day={day} className='day' key={day}>{day}</div>
                })
            }
        </div>
    )
}

export default Calendar