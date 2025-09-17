
import Binding from "./templates/Binding"
import Calendar from "./calendar/Calendar"
function App() {
  return (  
      /*
       *Fragment no aceptan eventos ni estilos 
       */
      <>
        <div>Hello World</div>
        <Binding/>          
        <Calendar/>
      </>  
  )
}

export default App
