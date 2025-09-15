# 🚀 Crear una App React con Vite

## ¿Qué es Vite?

Vite es una herramienta de construcción moderna que proporciona un entorno de desarrollo extremadamente rápido para proyectos de frontend. Es mucho más rápido que Create React App gracias a su uso de ES modules nativos.

---

## 📋 Requisitos Previos

- **Node.js** versión 18+ o 20+
- **npm**, **yarn**, **pnpm** o **bun** instalado

---

## 🛠️ Instalación y Configuración

### Paso 1: Crear el proyecto

```bash
# Con npm
npm create vite@latest my-react-app -- --template react

# Con yarn
yarn create vite my-react-app --template react

# Con pnpm
pnpm create vite my-react-app --template react

# Con bun
bun create vite my-react-app --template react
```

### Paso 2: Navegar al directorio del proyecto

```bash
cd my-react-app
```

### Paso 3: Instalar dependencias

```bash
# Con npm
npm install

# Con yarn
yarn

# Con pnpm
pnpm install

# Con bun
bun install
```

### Paso 4: Ejecutar el servidor de desarrollo

```bash
# Con npm
npm run dev

# Con yarn
yarn dev

# Con pnpm
pnpm dev

# Con bun
bun dev
```

---

## 🗂️ Estructura del Proyecto

```
my-react-app/
├── public/
│   ├── vite.svg
│   └── index.html
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

---

## ⚙️ Configuración Avanzada

### Configurar TypeScript (Opcional)

Si prefieres TypeScript, puedes crear el proyecto con:

```bash
npm create vite@latest my-react-app -- --template react-ts
```

### Personalizar vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

---

## 📦 Scripts Disponibles

En el archivo `package.json` encontrarás estos scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  }
}
```

### Comandos útiles:

- **`npm run dev`** - Inicia el servidor de desarrollo
- **`npm run build`** - Construye la aplicación para producción
- **`npm run preview`** - Preview de la build de producción
- **`npm run lint`** - Ejecuta ESLint para verificar el código

---

## 🔥 Ventajas de Vite vs Create React App

| Característica | Vite | Create React App |
|----------------|------|------------------|
| **Velocidad de inicio** | ⚡ Muy rápido | 🐌 Lento |
| **Hot Module Replacement** | ⚡ Instantáneo | 🔄 Lento |
| **Bundle size** | 📦 Más pequeño | 📦 Más grande |
| **Configuración** | 🔧 Flexible | 🔒 Menos flexible |
| **Build tool** | Rollup | Webpack |

---

## 🎯 Próximos Pasos

1. **Explorar la estructura** - Familiarízate con los archivos generados
2. **Modificar App.jsx** - Comienza a crear tu aplicación
3. **Instalar dependencias** - Agrega las librerías que necesites
4. **Configurar routing** - Instala React Router si lo necesitas
5. **Agregar estilos** - Configura CSS, Sass, o styled-components

---

## 💡 Consejos Adicionales

- **Hot Reload**: Los cambios se reflejan instantáneamente sin perder el estado
- **Import absolutos**: Puedes configurar alias en `vite.config.js`
- **Optimización automática**: Vite optimiza automáticamente las dependencias
- **Soporte nativo**: ES6+ modules, TypeScript, CSS Modules, y más

---

