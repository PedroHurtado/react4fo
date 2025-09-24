
//import Binding from "./templates/Binding"
//import Calendar from "./calendar/Calendar"
//import Carrito from "./pizzas/Carrito"
import PizzaLayout from "./pizzas/PizzaLayout"
import Timer from "./timer/Timer"
import User from "./form/User"
import AppSuspense from "./suspense/component"
function App() {
  return (  
      /*
       *Fragment no aceptan eventos ni estilos 
       */
      <>    
        <AppSuspense/>        
      </>  
  )
}

export default App
