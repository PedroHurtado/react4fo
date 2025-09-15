# 🎨 CSS Modules en Vite con React

## ¿Qué son los CSS Modules?

Los CSS Modules son una forma de escribir CSS que automáticamente hace que los nombres de las clases sean únicos y locales al componente, evitando conflictos de estilos globales.

---

## ✨ Configuración en Vite

**¡Buena noticia!** Vite tiene soporte nativo para CSS Modules sin configuración adicional.

---

## 📁 Estructura de Archivos

### Convención de nombres
Los archivos CSS Modules deben seguir esta convención:

```
Component.module.css    # Para CSS
Component.module.scss   # Para SCSS
Component.module.sass   # Para SASS
Component.module.less   # Para LESS
Component.module.styl   # Para Stylus
```

---

## 🚀 Ejemplo Práctico

### 1. Crear el archivo de estilos

**Button.module.css**
```css
.button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.primary {
  background-color: #28a745;
}

.primary:hover {
  background-color: #1e7e34;
}

.secondary {
  background-color: #6c757d;
}

.secondary:hover {
  background-color: #545b62;
}

.large {
  padding: 16px 32px;
  font-size: 18px;
}

.small {
  padding: 8px 16px;
  font-size: 14px;
}
```

### 2. Usar los estilos en el componente

**Button.jsx**
```jsx
import React from 'react';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  variant = 'button', 
  size = 'medium', 
  onClick 
}) => {
  // Combinar múltiples clases
  const buttonClasses = [
    styles.button,
    styles[variant],
    size !== 'medium' && styles[size]
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={buttonClasses}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
```

### 3. Usar el componente

**App.jsx**
```jsx
import React from 'react';
import Button from './components/Button';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.app}>
      <h1 className={styles.title}>CSS Modules en Vite</h1>
      
      <div className={styles.buttonGroup}>
        <Button variant="primary">Primario</Button>
        <Button variant="secondary" size="large">Secundario Grande</Button>
        <Button size="small">Botón Pequeño</Button>
      </div>
    </div>
  );
}

export default App;
```

**App.module.css**
```css
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.title {
  color: #333;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.buttonGroup {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
```

---

## 🔧 Técnicas Avanzadas

### 1. Composición de clases

```css
/* styles.module.css */
.base {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.primary {
  composes: base;
  background-color: #007bff;
  color: white;
}

.danger {
  composes: base;
  background-color: #dc3545;
  color: white;
}
```

### 2. Composición desde otros archivos

```css
/* buttons.module.css */
.button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
}

/* card.module.css */
.submitButton {
  composes: button from './buttons.module.css';
  background-color: #28a745;
  color: white;
}
```

### 3. Usar con condicionales

```jsx
import styles from './Component.module.css';
import clsx from 'clsx'; // npm install clsx

const Component = ({ isActive, isDisabled }) => {
  return (
    <div 
      className={clsx(
        styles.component,
        {
          [styles.active]: isActive,
          [styles.disabled]: isDisabled
        }
      )}
    >
      Contenido
    </div>
  );
};
```

### 4. Acceder a clases dinámicamente

```jsx
import styles from './Component.module.css';

const Component = ({ type }) => {
  return (
    <div className={styles[type]}>
      {/* type puede ser 'primary', 'secondary', etc. */}
    </div>
  );
};
```

---

## ⚙️ Configuración Personalizada (Opcional)

Si necesitas personalizar CSS Modules, puedes hacerlo en `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly', // kebab-case -> camelCase
      scopeBehaviour: 'local',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  }
});
```

---

## 🎯 Comparación: Create React App vs Vite

| Característica | Create React App | Vite |
|----------------|------------------|------|
| **Configuración** | Automática | Automática |
| **Convención** | `.module.css` | `.module.css` |
| **Soporte SCSS** | ✅ (con instalación) | ✅ Nativo |
| **Hot Reload** | ✅ | ✅ Más rápido |
| **Personalización** | Limitada (sin eject) | ✅ Flexible |

---

## 📦 Dependencias Útiles

```bash
# Para combinar clases condicionalmente
npm install clsx

# Para SCSS (opcional)
npm install -D sass

# Para PostCSS (opcional)
npm install -D postcss autoprefixer
```

---

## 💡 Mejores Prácticas

1. **Convención de nombres**: Usa nombres descriptivos para las clases
2. **Estructura**: Mantén un archivo CSS Module por componente
3. **Composición**: Usa `composes` para reutilizar estilos
4. **Organización**: Agrupa estilos relacionados
5. **Variables**: Usa CSS custom properties para valores reutilizables

```css
:root {
  --primary-color: #007bff;
  --border-radius: 8px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
}

.button {
  background-color: var(--primary-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-sm) var(--spacing-md);
}
```

---

