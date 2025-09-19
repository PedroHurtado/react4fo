import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

/*
<StrictMode>
    <App />
  </StrictMode>,*/

createRoot(document.getElementById('root')).render(  
    <App />  
)
