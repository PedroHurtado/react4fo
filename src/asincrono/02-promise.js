class Customer {
    static get(id) {
        return new Promise((resolve,reject)=>{
            if(id===1){
                resolve({id})
            }
            else{
                reject("el cliente no existe")
            }
        })
    }
}

class Invoices {
    static get(client_id, callback) {
        return new Promise((resolve,reject)=>{
            if(id===1){
                resolve({client_id, invoices:[]})
            }
            else{
                reject("el cliente no tiene factoruras")
            }
        })
    }
}

/*
  resolve->then->(1:n)
  reject->catch->1
*/

function main(id){

   console.log("Start")  //sincrono 1
   
   Customer.get(id)  //asincrono
    .then((customer)=>Invoices.get(customer.id))
    .then((invoices)=>console.log(invoices))
    .cathc((error)=>console.log(error))   

    console.log("End") //sincrono 2
}