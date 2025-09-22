import React, { Suspense, useState } from 'react';
import { useFetch, clearFetchCache } from './useFetch';

// Error Boundary para capturar errores
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', border: '2px solid red', borderRadius: '8px', margin: '10px' }}>
          <h3>❌ Error en la carga de datos</h3>
          <p><strong>Error:</strong> {this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Componente que usa el hook
const UserProfile = ({ userId }) => {
  // El hook se disparará automáticamente cuando cambie userId
  const user = useFetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px' }}>
      <h3>👤 Perfil de Usuario</h3>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Ciudad:</strong> {user.address.city}</p>
      <p><strong>Teléfono:</strong> {user.phone}</p>
    </div>
  );
};

// Componente que simula un fetch que falla
const ErrorComponent = () => {
  const data = useFetch('https://jsonplaceholder.typicode.com/nonexistent');
  return <div>{JSON.stringify(data)}</div>;
};

// Componente principal
const App = () => {
  const [userId, setUserId] = useState(1);
  const [showError, setShowError] = useState(false);

  const handleRefresh = () => {
    clearFetchCache(); // Limpiar caché para refrescar datos
    setUserId(prev => prev); // Forzar re-render
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 Demo de useFetch con Suspense</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setUserId(1)}>Usuario 1</button>
        <button onClick={() => setUserId(2)} style={{ marginLeft: '10px' }}>Usuario 2</button>
        <button onClick={() => setUserId(3)} style={{ marginLeft: '10px' }}>Usuario 3</button>
        <button onClick={handleRefresh} style={{ marginLeft: '20px', backgroundColor: '#4CAF50', color: 'white' }}>
          🔄 Refrescar
        </button>
        <button 
          onClick={() => setShowError(!showError)} 
          style={{ marginLeft: '10px', backgroundColor: '#f44336', color: 'white' }}
        >
          {showError ? 'Ocultar Error' : 'Mostrar Error'}
        </button>
      </div>

      <ErrorBoundary>
        <Suspense fallback={
          <div style={{ 
            padding: '20px', 
            border: '2px dashed #007bff', 
            borderRadius: '8px', 
            textAlign: 'center',
            margin: '10px'
          }}>
            <div>🔄 Cargando datos...</div>
            <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
              Suspense está manejando el estado de loading
            </div>
          </div>
        }>
          <UserProfile userId={userId} />
        </Suspense>
      </ErrorBoundary>

      {showError && (
        <ErrorBoundary>
          <Suspense fallback={<div>Cargando componente con error...</div>}>
            <ErrorComponent />
          </Suspense>
        </ErrorBoundary>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>📋 Características del hook:</h3>
        <ul>
          <li>✅ Se integra perfectamente con Suspense</li>
          <li>✅ Los errores fluyen a Error Boundary</li>
          <li>✅ Se ejecuta automáticamente cuando cambia la URL</li>
          <li>✅ Usa fetch nativo</li>
          <li>✅ Incluye caché para evitar peticiones duplicadas</li>
          <li>✅ Maneja respuestas JSON y texto automáticamente</li>
          <li>✅ Función para limpiar caché y refrescar datos</li>
        </ul>
      </div>
    </div>
  );
};

export default App;