# Testing Componentes React con Vitest - Guía de Formación (JavaScript)



## 🛠️ Instalación y Configuración

### 1. Dependencias necesarias

```bash
# Vitest y utilidades de testing
npm install -D vitest @vitest/ui

# React Testing Library para componentes
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Entorno de testing para DOM
npm install -D jsdom

# React (si no lo tienes)
npm install react react-dom
```

### 2. Configuración de Vitest

Crea el archivo `vitest.config.js` en la raíz del proyecto:

```javascript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
```

### 3. Setup de testing

Crea `src/test/setup.js`:

```javascript
import '@testing-library/jest-dom'

// Mock de fetch para componentes que hagan llamadas HTTP
global.fetch = vi.fn()

// Mock de ResizeObserver si es necesario
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
```

### 4. Scripts en package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## 🎯 Componente React de Ejemplo

Vamos a crear un componente de lista de tareas (TodoList) que incluya interacciones, estado interno y efectos.

### `src/components/TodoList.js`

```javascript
import { useState, useEffect } from 'react'

/**
 * Componente TodoList - Maneja una lista de tareas
 * @param {Object} props - Props del componente
 * @param {Array} props.initialTodos - Lista inicial de todos
 * @param {Function} props.onTodosChange - Callback cuando cambian los todos
 * @param {boolean} props.showCompleted - Mostrar todos completados
 */
const TodoList = ({ 
  initialTodos = [], 
  onTodosChange,
  showCompleted = true 
}) => {
  const [todos, setTodos] = useState(initialTodos)
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState('all') // 'all', 'active', 'completed'
  const [loading, setLoading] = useState(false)

  // Efecto para notificar cambios en los todos
  useEffect(() => {
    if (onTodosChange) {
      onTodosChange(todos)
    }
  }, [todos, onTodosChange])

  // Efecto para cargar datos iniciales si no hay todos
  useEffect(() => {
    if (initialTodos.length === 0) {
      loadDefaultTodos()
    }
  }, [])

  const loadDefaultTodos = async () => {
    setLoading(true)
    try {
      // Simula una llamada a API
      await new Promise(resolve => setTimeout(resolve, 500))
      const defaultTodos = [
        { id: 1, text: 'Aprender React', completed: false },
        { id: 2, text: 'Escribir tests', completed: false }
      ]
      setTodos(defaultTodos)
    } catch (error) {
      console.error('Error loading default todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false
      }
      setTodos(prevTodos => [...prevTodos, todo])
      setNewTodo('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  // Filtrar todos según el estado actual
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  // Solo mostrar completados si showCompleted es true
  const visibleTodos = showCompleted 
    ? filteredTodos 
    : filteredTodos.filter(todo => !todo.completed)

  const completedCount = todos.filter(todo => todo.completed).length
  const activeCount = todos.length - completedCount

  if (loading) {
    return <div data-testid="loading">Cargando tareas...</div>
  }

  return (
    <div className="todo-list" data-testid="todo-list">
      <h2>Lista de Tareas</h2>
      
      {/* Input para nuevas tareas */}
      <div className="todo-input">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Añadir nueva tarea..."
          data-testid="todo-input"
        />
        <button 
          onClick={addTodo}
          disabled={!newTodo.trim()}
          data-testid="add-button"
        >
          Añadir
        </button>
      </div>

      {/* Filtros */}
      <div className="todo-filters">
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'active' : ''}
          data-testid="filter-all"
        >
          Todas ({todos.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={filter === 'active' ? 'active' : ''}
          data-testid="filter-active"
        >
          Activas ({activeCount})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={filter === 'completed' ? 'active' : ''}
          data-testid="filter-completed"
        >
          Completadas ({completedCount})
        </button>
      </div>

      {/* Lista de todos */}
      <ul className="todo-items" data-testid="todo-items">
        {visibleTodos.length === 0 ? (
          <li data-testid="no-todos">No hay tareas para mostrar</li>
        ) : (
          visibleTodos.map(todo => (
            <li 
              key={todo.id} 
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
              data-testid={`todo-item-${todo.id}`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                data-testid={`toggle-${todo.id}`}
              />
              <span 
                className="todo-text"
                data-testid={`todo-text-${todo.id}`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="delete-button"
                data-testid={`delete-${todo.id}`}
              >
                Eliminar
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Acciones adicionales */}
      {completedCount > 0 && (
        <div className="todo-actions">
          <button
            onClick={clearCompleted}
            data-testid="clear-completed"
          >
            Limpiar completadas ({completedCount})
          </button>
        </div>
      )}
    </div>
  )
}

export default TodoList
```

---

## 🧪 Tests del Componente React

### `src/components/__tests__/TodoList.test.js`

```javascript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoList from '../TodoList'

describe('TodoList Component Tests', () => {
  let user

  beforeEach(() => {
    // Configurar user-event para cada test
    user = userEvent.setup()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  /**
   * TEST 1: Renderizado inicial
   */
  it('debe renderizar correctamente con props por defecto', () => {
    render(<TodoList />)
    
    expect(screen.getByText('Lista de Tareas')).toBeInTheDocument()
    expect(screen.getByTestId('todo-input')).toBeInTheDocument()
    expect(screen.getByTestId('add-button')).toBeInTheDocument()
    expect(screen.getByTestId('filter-all')).toBeInTheDocument()
  })

  /**
   * TEST 2: Renderizado con todos iniciales
   */
  it('debe mostrar todos iniciales cuando se pasan como props', () => {
    const initialTodos = [
      { id: 1, text: 'Tarea 1', completed: false },
      { id: 2, text: 'Tarea 2', completed: true }
    ]

    render(<TodoList initialTodos={initialTodos} />)

    expect(screen.getByText('Tarea 1')).toBeInTheDocument()
    expect(screen.getByText('Tarea 2')).toBeInTheDocument()
    expect(screen.getByText('Todas (2)')).toBeInTheDocument()
  })

  /**
   * TEST 3: Añadir nueva tarea
   */
  it('debe permitir añadir una nueva tarea', async () => {
    render(<TodoList />)

    const input = screen.getByTestId('todo-input')
    const addButton = screen.getByTestId('add-button')

    // Escribir en el input
    await user.type(input, 'Nueva tarea')
    expect(input).toHaveValue('Nueva tarea')

    // Hacer click en añadir
    await user.click(addButton)

    // Verificar que se añadió la tarea
    expect(screen.getByText('Nueva tarea')).toBeInTheDocument()
    expect(input).toHaveValue('') // Input se limpia
  })

  /**
   * TEST 4: Añadir tarea con Enter
   */
  it('debe añadir tarea al presionar Enter', async () => {
    render(<TodoList />)

    const input = screen.getByTestId('todo-input')

    await user.type(input, 'Tarea con Enter')
    await user.keyboard('{Enter}')

    expect(screen.getByText('Tarea con Enter')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  /**
   * TEST 5: No añadir tareas vacías
   */
  it('no debe añadir tareas vacías o solo con espacios', async () => {
    render(<TodoList />)

    const input = screen.getByTestId('todo-input')
    const addButton = screen.getByTestId('add-button')

    // Botón debe estar deshabilitado inicialmente
    expect(addButton).toBeDisabled()

    // Intentar añadir solo espacios
    await user.type(input, '   ')
    await user.click(addButton)

    expect(screen.getByText('No hay tareas para mostrar')).toBeInTheDocument()
  })

  /**
   * TEST 6: Marcar tarea como completada
   */
  it('debe permitir marcar/desmarcar tareas como completadas', async () => {
    const initialTodos = [
      { id: 1, text: 'Tarea de prueba', completed: false }
    ]

    render(<TodoList initialTodos={initialTodos} />)

    const checkbox = screen.getByTestId('toggle-1')
    expect(checkbox).not.toBeChecked()

    // Marcar como completada
    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    // Desmarcar
    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  /**
   * TEST 7: Eliminar tarea
   */
  it('debe permitir eliminar tareas', async () => {
    const initialTodos = [
      { id: 1, text: 'Tarea a eliminar', completed: false }
    ]

    render(<TodoList initialTodos={initialTodos} />)

    expect(screen.getByText('Tarea a eliminar')).toBeInTheDocument()

    const deleteButton = screen.getByTestId('delete-1')
    await user.click(deleteButton)

    expect(screen.queryByText('Tarea a eliminar')).not.toBeInTheDocument()
    expect(screen.getByText('No hay tareas para mostrar')).toBeInTheDocument()
  })

  /**
   * TEST 8: Filtros de tareas
   */
  it('debe filtrar tareas correctamente', async () => {
    const initialTodos = [
      { id: 1, text: 'Tarea activa', completed: false },
      { id: 2, text: 'Tarea completada', completed: true }
    ]

    render(<TodoList initialTodos={initialTodos} />)

    // Mostrar todas
    expect(screen.getByText('Tarea activa')).toBeInTheDocument()
    expect(screen.getByText('Tarea completada')).toBeInTheDocument()

    // Filtrar solo activas
    await user.click(screen.getByTestId('filter-active'))
    expect(screen.getByText('Tarea activa')).toBeInTheDocument()
    expect(screen.queryByText('Tarea completada')).not.toBeInTheDocument()

    // Filtrar solo completadas
    await user.click(screen.getByTestId('filter-completed'))
    expect(screen.queryByText('Tarea activa')).not.toBeInTheDocument()
    expect(screen.getByText('Tarea completada')).toBeInTheDocument()
  })

  /**
   * TEST 9: Limpiar tareas completadas
   */
  it('debe permitir limpiar todas las tareas completadas', async () => {
    const initialTodos = [
      { id: 1, text: 'Tarea activa', completed: false },
      { id: 2, text: 'Tarea completada 1', completed: true },
      { id: 3, text: 'Tarea completada 2', completed: true }
    ]

    render(<TodoList initialTodos={initialTodos} />)

    expect(screen.getByText('Limpiar completadas (2)')).toBeInTheDocument()

    await user.click(screen.getByTestId('clear-completed'))

    expect(screen.getByText('Tarea activa')).toBeInTheDocument()
    expect(screen.queryByText('Tarea completada 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Tarea completada 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Limpiar completadas')).not.toBeInTheDocument()
  })

  /**
   * TEST 10: Contadores de tareas
   */
  it('debe mostrar contadores correctos', async () => {
    const initialTodos = [
      { id: 1, text: 'Tarea 1', completed: false },
      { id: 2, text: 'Tarea 2', completed: false },
      { id: 3, text: 'Tarea 3', completed: true }
    ]

    render(<TodoList initialTodos={initialTodos} />)

    expect(screen.getByText('Todas (3)')).toBeInTheDocument()
    expect(screen.getByText('Activas (2)')).toBeInTheDocument()
    expect(screen.getByText('Completadas (1)')).toBeInTheDocument()

    // Completar una tarea más
    await user.click(screen.getByTestId('toggle-1'))

    expect(screen.getByText('Activas (1)')).toBeInTheDocument()
    expect(screen.getByText('Completadas (2)')).toBeInTheDocument()
  })

  /**
   * TEST 11: Prop showCompleted
   */
  it('debe respetar la prop showCompleted', () => {
    const initialTodos = [
      { id: 1, text: 'Tarea activa', completed: false },
      { id: 2, text: 'Tarea completada', completed: true }
    ]

    render(<TodoList initialTodos={initialTodos} showCompleted={false} />)

    expect(screen.getByText('Tarea activa')).toBeInTheDocument()
    expect(screen.queryByText('Tarea completada')).not.toBeInTheDocument()
  })

  /**
   * TEST 12: Callback onTodosChange
   */
  it('debe llamar onTodosChange cuando cambian los todos', async () => {
    const mockOnTodosChange = vi.fn()
    const initialTodos = [
      { id: 1, text: 'Tarea inicial', completed: false }
    ]

    render(
      <TodoList 
        initialTodos={initialTodos} 
        onTodosChange={mockOnTodosChange} 
      />
    )

    // Se llama inicialmente
    expect(mockOnTodosChange).toHaveBeenCalledWith(initialTodos)

    // Se llama al añadir una tarea
    const input = screen.getByTestId('todo-input')
    await user.type(input, 'Nueva tarea')
    await user.click(screen.getByTestId('add-button'))

    expect(mockOnTodosChange).toHaveBeenCalledTimes(2)
    
    // Verificar que se llamó con la lista actualizada
    const lastCall = mockOnTodosChange.mock.calls[1][0]
    expect(lastCall).toHaveLength(2)
    expect(lastCall[1].text).toBe('Nueva tarea')
  })

  /**
   * TEST 13: Estado de loading
   */
  it('debe mostrar estado de loading cuando no hay todos iniciales', async () => {
    // Mock de setTimeout para controlar el timing
    vi.useFakeTimers()
    
    render(<TodoList />)

    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.getByText('Cargando tareas...')).toBeInTheDocument()

    // Avanzar el tiempo para que termine el loading
    vi.advanceTimersByTime(500)

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      expect(screen.getByText('Aprender React')).toBeInTheDocument()
    })

    vi.useRealTimers()
  })

  /**
   * TEST 14: Estilos CSS aplicados
   */
  it('debe aplicar clases CSS correctamente', () => {
    const initialTodos = [
      { id: 1, text: 'Tarea completada', completed: true },
      { id: 2, text: 'Tarea activa', completed: false }
    ]

    render(<TodoList initialTodos={initialTodos} />)

    const completedItem = screen.getByTestId('todo-item-1')
    const activeItem = screen.getByTestId('todo-item-2')

    expect(completedItem).toHaveClass('todo-item', 'completed')
    expect(activeItem).toHaveClass('todo-item')
    expect(activeItem).not.toHaveClass('completed')
  })

  /**
   * TEST 15: Accesibilidad y data-testids
   */
  it('debe tener los atributos de accesibilidad correctos', () => {
    const initialTodos = [
      { id: 1, text: 'Tarea de prueba', completed: false }
    ]

    render(<TodoList initialTodos={initialTodos} />)

    // Verificar que todos los elementos tengan data-testid
    expect(screen.getByTestId('todo-list')).toBeInTheDocument()
    expect(screen.getByTestId('todo-input')).toBeInTheDocument()
    expect(screen.getByTestId('add-button')).toBeInTheDocument()
    expect(screen.getByTestId('todo-items')).toBeInTheDocument()
    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument()
    expect(screen.getByTestId('toggle-1')).toBeInTheDocument()
    expect(screen.getByTestId('delete-1')).toBeInTheDocument()
  })
})
```

---

## 📋 Explicación del Código de Testing

### Estructura del Test para Componentes

1. **Imports esenciales**:
   - `render`: Renderiza el componente para testing
   - `screen`: Accede a elementos del DOM renderizado  
   - `fireEvent`: Dispara eventos básicos
   - `userEvent`: Simula interacciones reales del usuario
   - `waitFor`: Espera cambios asíncronos

2. **userEvent.setup()**:
   - Configura userEvent para simular interacciones reales
   - Más preciso que fireEvent para eventos de usuario

3. **data-testid**:
   - Atributos específicos para testing
   - No dependen de clases CSS o estructura DOM
   - Facilitan el mantenimiento de los tests

### Tipos de Tests Implementados

1. **Renderizado**: Verifica que el componente se muestre correctamente
2. **Props**: Testa que las props se manejen bien
3. **Interacciones**: Simula clicks, escritura, etc.
4. **Estado interno**: Verifica cambios de state
5. **Efectos**: Testa useEffect y operaciones asíncronas
6. **Callbacks**: Verifica que se llamen las funciones prop
7. **Condicionales**: Testa renderizado condicional
8. **Estilos**: Verifica clases CSS aplicadas

---

## 🎨 Patrones de Testing Comunes

### 1. Testing de Input Controlado
```javascript
it('debe manejar input controlado', async () => {
  render(<TodoList />)
  
  const input = screen.getByTestId('todo-input')
  await user.type(input, 'Nuevo texto')
  
  expect(input).toHaveValue('Nuevo texto')
})
```

### 2. Testing de Eventos
```javascript
it('debe manejar eventos de click', async () => {
  render(<TodoList />)
  
  const button = screen.getByTestId('add-button')
  await user.click(button)
  
  // Verificar efecto del click
})
```

### 3. Testing de Estado Asíncrono
```javascript
it('debe manejar operaciones asíncronas', async () => {
  render(<TodoList />)
  
  await waitFor(() => {
    expect(screen.getByText('Contenido cargado')).toBeInTheDocument()
  })
})
```

### 4. Testing de Callbacks
```javascript
it('debe llamar callbacks de props', async () => {
  const mockCallback = vi.fn()
  render(<TodoList onTodosChange={mockCallback} />)
  
  expect(mockCallback).toHaveBeenCalledWith(expectedValue)
})
```

---

## 🔍 Queries Útiles en Testing Library

### Queries de Búsqueda
```javascript
// Por texto visible
screen.getByText('Texto visible')

// Por test ID
screen.getByTestId('mi-elemento')

// Por rol ARIA
screen.getByRole('button', { name: 'Enviar' })

// Por label de formulario
screen.getByLabelText('Email')

// Por placeholder
screen.getByPlaceholderText('Escribe aquí...')
```

### Diferencia entre get, query, find
```javascript
// getBy - Falla si no encuentra (síncrono)
screen.getByText('Texto')

// queryBy - Retorna null si no encuentra (síncrono)  
screen.queryByText('Texto que no existe')

// findBy - Espera a que aparezca (asíncrono)
await screen.findByText('Texto que aparece después')
```

---

## ⚡ Comandos para Ejecutar

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests específicos
npm test TodoList

# Ejecutar con interfaz visual  
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage

# Modo watch (recarga automática)
npm test -- --watch
```

---

## 🐛 Debugging en Tests

### 1. Ver el DOM renderizado
```javascript
it('debug test', () => {
  render(<TodoList />)
  screen.debug() // Muestra todo el DOM
  screen.debug(screen.getByTestId('todo-list')) // Solo un elemento
})
```

### 2. Usar logRoles para accesibilidad
```javascript
import { logRoles } from '@testing-library/dom'

it('ver roles disponibles', () => {
  const { container } = render(<TodoList />)
  logRoles(container) // Muestra todos los roles ARIA
})
```

### 3. Verificar queries disponibles
```javascript
it('queries disponibles', () => {
  render(<TodoList />)
  screen.logTestingPlaygroundURL() // URL para Testing Playground
})
```

---

## 💡 Mejores Prácticas para Componentes

### 1. Usar data-testid estratégicamente
- Solo cuando otras queries no funcionen
- Para elementos dinámicos o complejos

### 2. Testear comportamiento, no implementación
```javascript
// ❌ Malo - testa implementación
expect(component.state.count).toBe(1)

// ✅ Bueno - testa comportamiento
expect(screen.getByText('Contador: 1')).toBeInTheDocument()
```

### 3. Simular interacciones reales
```javascript
// ❌ fireEvent es básico
fireEvent.click(button)

// ✅ userEvent simula mejor las interacciones
await user.click(button)
```

### 4. Agrupar tests lógicamente
```javascript
describe('TodoList - Funcionalidad básica', () => {
  // Tests de renderizado y props
})

describe('TodoList - Interacciones de usuario', () => {
  // Tests de clicks, typing, etc.
})
```

---

## 🎯 Conclusión

Este ejemplo completo te muestra cómo testear un componente React que incluye:

- **Estado interno** (useState)
- **Efectos secundarios** (useEffect)  
- **Interacciones de usuario** (clicks, typing)
- **Props y callbacks**
- **Renderizado condicional**
- **Operaciones asíncronas**
- **Filtros y transformaciones**

Los tests cubren desde funcionalidades básicas hasta casos edge y garantizan que el componente funcione correctamente en todos los escenarios.

---

