export default function PizzaItem({id,name,price}){
    return <>
        <div>{id}</div>
        <div>{name}</div>
        <div>{price}</div>
        <button data-pizza-id={id}>Añadir a carrito</button>
    </>
}