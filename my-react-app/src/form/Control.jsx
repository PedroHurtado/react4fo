import { forwardRef } from "react";

/*
    Anterior a React 19 esta es la forma de pasar ref de padres a hijos
    En la versión 19 no utilizar
    https://react.dev/reference/react/forwardRef

    >=19 { label, ...input,ref }
    <19  {ref} como segundo paranetro del componente
        1. props
        2. ref
*/
function Control({ label,id, ...input },ref) {
  return (
    <div className="control">
      <label htmlFor={id}>{label}</label>
      <input type="text" {...input} ref={ref} />
    </div>
  );
}

export default forwardRef(Control)