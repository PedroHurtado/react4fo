# React Router - Hooks y Redirects

## Hooks Principales

### `useNavigate()`
Hook para navegación programática. Reemplaza al antiguo `useHistory`.

```jsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  // Navegar a una ruta
  const goToProfile = () => navigate('/profile');
  
  // Navegar con reemplazo en historial
  const goToHome = () => navigate('/', { replace: true });
  
  // Navegar hacia atrás
  const goBack = () => navigate(-1);
  
  // Navegar con estado
  const goWithState = () => navigate('/dashboard', { 
    state: { from: 'login' } 
  });
}
```

### `useLocation()`
Obtiene información sobre la ubicación actual.

```jsx
import { useLocation } from 'react-router-dom';

function MyComponent() {
  const location = useLocation();
  
  console.log(location.pathname);  // "/users/123"
  console.log(location.search);    // "?tab=profile"
  console.log(location.hash);      // "#section1"
  console.log(location.state);     // Estado pasado en navigate()
}
```

### `useParams()`
Accede a los parámetros dinámicos de la URL.

```jsx
import { useParams } from 'react-router-dom';

// Ruta definida como: /users/:userId/posts/:postId
function UserPost() {
  const { userId, postId } = useParams();
  
  return (
    <div>
      <h1>Usuario: {userId}</h1>
      <p>Post: {postId}</p>
    </div>
  );
}
```

### `useSearchParams()`
Maneja los query parameters de la URL.

```jsx
import { useSearchParams } from 'react-router-dom';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get('q');
  const page = searchParams.get('page') || 1;
  
  const updateSearch = (newQuery) => {
    setSearchParams({ q: newQuery, page: 1 });
  };
  
  return (
    <div>
      <input 
        value={query || ''} 
        onChange={(e) => updateSearch(e.target.value)}
      />
      <p>Página: {page}</p>
    </div>
  );
}
```

### `useOutletContext()`
Comparte datos entre rutas padre e hijas.

```jsx
// Componente padre
function Layout() {
  const [user, setUser] = useState(null);
  
  return (
    <div>
      <Header />
      <Outlet context={{ user, setUser }} />
    </div>
  );
}

// Componente hijo
function Profile() {
  const { user } = useOutletContext();
  
  return <div>Hola, {user?.name}</div>;
}
```

## Redirects

### 1. Redirect Declarativo con `<Navigate>`

Útil para redirects condicionales en el render.

```jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function Dashboard() {
  const user = useUser();
  
  // Redirect si el usuario no tiene permisos
  if (!user.hasPermission) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <div>Dashboard content</div>;
}
```

### 2. Redirect Programático con `useNavigate()`

Ideal para redirects en respuesta a eventos o efectos.

```jsx
import { useNavigate, useEffect } from 'react';

function LoginForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await login(formData);
      navigate('/dashboard'); // Redirect después del login exitoso
    } catch (error) {
      // Manejar error
    }
    setIsLoading(false);
  };
  
  // Redirect si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### 3. Redirect en Loader (React Router v6.4+)

```jsx
import { redirect } from 'react-router-dom';

// Loader function
export async function protectedLoader() {
  const user = await getUser();
  if (!user) {
    throw redirect('/login');
  }
  return user;
}

// En la definición de rutas
const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <Dashboard />,
    loader: protectedLoader,
  },
]);
```

## Patrones Comunes

### Redirect después de una acción
```jsx
function CreatePost() {
  const navigate = useNavigate();
  
  const handleCreate = async (postData) => {
    const newPost = await createPost(postData);
    navigate(`/posts/${newPost.id}`);
  };
}
```

### Redirect condicional basado en estado
```jsx
function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = useUser();
  
  useEffect(() => {
    // Solo el usuario puede ver su propio perfil
    if (user && user.id !== parseInt(userId)) {
      navigate('/unauthorized');
    }
  }, [user, userId, navigate]);
}
```

### Preservar la ruta original para redirect post-login
```jsx
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from || '/dashboard';
  
  const handleLogin = async () => {
    await login();
    navigate(from, { replace: true });
  };
}

// En el componente que protege rutas
function ProtectedRoute({ children }) {
  const location = useLocation();
  
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }
  
  return children;
}
```

## Consejos

- Usa `replace: true` para redirects que no deberían aparecer en el historial del navegador
- `<Navigate>` es mejor para redirects condicionales en el render
- `useNavigate()` es mejor para redirects en response a eventos o efectos
- Siempre maneja los casos de carga y error en redirects programáticos
- Considera usar loaders para redirects basados en datos del servidor