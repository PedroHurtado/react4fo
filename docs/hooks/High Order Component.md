# Higher-Order Components (HOC) en React

## ¿Qué son los HOC?

Los **Higher-Order Components (HOC)** son una técnica avanzada en React para reutilizar la lógica de componentes. Un HOC es una función que toma un componente y devuelve un nuevo componente con funcionalidad adicional.

```javascript
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

Los HOC no forman parte de la API de React, sino que son un patrón que surge de la naturaleza compositiva de React.

## Características Principales

- **No modifican** el componente original
- **Componen** componentes envolviendo uno existente
- Son **funciones puras** sin efectos secundarios
- Siguen el principio de **composición sobre herencia**

## Sintaxis Básica

```javascript
function withEnhancement(WrappedComponent) {
  return function EnhancedComponent(props) {
    // Lógica adicional aquí
    return <WrappedComponent {...props} />;
  };
}

// O usando arrow functions
const withEnhancement = (WrappedComponent) => (props) => {
  // Lógica adicional aquí
  return <WrappedComponent {...props} />;
};
```

## Casos de Uso Comunes

### 1. **Autenticación y Autorización**
Verificar si un usuario está autenticado antes de renderizar un componente.

### 2. **Logging y Analytics**
Agregar capacidades de registro o seguimiento a múltiples componentes.

### 3. **Manejo de Estado Global**
Conectar componentes con stores de estado (como Redux).

### 4. **Carga de Datos**
Manejar estados de carga, error y datos para componentes que consumen APIs.

### 5. **Formateo y Transformación**
Aplicar transformaciones consistentes a props o datos.

### 6. **Renderizado Condicional**
Mostrar u ocultar componentes basado en condiciones específicas.

### 7. **Inyección de Props**
Agregar props adicionales a componentes de forma automática.

## Ventajas de los HOC

- **Reutilización de código**: Permite compartir lógica entre múltiples componentes
- **Separación de responsabilidades**: Mantiene la lógica de negocio separada de la presentación
- **Composición**: Permite combinar múltiples HOC para crear funcionalidades complejas
- **Flexibilidad**: Pueden aplicarse a cualquier componente de React

## Desventajas de los HOC

- **Wrapper Hell**: Múltiples HOC pueden crear una jerarquía profunda de componentes
- **Colisión de props**: Props con el mismo nombre pueden ser sobrescritos
- **Debugging complejo**: Puede ser difícil rastrear problemas a través de múltiples capas
- **Referencias perdidas**: Los refs no se pasan automáticamente

## Mejores Prácticas

1. **Convención de nombres**: Usar prefijo `with` (ej: `withAuth`, `withData`)
2. **Pasar todas las props**: Usar el spread operator `{...props}`
3. **Manejar displayName**: Asignar un nombre descriptivo para debugging
4. **Forwarding refs**: Usar `React.forwardRef` cuando sea necesario
5. **Evitar usar en render**: No crear HOC dentro del método render

## Ejemplo 1: HOC para Autenticación

```javascript
// HOC para manejar autenticación
import React from 'react';
import { Navigate } from 'react-router-dom';

// HOC que requiere autenticación
const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    // Simular verificación de autenticación
    const isAuthenticated = localStorage.getItem('token') !== null;
    
    if (!isAuthenticated) {
      // Redirigir a login si no está autenticado
      return <Navigate to="/login" replace />;
    }
    
    // Renderizar el componente si está autenticado
    return <WrappedComponent {...props} />;
  };

  // Asignar displayName para debugging
  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return AuthenticatedComponent;
};

// Componente que requiere autenticación
const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Contenido privado que solo usuarios autenticados pueden ver</p>
      <div>
        <h3>Estadísticas</h3>
        <ul>
          <li>Usuarios activos: 1,234</li>
          <li>Ventas del mes: $12,450</li>
          <li>Productos en stock: 89</li>
        </ul>
      </div>
    </div>
  );
};

// Componente de perfil
const Profile = ({ userId }) => {
  return (
    <div>
      <h1>Perfil de Usuario</h1>
      <p>ID del usuario: {userId}</p>
      <div>
        <h3>Información Personal</h3>
        <p>Email: usuario@ejemplo.com</p>
        <p>Teléfono: +1234567890</p>
        <p>Fecha de registro: 15/03/2024</p>
      </div>
    </div>
  );
};

// Envolver componentes con el HOC
const ProtectedDashboard = withAuth(Dashboard);
const ProtectedProfile = withAuth(Profile);

// Uso en la aplicación
const App = () => {
  return (
    <div>
      <nav>
        <h2>Mi Aplicación</h2>
      </nav>
      <main>
        <ProtectedDashboard />
        <ProtectedProfile userId="123" />
      </main>
    </div>
  );
};

export default App;
```

## Ejemplo 2: HOC para Carga de Datos

```javascript
// HOC para manejar carga de datos
import React, { useState, useEffect } from 'react';

// HOC que maneja estados de carga, error y datos
const withDataFetching = (WrappedComponent, dataSource) => {
  const DataFetchingComponent = (props) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // Simular delay de red
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Llamada a API
          const response = await fetch(dataSource);
          
          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
          }
          
          const result = await response.json();
          setData(result);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);

    const retry = () => {
      setError(null);
      setLoading(true);
      // Re-trigger useEffect
      window.location.reload();
    };

    // Mostrar spinner de carga
    if (loading) {
      return (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          fontSize: '18px'
        }}>
          <div style={{ marginBottom: '20px' }}>🔄</div>
          <div>Cargando datos...</div>
        </div>
      );
    }

    // Mostrar error si existe
    if (error) {
      return (
        <div style={{ 
          color: '#dc3545', 
          textAlign: 'center', 
          padding: '40px',
          border: '2px solid #dc3545',
          borderRadius: '8px',
          margin: '20px'
        }}>
          <h3>❌ Error al cargar los datos</h3>
          <p style={{ fontSize: '16px', margin: '20px 0' }}>{error}</p>
          <button 
            onClick={retry}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🔄 Reintentar
          </button>
        </div>
      );
    }

    // Renderizar componente con los datos
    return (
      <WrappedComponent 
        {...props} 
        data={data}
        loading={loading}
        error={error}
      />
    );
  };

  // Asignar displayName
  DataFetchingComponent.displayName = `withDataFetching(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return DataFetchingComponent;
};

// Componente para mostrar lista de usuarios
const UserList = ({ data }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>👥 Lista de Usuarios ({data?.length || 0})</h2>
      <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
        {data?.map(user => (
          <div 
            key={user.id}
            style={{
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa'
            }}
          >
            <strong style={{ color: '#007bff' }}>{user.name}</strong>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              📧 {user.email}
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              🌐 {user.website}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para mostrar posts
const PostList = ({ data }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>📝 Posts Recientes ({data?.length || 0})</h2>
      <div style={{ marginTop: '20px' }}>
        {data?.map(post => (
          <article 
            key={post.id} 
            style={{ 
              marginBottom: '25px', 
              padding: '20px', 
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ 
              color: '#333', 
              marginBottom: '10px',
              fontSize: '18px'
            }}>
              {post.title}
            </h3>
            <p style={{ 
              color: '#666', 
              lineHeight: '1.6',
              fontSize: '14px'
            }}>
              {post.body}
            </p>
            <div style={{ 
              marginTop: '15px', 
              fontSize: '12px', 
              color: '#999' 
            }}>
              Post #{post.id} | Usuario: {post.userId}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

// Crear componentes envueltos con el HOC
const UsersWithData = withDataFetching(
  UserList, 
  'https://jsonplaceholder.typicode.com/users'
);

const PostsWithData = withDataFetching(
  PostList, 
  'https://jsonplaceholder.typicode.com/posts?_limit=5'
);

// Componente principal
const App = () => {
  const [activeTab, setActiveTab] = useState('users');

  const tabStyle = (isActive) => ({
    padding: '10px 20px',
    marginRight: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    backgroundColor: isActive ? '#007bff' : '#f8f9fa',
    color: isActive ? 'white' : '#333',
    transition: 'all 0.3s ease'
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderBottom: '1px solid #ddd',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: '0 0 20px 0', color: '#333' }}>
          🚀 Demo de HOC con Carga de Datos
        </h1>
        <nav>
          <button 
            onClick={() => setActiveTab('users')}
            style={tabStyle(activeTab === 'users')}
          >
            👥 Usuarios
          </button>
          <button 
            onClick={() => setActiveTab('posts')}
            style={tabStyle(activeTab === 'posts')}
          >
            📝 Posts
          </button>
        </nav>
      </header>
      
      <main style={{ padding: '0 20px' }}>
        {activeTab === 'users' && <UsersWithData />}
        {activeTab === 'posts' && <PostsWithData />}
      </main>
      
      <footer style={{ 
        textAlign: 'center', 
        padding: '40px', 
        color: '#666',
        fontSize: '14px'
      }}>
        Ejemplo de Higher-Order Components en React
      </footer>
    </div>
  );
};

export default App;
```

## Composición de HOC

Los HOC pueden combinarse para crear funcionalidades más complejas:

```javascript
// Combinar múltiples HOC
const EnhancedComponent = withAuth(withDataFetching(withLogging(MyComponent)));

// O usando una función de composición
const compose = (...funcs) => (Component) => 
  funcs.reduceRight((acc, func) => func(acc), Component);

const EnhancedComponent = compose(
  withAuth,
  withDataFetching,
  withLogging
)(MyComponent);
```

## HOC vs Hooks

Con la introducción de React Hooks, muchos casos de uso de HOC pueden resolverse de manera más elegante:

### HOC tradicional:
```javascript
const withCounter = (Component) => {
  return function WithCounterComponent(props) {
    const [count, setCount] = useState(0);
    return <Component {...props} count={count} setCount={setCount} />;
  };
};
```

### Hook equivalente:
```javascript
const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);
  return { count, setCount };
};
```

## Cuándo usar HOC

- **Usa HOC cuando**: Necesitas reutilizar lógica que involucra el ciclo de vida del componente o cuando trabajas con librerías que no tienen soporte para hooks
- **Usa Hooks cuando**: La lógica puede encapsularse en funciones stateful reutilizables y quieres un código más limpio y fácil de testear

## Conclusión

Los Higher-Order Components son una herramienta poderosa para la reutilización de código en React. Aunque los React Hooks han reducido algunos casos de uso, los HOC siguen siendo útiles para ciertos patrones, especialmente cuando se trabaja con componentes de clase o se necesita envolver componentes con lógica compleja de renderizado condicional.

La clave está en entender cuándo usar cada patrón y cómo implementarlos correctamente para mantener un código limpio, reutilizable y fácil de mantener.