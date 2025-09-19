import { useRef } from "react";

import Form from "./form";
import Control from "./Control";
import Submit from "./Submit";


export default function User() {
    
  const name = useRef();
  const phone = useRef();

  function onSubmit(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    const data = {
      name: name.current.value,
      phone: phone.current.value,
    };
    console.log(data);
  }

  return (
    <Form onSubmit={onSubmit}>

      <Control label="introduzca su nombre" ref={name} id="name" />
      <Control label="introduzca su teléfono" ref={phone} id="phone" />

      <Submit>Enviar</Submit>

    </Form>
  );
}
