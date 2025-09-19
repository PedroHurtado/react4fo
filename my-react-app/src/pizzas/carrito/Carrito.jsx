import { useCarrito } from "./useCarrito";
function Carrito() {

  const {sum} = useCarrito()
  
  return (
    <>
      <div>Total :{sum}</div>
    </>
  );
}

export default Carrito;
