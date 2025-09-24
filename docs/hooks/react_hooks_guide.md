# Guía de React Hooks: useCallback, useMemo, useContext y useStore

## 1. useCallback

### ¿Qué hace?
`useCallback` memoriza una función para evitar que se recree en cada renderizado.

### ¿Para qué se utiliza y cuándo?
- **Para qué:** Optimizar el rendimiento evitando recrear funciones innecesarias
- **Cuándo usar:**
  - Cuando pasas funciones como props a componentes hijos que usan `React.memo`
  - Cuando la función es una dependencia de otros hooks
  - Cuando crear la función es costoso

### Ejemplo sencillo

```jsx
import React, { useState, useCallback } from 'react';

function TodoList() {
  const [todos, setTodos] = useState(['Estudiar React']);
  const [filter, setFilter] = useState('all');

  // ❌ Sin useCallback - se recrea en cada render
  const handleAddTodo = (text) => {
    setTodos(prev => [...prev, text]);
  };

  // ✅ Con useCallback - solo se recrea si cambian las dependencias
  const handleAddTodoOptimized = useCallback((text) => {
    setTodos(prev => [...prev, text]);
  }, []); // Array vacío = nunca se recrea

  return (
    <div>
      <TodoForm onAddTodo={handleAddTodoOptimized} />
      <FilteredTodos todos={todos} filter={filter} />
    </div>
  );
}
```

---

## 2. useMemo

### ¿Qué hace?
`useMemo` memoriza el resultado de un cálculo para evitar recalcularlo en cada renderizado.

### ¿Para qué se utiliza y cuándo?
- **Para qué:** Optimizar cálculos costosos que no necesitan ejecutarse en cada render
- **Cuándo usar:**
  - Cálculos pesados (filtros, ordenamientos, transformaciones de datos)
  - Crear objetos o arrays que se pasan como props
  - Evitar renderizados innecesarios en componentes hijos

### Ejemplo sencillo

```jsx
import React, { useState, useMemo } from 'react';

function ProductList({ products }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // ❌ Sin useMemo - se ejecuta en cada render
  const filteredProducts = products
    .filter(product => product.name.includes(searchTerm))
    .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));

  // ✅ Con useMemo - solo se recalcula si cambian las dependencias
  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter(product => product.name.includes(searchTerm))
      .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  }, [products, searchTerm, sortBy]);

  return (
    <div>
      <input 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar productos..."
      />
      {filteredAndSortedProducts.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

---

## 3. useContext

### ¿Qué hace?
`useContext` permite acceder a los valores de un Context sin necesidad de usar el componente Consumer.

### ¿Para qué se utiliza y cuándo?
- **Para qué:** Compartir datos entre componentes sin pasar props manualmente a través de múltiples niveles
- **Cuándo usar:**
  - Datos globales (tema, idioma, usuario autenticado)
  - Configuración de la aplicación
  - Estado que necesitan múltiples componentes no relacionados directamente

### Ejemplo sencillo

```jsx
import React, { createContext, useContext, useState } from 'react';

// 1. Crear el Context
const ThemeContext = createContext();

// 2. Crear el Provider
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Usar el Context en componentes hijos
function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <header className={`header-${theme}`}>
      <h1>Mi App</h1>
      <button onClick={toggleTheme}>
        Cambiar a {theme === 'light' ? 'oscuro' : 'claro'}
      </button>
    </header>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Header />
      <main>Contenido de la app</main>
    </ThemeProvider>
  );
}
```

---

## 4. useStore

### ¿Qué hace?
`useStore` **no es un hook nativo de React**. Generalmente se refiere a hooks de librerías de estado como Zustand, Redux Toolkit, o implementaciones customizadas.

### ¿Para qué se utiliza y cuándo?
- **Para qué:** Manejar estado global de forma más eficiente que Context
- **Cuándo usar:**
  - Estado complejo que necesita múltiples componentes
  - Cuando Context causa muchos re-renders
  - Estado que persiste entre navegación

### Ejemplo con Zustand

```jsx
import { create } from 'zustand';

// 1. Crear el store
const useCounterStore = create((set, get) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  // Getter calculado
  isEven: () => get().count % 2 === 0,
}));

// 2. Usar el store en componentes
function Counter() {
  const { count, increment, decrement, reset } = useCounterStore();
  
  return (
    <div>
      <h2>Contador: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

function CounterDisplay() {
  // Solo se re-renderiza cuando cambia count
  const count = useCounterStore((state) => state.count);
  
  return <p>El valor actual es: {count}</p>;
}
```

### Ejemplo de useStore customizado

```jsx
import { useState, useEffect } from 'react';

// Store simple con localStorage
function createStore(key, initialValue) {
  let value = initialValue;
  let listeners = [];

  const getSnapshot = () => value;
  
  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  const setValue = (newValue) => {
    value = newValue;
    localStorage.setItem(key, JSON.stringify(newValue));
    listeners.forEach(listener => listener());
  };

  // Cargar valor inicial desde localStorage
  try {
    const stored = localStorage.getItem(key);
    if (stored) value = JSON.parse(stored);
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }

  return { getSnapshot, subscribe, setValue };
}

// Hook personalizado
function useStore(store) {
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      forceUpdate({});
    });
    return unsubscribe;
  }, [store]);
  
  return [store.getSnapshot(), store.setValue];
}

// Uso
const userStore = createStore('user', { name: '', email: '' });

function UserProfile() {
  const [user, setUser] = useStore(userStore);
  
  return (
    <div>
      <input 
        value={user.name}
        onChange={(e) => setUser({...user, name: e.target.value})}
        placeholder="Nombre"
      />
      <input 
        value={user.email}
        onChange={(e) => setUser({...user, email: e.target.value})}
        placeholder="Email"
      />
    </div>
  );
}
```

---

## Resumen de cuándo usar cada hook

| Hook | Cuándo usarlo | Beneficio principal |
|------|---------------|-------------------|
| `useCallback` | Funciones que se pasan como props o son dependencias | Evita re-creación innecesaria de funciones |
| `useMemo` | Cálculos costosos o creación de objetos/arrays | Evita recálculos innecesarios |
| `useContext` | Datos que necesitan múltiples componentes | Evita prop drilling |
| `useStore` | Estado global complejo | Mejor rendimiento que Context para estado global |

**Tip importante:** No optimices prematuramente. Usa estos hooks solo cuando identifiques problemas de rendimiento reales.