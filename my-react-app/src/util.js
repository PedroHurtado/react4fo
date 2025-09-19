const events= {
    CARRITO : "carrito"
}

function sendEvent(event,node,detail){
    if(detail){
        node.dispatchEvent(createEvent(event,detail))
    }    
}
function createEvent(event,detail){
    return new CustomEvent(event,{
        detail:detail,
        bubbles:true,
        composed:true,
        cancelable:true
    })
}
export{
    sendEvent,    
    events
}