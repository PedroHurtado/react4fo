
//import Binding from "./templates/Binding"
//import Calendar from "./calendar/Calendar"
//import Carrito from "./pizzas/Carrito"
import PizzaLayout from "./pizzas/PizzaLayout"
import Timer from "./timer/Timer"
function App() {
  return (  
      /*
       *Fragment no aceptan eventos ni estilos 
       */
      <>    
        <Timer/>    
        <PizzaLayout/>
      </>  
  )
}

export default App
