class Customer {
    static get(id, callback) {
        if (id === 1) {
            callback(null, { id })
        }
        else {
            callback("El cliente no existe", null)
        }
    }
}

class Invoices {
    static get(client_id, callback) {
        if (client_id === 1) {
            callback(null, { client_id, invoices: [] })
        }
        else {
            callback("El cliente no tiene facturas", null)
        }
    }
}

/*$.ajax({
    succes,
    error
})*/

function main(id){
    Customer.get(id,function(error,data){
        if (data){
            Invoices.get(data.id,function(error,data){
                if (data){
                    console.log(data)
                }    
                else {
                    console.log(error)
                }
            })
        }
        else console.log(error)
    })
}