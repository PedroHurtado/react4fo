# ⚛️ JSX

JSX (JavaScript XML) es una extensión de JavaScript que permite escribir elementos HTML dentro de React de forma declarativa.

**📚 Documentación Oficial:** [React JSX Documentation](https://react.dev/learn/writing-markup-with-jsx)

---

## 🎯 Sintaxis Básica

```jsx
// JSX básico
const element = <h1>¡Hola, mundo!</h1>;

// Con variables
const name = 'Juan';
const greeting = <h1>¡Hola, {name}!</h1>;

// Múltiples elementos (necesitan un contenedor)
const multipleElements = (
  <div>
    <h1>Título</h1>
    <p>Párrafo</p>
  </div>
);

// Fragment para evitar divs innecesarios
const withFragment = (
  <>
    <h1>Título</h1>
    <p>Párrafo</p>
  </>
);
```

---

## 🔄 Renderizado Condicional (if)

### 1. Operador Ternario `? :`

```jsx
const ConditionalRender = ({ isLoggedIn, user }) => {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Bienvenido, {user.name}!</h1>
      ) : (
        <h1>Por favor, inicia sesión</h1>
      )}
    </div>
  );
};
```

### 2. Operador Lógico `&&`

```jsx
const NotificationBanner = ({ hasNotifications, count }) => {
  return (
    <div>
      {hasNotifications && (
        <div className="notification">
          Tienes {count} notificaciones nuevas
        </div>
      )}
    </div>
  );
};
```

### 3. If con Variables

```jsx
const UserProfile = ({ user, isAdmin }) => {
  let content;
  
  if (!user) {
    content = <p>Cargando usuario...</p>;
  } else if (isAdmin) {
    content = <p>Panel de Administrador</p>;
  } else {
    content = <p>Perfil de Usuario</p>;
  }
  
  return <div>{content}</div>;
};
```

### 4. If con Funciones

```jsx
const StatusMessage = ({ status }) => {
  const renderStatus = () => {
    switch (status) {
      case 'loading':
        return <div>⏳ Cargando...</div>;
      case 'success':
        return <div>✅ ¡Éxito!</div>;
      case 'error':
        return <div>❌ Error occurred</div>;
      default:
        return <div>🤔 Estado desconocido</div>;
    }
  };
  
  return <div>{renderStatus()}</div>;
};
```

### 5. Múltiples Condiciones

```jsx
const ComplexConditions = ({ user, loading, error }) => {
  return (
    <div>
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && user && (
        <div>
          <h2>Usuario: {user.name}</h2>
          {user.isVip && <span>🌟 Usuario VIP</span>}
        </div>
      )}
      {!loading && !error && !user && <p>No hay usuario</p>}
    </div>
  );
};
```

---

## 🗂️ Renderizado de Listas (map)

### 1. Lista Básica

```jsx
const fruits = ['Manzana', 'Banana', 'Naranja'];

const FruitList = () => {
  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  );
};
```

### 2. Lista de Objetos

```jsx
const users = [
  { id: 1, name: 'Juan', age: 25, email: 'juan@example.com' },
  { id: 2, name: 'María', age: 30, email: 'maria@example.com' },
  { id: 3, name: 'Pedro', age: 28, email: 'pedro@example.com' }
];

const UserList = () => {
  return (
    <div>
      {users.map(user => (
        <div key={user.id} className="user-card">
          <h3>{user.name}</h3>
          <p>Edad: {user.age}</p>
          <p>Email: {user.email}</p>
        </div>
      ))}
    </div>
  );
};
```

### 3. Map con Filtros

```jsx
const ProductList = ({ products, category }) => {
  return (
    <div>
      {products
        .filter(product => product.category === category)
        .map(product => (
          <div key={product.id}>
            <h4>{product.name}</h4>
            <p>${product.price}</p>
          </div>
        ))}
    </div>
  );
};
```

### 4. Map con Índice

```jsx
const NumberedList = ({ items }) => {
  return (
    <ol>
      {items.map((item, index) => (
        <li key={item.id}>
          #{index + 1}: {item.title}
          {index === 0 && <span> 🥇 Primero</span>}
        </li>
      ))}
    </ol>
  );
};
```

### 5. Map Anidado

```jsx
const categories = [
  {
    id: 1,
    name: 'Tecnología',
    products: ['Laptop', 'Mouse', 'Teclado']
  },
  {
    id: 2,
    name: 'Deportes',
    products: ['Balón', 'Raqueta', 'Zapatillas']
  }
];

const NestedList = () => {
  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          <ul>
            {category.products.map((product, index) => (
              <li key={`${category.id}-${index}`}>{product}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
```

### 6. Map con Componentes

```jsx
const TodoItem = ({ todo }) => (
  <div className={`todo ${todo.completed ? 'completed' : ''}`}>
    <input 
      type="checkbox" 
      checked={todo.completed} 
      readOnly 
    />
    <span>{todo.text}</span>
  </div>
);

const TodoList = ({ todos }) => {
  return (
    <div>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};
```

---

## 🚨 Palabras Reservadas de React

### Atributos HTML que cambian en JSX

```jsx
const JSXAttributes = () => {
  return (
    <div>
      {/* class → className */}
      <div className="my-class">Clase CSS</div>
      
      {/* for → htmlFor */}
      <label htmlFor="email">Email:</label>
      <input id="email" type="email" />
      
      {/* tabindex → tabIndex */}
      <button tabIndex={1}>Botón</button>
      
      {/* onclick → onClick (camelCase) */}
      <button onClick={() => alert('Clicked!')}>Click</button>
      
      {/* onchange → onChange */}
      <input onChange={(e) => console.log(e.target.value)} />
      
      {/* contenteditable → contentEditable */}
      <div contentEditable={true}>Texto editable</div>
      
      {/* crossorigin → crossOrigin */}
      <img src="image.jpg" crossOrigin="anonymous" alt="Imagen" />
      
      {/* autofocus → autoFocus */}
      <input autoFocus />
      
      {/* readonly → readOnly */}
      <input readOnly value="Solo lectura" />
      
      {/* maxlength → maxLength */}
      <input maxLength={50} />
      
      {/* minlength → minLength */}
      <input minLength={5} />
      
      {/* novalidate → noValidate */}
      <form noValidate>
        <input type="email" />
      </form>
    </div>
  );
};
```

### Propiedades de Datos

```jsx
const DataAttributes = () => {
  return (
    <div>
      {/* data-* attributes se mantienen igual */}
      <div data-testid="my-component">Componente</div>
      <div data-user-id="123">Usuario</div>
      
      {/* aria-* attributes se mantienen igual */}
      <button aria-label="Cerrar ventana">×</button>
      <div aria-hidden={true}>Oculto para screen readers</div>
    </div>
  );
};
```

### Eventos en CamelCase

```jsx
const EventHandlers = () => {
  const handleClick = () => console.log('Click!');
  const handleMouseOver = () => console.log('Mouse over!');
  const handleKeyDown = (e) => console.log('Key:', e.key);
  
  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      <div onMouseOver={handleMouseOver}>Hover me</div>
      <input onKeyDown={handleKeyDown} placeholder="Type here" />
      <form onSubmit={(e) => e.preventDefault()}>
        <input onFocus={() => console.log('Focused')} />
        <input onBlur={() => console.log('Blurred')} />
      </form>
    </div>
  );
};
```

---

## ⚡ Reglas Importantes de JSX

### 1. Self-closing Tags

```jsx
// ✅ Correcto
<img src="image.jpg" alt="Imagen" />
<input type="text" />
<br />
<hr />

// ❌ Incorrecto
<img src="image.jpg" alt="Imagen">
<input type="text">
```

### 2. Fragments

```jsx
// ✅ Usando Fragment
import { Fragment } from 'react';

const MyComponent = () => {
  return (
    <Fragment>
      <h1>Título</h1>
      <p>Párrafo</p>
    </Fragment>
  );
};

// ✅ Usando sintaxis corta
const MyComponent2 = () => {
  return (
    <>
      <h1>Título</h1>
      <p>Párrafo</p>
    </>
  );
};
```

### 3. Keys en Listas

```jsx
// ✅ Correcto - key único
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}

// ❌ Evitar índices como keys (solo si no hay otra opción)
{items.map((item, index) => (
  <div key={index}>{item.name}</div>
))}
```

### 4. Expresiones JavaScript

```jsx
const MyComponent = ({ user, count }) => {
  const isAdmin = user?.role === 'admin';
  
  return (
    <div>
      {/* Variables */}
      <h1>{user.name}</h1>
      
      {/* Operaciones */}
      <p>Total: {count * 2}</p>
      
      {/* Métodos */}
      <p>Uppercase: {user.name.toUpperCase()}</p>
      
      {/* Objetos (necesitan ser strings) */}
      <p>{JSON.stringify(user)}</p>
      
      {/* Arrays se renderizan concatenados */}
      <p>{['a', 'b', 'c']}</p> {/* Resultado: abc */}
      
      {/* Funciones */}
      <p>{isAdmin ? 'Admin' : 'User'}</p>
    </div>
  );
};
```

---

## 📚 Referencias Útiles

- **[React JSX Documentation](https://react.dev/learn/writing-markup-with-jsx)** - Documentación oficial
- **[JSX In Depth](https://react.dev/learn/javascript-in-jsx-with-curly-braces)** - JavaScript en JSX
- **[Conditional Rendering](https://react.dev/learn/conditional-rendering)** - Renderizado condicional
- **[Rendering Lists](https://react.dev/learn/rendering-lists)** - Renderizado de listas
- **[React DOM Elements](https://react.dev/reference/react-dom/components)** - Elementos del DOM en React

---

