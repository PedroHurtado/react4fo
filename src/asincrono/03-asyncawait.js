class Customer {
    static async get(id) {
        if (id !== 1)
            throw "El cliente no existe" //reject

        return { id } //resolve
    }
}

class Invoices {
    static async get(client_id, callback) {
        return new Promise((succes, error) => {
            if (id === 1) {
                succes({ client_id, invoices:[] })
            }
            else {
                error("el cliente no tiene factoruras")
            }
        })
    }
}

/*
  success->then->(1:n)
  error->catch->1
*/

async function main(id) {

    console.log("Start")  //sincrono 1
    try {
        const customer = await Customerg.et(id)
        const invoices = await Invoices.get(customer.id)
        console.log(invoices)
    }
    catch (err) {
        console.log(err)
    }
    console.log("End") //sincrono 2
}
main(1)
console.log("End programa")