# Testing Custom Hooks con Vitest - Guía de Formación (JavaScript)


## 🛠️ Instalación y Configuración

### 1. Dependencias necesarias

```bash
# Vitest y utilidades de testing
npm install -D vitest @vitest/ui

# React Testing Library para hooks
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/react-hooks

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

// Mock de fetch si tu hook hace llamadas HTTP
global.fetch = vi.fn()
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

## 🎯 Custom Hook de Ejemplo

Vamos a crear un hook que simule la carga de datos de una API con estado de loading y manejo de errores.

### `src/hooks/useApiData.js`

```javascript
import { useState, useEffect } from 'react'

/**
 * Custom hook para manejar datos de API
 * @param {number} id - ID del elemento a buscar
 * @returns {Object} - Objeto con data, loading, error y refetch
 */
export const useApiData = (id) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    // No hacer nada si el ID no es válido
    if (id <= 0) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err.message || 'Error desconocido')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  // useEffect se ejecuta cuando cambia el ID
  useEffect(() => {
    fetchData()
  }, [id])

  // Función para volver a cargar los datos manualmente
  const refetch = () => {
    fetchData()
  }

  return { 
    data, 
    loading, 
    error, 
    refetch 
  }
}
```

---

## 🧪 Tests del Custom Hook

### `src/hooks/__tests__/useApiData.test.js`

```javascript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useApiData } from '../useApiData'

// Mock de fetch global
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('useApiData Hook Tests', () => {
  beforeEach(() => {
    // Limpia todos los mocks antes de cada test
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Restaura todos los mocks después de cada test
    vi.resetAllMocks()
  })

  /**
   * TEST 1: Estado inicial del hook
   */
  it('debe inicializar con estado por defecto', () => {
    const { result } = renderHook(() => useApiData(1))
    
    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(typeof result.current.refetch).toBe('function')
  })

  /**
   * TEST 2: Estado de loading
   */
  it('debe manejar el estado de loading correctamente', async () => {
    // Simula una respuesta exitosa
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        title: 'Test todo',
        completed: false
      })
    })

    const { result } = renderHook(() => useApiData(1))

    // Al inicio debe estar en loading
    await waitFor(() => {
      expect(result.current.loading).toBe(true)
    })

    // Después debe completarse
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.data).toEqual({
        id: 1,
        title: 'Test todo',
        completed: false
      })
    })
  })

  /**
   * TEST 3: Carga exitosa de datos
   */
  it('debe cargar datos exitosamente', async () => {
    const mockData = {
      id: 1,
      title: 'Hacer las compras',
      completed: false
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })

    const { result } = renderHook(() => useApiData(1))

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData)
      expect(result.current.error).toBeNull()
      expect(result.current.loading).toBe(false)
    })

    // Verifica que se haya llamado fetch con la URL correcta
    expect(mockFetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/1')
  })

  /**
   * TEST 4: Manejo de errores de red
   */
  it('debe manejar errores de la API', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network Error'))

    const { result } = renderHook(() => useApiData(1))

    await waitFor(() => {
      expect(result.current.error).toBe('Network Error')
      expect(result.current.data).toBeNull()
      expect(result.current.loading).toBe(false)
    })
  })

  /**
   * TEST 5: Manejo de respuestas HTTP no exitosas
   */
  it('debe manejar respuestas con status de error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    })

    const { result } = renderHook(() => useApiData(999))

    await waitFor(() => {
      expect(result.current.error).toBe('Error: 404')
      expect(result.current.data).toBeNull()
      expect(result.current.loading).toBe(false)
    })
  })

  /**
   * TEST 6: Cambio de ID recarga los datos
   */
  it('debe recargar datos cuando cambia el ID', async () => {
    const mockData1 = { id: 1, title: 'Todo 1', completed: false }
    const mockData2 = { id: 2, title: 'Todo 2', completed: true }

    // Primera llamada
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData1
    })

    const { result, rerender } = renderHook(
      ({ id }) => useApiData(id),
      { initialProps: { id: 1 } }
    )

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData1)
    })

    // Segunda llamada con ID diferente
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData2
    })

    rerender({ id: 2 })

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData2)
    })

    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  /**
   * TEST 7: Función refetch
   */
  it('debe permitir recargar datos con refetch', async () => {
    const mockData = { id: 1, title: 'Todo refetch', completed: false }

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockData
    })

    const { result } = renderHook(() => useApiData(1))

    // Espera a que cargue inicialmente
    await waitFor(() => {
      expect(result.current.data).toEqual(mockData)
    })

    // Llama a refetch
    result.current.refetch()

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData)
    })

    // Debe haberse llamado fetch 2 veces (inicial + refetch)
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  /**
   * TEST 8: No hacer fetch con ID inválido
   */
  it('no debe hacer fetch con ID menor o igual a 0', () => {
    renderHook(() => useApiData(0))
    renderHook(() => useApiData(-1))

    expect(mockFetch).not.toHaveBeenCalled()
  })
})
```

---

## 📋 Explicación del Código de Testing

### Estructura del Test

1. **Imports y Setup**:
   - Importamos las utilidades de Vitest y Testing Library
   - Mockeamos la función `fetch` global

2. **beforeEach/afterEach**:
   - `beforeEach`: Limpia los mocks antes de cada test
   - `afterEach`: Restaura los mocks después de cada test

3. **renderHook**:
   - Función que permite testear hooks fuera de un componente React
   - Retorna un objeto `result` con el valor actual del hook

4. **waitFor**:
   - Espera a que se cumplan ciertas condiciones asíncronas
   - Útil para operaciones que cambian el estado del hook

### Tests Implementados

1. **Estado inicial**: Verifica que el hook inicie con valores por defecto
2. **Loading state**: Comprueba que el estado de carga funcione correctamente
3. **Carga exitosa**: Testa que los datos se carguen y almacenen bien
4. **Manejo de errores**: Verifica que los errores se capturen correctamente
5. **Errores HTTP**: Testa respuestas con status de error (404, 500, etc.)
6. **Cambio de ID**: Comprueba que cambiar el ID recargue los datos
7. **Función refetch**: Testa la funcionalidad de recarga manual
8. **ID inválido**: Verifica que no se hagan requests con IDs inválidos

---

## 🚀 Comandos para Ejecutar

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm test

# Ejecutar tests una sola vez
npm run test:run

# Ejecutar con interfaz visual
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage
```

---

## 💡 Mejores Prácticas

### 1. Naming de Tests
- Usa descripciones claras de lo que testeas
- Comienza con "debe" o "should"

### 2. Arrange, Act, Assert
```javascript
it('debe manejar errores correctamente', async () => {
  // Arrange - Preparar el mock
  mockFetch.mockRejectedValueOnce(new Error('Network Error'))
  
  // Act - Ejecutar el hook
  const { result } = renderHook(() => useApiData(1))
  
  // Assert - Verificar el resultado
  await waitFor(() => {
    expect(result.current.error).toBe('Network Error')
  })
})
```

### 3. Limpieza de Mocks
- Siempre limpia los mocks entre tests
- Usa `beforeEach` y `afterEach` consistentemente

### 4. Tests Específicos
- Un test por funcionalidad
- Evita tests que verifiquen múltiples cosas

---

## 🔧 Debugging Tips

1. **Console.log en tests**:
```javascript
it('debug test', async () => {
  const { result } = renderHook(() => useApiData(1))
  console.log('Current state:', result.current)
})
```

2. **Usar screen.debug()** para componentes:
```javascript
import { screen } from '@testing-library/react'
screen.debug() // Imprime el DOM actual
```

3. **Verificar llamadas a mocks**:
```javascript
expect(mockFetch).toHaveBeenCalledWith('expected-url')
expect(mockFetch).toHaveBeenCalledTimes(2)
```

---

## 🎯 Conclusión

Este ejemplo te muestra cómo testear completamente un custom hook con:
- Estados (useState)
- Efectos secundarios (useEffect)
- Operaciones asíncronas (fetch)
- Manejo de errores
- Funciones de recarga

Los tests cubren todos los casos de uso posibles y garantizan que el hook funcione correctamente en diferentes escenarios.

---

