import './Form.css'
import Control from './Control'
import Submit from './Submit'
export default function Form({onSubmit,children,...rest}){

    
    return (
        <form onSubmit={onSubmit} {...rest}>
          {children}
        </form>
    )
}