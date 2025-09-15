# 📚 Guía Completa de JavaScript Moderno

Esta guía cubre los conceptos fundamentales de JavaScript moderno, desde ES5 hasta las características más recientes del lenguaje.

---

## 📖 1. Referencias y Evolución de JavaScript

### 🔗 Enlaces de Referencia Oficiales

- **[Estructuras de Datos](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures)** - Tipos de datos primitivos y objetos
- **[Object Global](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object)** - Métodos y propiedades del objeto Object
- **[Function Global](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function)** - Funciones y sus métodos
- **[Herencia y Prototype Chain](https://developer.mozilla.org/es/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)** - Sistema de herencia basado en prototipos
- **[Classes ES6+](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Classes)** - Sintaxis moderna de clases
- **[ECMAScript Specification](https://github.com/tc39/ecma262)** - Especificación oficial del lenguaje

### ⏰ Línea Temporal de JavaScript

| Período | Características |
|---------|----------------|
| **Anterior a 2015** | ES5, sintaxis clásica con funciones constructoras |
| **2015 - Actualidad** | ES6+, clases modernas, arrow functions, async/await |

### 🔄 Evolución de Sintaxis de Clases

#### **Sintaxis Clásica (Pre-ES6)**

```javascript
// Constructor function
function Foo(name) {
    this.name = name;
}

// Método público
Foo.prototype.write = function() {
    this._write();
}

// Método "privado" (convención con _)
Foo.prototype._write = function() {
    console.log(this.name);
}

// Método estático
Foo.write = function() {
    console.log('static method');
}

// Uso
const foo = new Foo('pedro');
foo.write(); // 'pedro'
Foo.write(); // 'static method'
```

#### **Sintaxis Moderna (ES6+)**

```javascript
class Foo {
    constructor(name) {
        this.name = name;
    }
    
    // Método público
    write() {
        this.#write();
    }
    
    // Método privado (ES2022+)
    #write() {
        console.log(this.name);
    }
    
    // Método estático
    static write() {
        console.log('static method');
    }
}

// Uso idéntico
const foo = new Foo('pedro');
foo.write(); // 'pedro'
Foo.write(); // 'static method'
```

### 🛠️ Herramientas de Compatibilidad

#### **1. Transpiladores**
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado de JavaScript
- **[Babel](https://babeljs.io/)** - Convierte ES6+ a ES5 para compatibilidad

#### **2. Polyfills**
- **[Definición de Polyfill](https://developer.mozilla.org/es/docs/Glossary/Polyfill)** - Código que implementa funcionalidades no nativas


```javascript
// Ejemplo de polyfill para Array.includes()
if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement) {
        return this.indexOf(searchElement) !== -1;
    };
}
```

---

## 🎯 2. Contexto y Ámbito (this)

### 📍 Enlaces de Referencia

- **[Function.bind()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)**
- **[Function.call()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function/call)**
- **[Function.apply()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)**

### 🔍 Comportamiento del `this`

```javascript
var x = 10;

var foo = {
    x: 11,
    write: function() {
        console.log(this.x);
    }
};

foo.write(); // 11 - this apunta al objeto foo

// ⚠️ PROBLEMA: Pérdida de contexto
var write = foo.write;
write(); // 10 - this apunta al objeto global (window)

// ✅ SOLUCIÓN: bind()
var boundWrite = foo.write.bind(foo);
boundWrite(); // 11 - this está forzado a foo
```

### 🏗️ Pérdida de Contexto en Clases

```javascript
class Foo {
    constructor() {
        // ❌ Sin bind - se pierde el contexto
        new Bar(this.write);
        
        // ✅ Con bind - se preserva el contexto
        new Bar(this.write.bind(this));
    }
    
    write() {
        console.log(this);
    }
}

class Bar {
    constructor(writeCallback) {
        writeCallback(); // undefined sin bind, Foo con bind
        this.write = writeCallback;
        this.write(); // Bar (nuevo contexto)
    }
}
```

### 🔧 Métodos de Manipulación de Contexto

```javascript
function Foo(name, surname) {
    this.name = name;
    this.surname = surname;
}

var person = {};

// call() - argumentos separados
Foo.call(person, "Pedro", "Hurtado");
console.log(person); // { name: "Pedro", surname: "Hurtado" }

// apply() - argumentos en array
Foo.apply(person, ["Pedro", "Hurtado"]);

// bind() - crea nueva función con contexto fijo
var boundFoo = Foo.bind(person, "Pedro", "Hurtado");
boundFoo(); // Ejecuta con contexto person
```

### 🏭 Función Factory Pattern

```javascript
function factory(scope, strType, ...args) {
    const type = scope[strType];
    
    if (!type) {
        throw `El tipo ${strType} no existe`;
    }
    
    // Crear instancia usando Object.create
    const instance = Object.create(type.prototype);
    
    // Aplicar constructor con argumentos
    type.apply(instance, args);
    
    return instance;
}

// Funciones constructoras
function Foo(name) {
    this.name = name;
}

function Bar(name, surname) {
    this.name = name;
    this.surname = surname;
}

// Uso del factory
const fooInstance = factory(window, "Foo", "Pedro");
const barInstance = factory(window, "Bar", "Pedro", "Hurtado");
```

---

## ➡️ 3. Arrow Functions

### 📖 Referencia Oficial

- **[Arrow Functions MDN](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Functions/Arrow_functions)**

### 🔄 Comparación de Sintaxis

```javascript
// Función tradicional
function sum(a, b) {
    return a + b;
}

// Arrow function
const sum = (a, b) => a + b;

// Con un parámetro (paréntesis opcionales)
const double = x => x * 2;

// Sin parámetros
const greet = () => "¡Hola!";

// Cuerpo de función complejo
const processData = (data) => {
    const processed = data.filter(x => x > 0);
    return processed.map(x => x * 2);
};
```

### 🎯 Diferencias Clave con Funciones Tradicionales

#### **1. Contexto Léxico (this)**

```javascript
// Función tradicional - this dinámico
document.addEventListener('click', function(ev) {
    console.log(this); // HTMLDocument
});

// Arrow function - this léxico (heredado del contexto padre)
document.addEventListener('click', (ev) => {
    console.log(this); // Window (o el contexto donde se definió)
});
```

#### **2. Solución a Problemas de Contexto en Clases**

```javascript
class Foo {
    constructor() {
        this.name = "Foo";
        
        // ❌ Función tradicional - pierde contexto
        new Bar(function() {
            console.log(this.name); // undefined
        });
        
        // ✅ Arrow function - mantiene contexto
        new Bar(() => {
            console.log(this.name); // "Foo"
        });
    }
}

class Bar {
    constructor(callback) {
        callback();
    }
}
```

#### **3. Limitaciones de Arrow Functions**

```javascript
// ❌ No tienen su propio 'arguments'
const func1 = function() {
    console.log(arguments); // Funciona
};

const func2 = () => {
    console.log(arguments); // Error
};

// ✅ Usar rest parameters en su lugar
const func3 = (...args) => {
    console.log(args); // Funciona
};

// ❌ No pueden ser constructores
const Person = (name) => {
    this.name = name;
};
// new Person("Juan"); // Error

// ❌ No tienen prototype
console.log(func1.prototype); // {}
console.log(func2.prototype); // undefined
```

---

## 🧬 4. Mixins y Herencia

### 🏗️ Patrón Mixin Tradicional

```javascript
// Sintaxis estándar (anidamiento complejo)
class Foo { }
class Bar extends calculatorMixin(randomizerMixin(Foo)) { }

// Ejemplo complejo
class Customer extends Add(Update(Delete(Get(class {})))) {}
```

### ✨ Implementación Mejorada de Mixins

```javascript
class Mixins {
    #base;
    
    constructor(Base) {
        this.#base = Base;
    }
    
    withMixin(...mixins) {
        // Usar reduceRight para aplicar mixins de derecha a izquierda
        return mixins.reduceRight((accumulator, mixin) => {
            return mixin(accumulator);
        }, this.#base);
    }
}

// Función helper para sintaxis más limpia
function inherit(Base) {
    return new Mixins(Base);
}

// Ejemplo de uso
const add = (Base) => class extends Base {
    add(a, b) { return a + b; }
};

const update = (Base) => class extends Base {
    update(id, data) { /* lógica de actualización */ }
};

const delete_ = (Base) => class extends Base {
    delete(id) { /* lógica de eliminación */ }
};

const get = (Base) => class extends Base {
    get(id) { /* lógica de obtención */ }
};

// Sintaxis mejorada
class Customer extends inherit(class {}).withMixin(add, update, delete_, get) {}
class User extends inherit(class {}).withMixin(get) {}
```

### 📊 Funcionamiento de reduceRight

```javascript
// Ejemplo conceptual de reduce vs reduceRight
const numbers = [1, 2, 3];

// reduce: de izquierda a derecha
numbers.reduce((a, b) => a + b, 100);
// 100 + 1 = 101
// 101 + 2 = 103  
// 103 + 3 = 106

// reduceRight: de derecha a izquierda
numbers.reduceRight((a, b) => a + b, 100);
// 100 + 3 = 103
// 103 + 2 = 105
// 105 + 1 = 106
```

---

## 🗃️ 5. Métodos de Arrays

### 📖 Referencias MDN

- **[Array.map()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/map)**
- **[Array.reduce()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)**
- **[Array.filter()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)**
- **[Array.find()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/find)**

### 🔄 Métodos Fundamentales

```javascript
const numbers = [1, 2, 3, 4, 5];

// map() - transforma cada elemento
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter() - filtra elementos por condición
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens); // [2, 4]

// find() - encuentra el primer elemento que cumple condición
const firstEven = numbers.find(n => n % 2 === 0);
console.log(firstEven); // 2

// reduce() - reduce array a un solo valor
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // 15

// Encadenamiento de métodos
const result = numbers
    .filter(n => n % 2 === 0)  // [2, 4]
    .map(n => n * n);          // [4, 16]
console.log(result); // [4, 16]
```

### 📈 Ejemplos Avanzados

```javascript
// Ejemplo práctico con objetos
const users = [
    { id: 1, name: 'Ana', age: 25, active: true },
    { id: 2, name: 'Luis', age: 30, active: false },
    { id: 3, name: 'María', age: 22, active: true }
];

// Obtener nombres de usuarios activos
const activeNames = users
    .filter(user => user.active)
    .map(user => user.name);
console.log(activeNames); // ['Ana', 'María']

// Calcular edad promedio
const averageAge = users.reduce((sum, user) => sum + user.age, 0) / users.length;
console.log(averageAge); // 25.67

// Agrupar por estado
const groupedByStatus = users.reduce((groups, user) => {
    const key = user.active ? 'active' : 'inactive';
    groups[key] = groups[key] || [];
    groups[key].push(user);
    return groups;
}, {});
```

### 🗂️ Nuevas Estructuras de Datos

```javascript
// Map - clave-valor con cualquier tipo de clave
const map = new Map();
map.set('string', 'valor1');
map.set(1, 'valor2');
map.set(true, 'valor3');

console.log(map.get('string')); // 'valor1'
console.log(map.size); // 3

// Set - colección de valores únicos
const set = new Set([1, 2, 2, 3, 3, 3]);
console.log(set); // Set {1, 2, 3}
console.log(set.has(2)); // true
console.log(set.size); // 3
```

### 🔧 Polyfills con Core-js

Para compatibilidad con navegadores antiguos:

```bash
npm install core-js
```

```javascript
import 'core-js/stable';
import 'core-js/features/array/flat-map';
```

---

## 🔓 6. Destructuring, Rest y Spread

### 📖 Referencias MDN

- **[Rest Parameters](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Functions/rest_parameters)**
- **[Destructuring Assignment](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)**
- **[Spread Syntax](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Spread_syntax)**
- **[Destructuring Nested Objects](https://medium.com/@pyrolistical/destructuring-nested-objects-9dabdd01a3b8)**

### 🎯 1. Rest Parameters

```javascript
// Sintaxis antigua con arguments
function oldSum() {
    console.log(arguments); // No es un array real
    return Array.from(arguments).reduce((a, b) => a + b);
}

// Sintaxis moderna con rest parameters
function sum(...args) {
    console.log(args); // Array real
    return args.reduce((a, b) => a + b);
}

console.log(sum(1, 2, 3, 4, 5)); // 15

// Rest en destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first);  // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5]
```

### 🎯 2. Destructuring de Objetos

```javascript
// Objeto ejemplo
const user = {
    id: 1,
    name: 'Pedro',
    phone: 616647015,
    address: {
        street: 'Calle Mayor',
        city: 'Madrid',
        country: 'España'
    }
};

// Destructuring básico
const { id, name } = user;
console.log(id, name); // 1 'Pedro'

// Con renombrado
const { name: userName, phone: userPhone } = user;
console.log(userName, userPhone); // 'Pedro' 616647015

// Con valores por defecto
const { email = 'no-email@example.com' } = user;
console.log(email); // 'no-email@example.com'

// Destructuring anidado
const { address: { city, country } } = user;
console.log(city, country); // 'Madrid' 'España'

// Rest en objetos
const { id, name, ...restData } = user;
console.log(restData); // { phone: 616647015, address: {...} }
```

### 🎯 3. Destructuring en Parámetros de Función

```javascript
// Función que recibe objeto
function displayUser({ name, id, email = 'Sin email' }) {
    console.log(`ID: ${id}`);
    console.log(`Nombre: ${name}`);
    console.log(`Email: ${email}`);
}

displayUser(user);
// ID: 1
// Nombre: Pedro  
// Email: Sin email

// Con destructuring anidado en parámetros
function displayAddress({ address: { street, city, country } }) {
    console.log(`Dirección: ${street}, ${city}, ${country}`);
}

displayAddress(user);
// Dirección: Calle Mayor, Madrid, España
```

### 🎯 4. Destructuring de Arrays

```javascript
const numbers = [1, 2, 3, 4, 5, 6];

// Destructuring básico
const [first, second] = numbers;
console.log(first, second); // 1 2

// Saltarse elementos
const [a, , c] = numbers;
console.log(a, c); // 1 3

// Con rest
const [head, ...tail] = numbers;
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5, 6]

// Intercambio de variables
let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y); // 2 1
```

### 🎯 5. Spread Operator

```javascript
// Arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Concatenar arrays
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// Clonar array
const cloned = [...arr1];
console.log(cloned); // [1, 2, 3]

// Objetos
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

// Combinar objetos
const combinedObj = { ...obj1, ...obj2 };
console.log(combinedObj); // { a: 1, b: 2, c: 3, d: 4 }

// Clonar y modificar
const modified = { ...obj1, b: 20, e: 5 };
console.log(modified); // { a: 1, b: 20, e: 5 }

// En llamadas a funciones
function multiply(a, b, c) {
    return a * b * c;
}

const nums = [2, 3, 4];
console.log(multiply(...nums)); // 24
```

### 🗺️ Trabajando con Map

```javascript
// Crear Map con destructuring
const map = new Map();
map.set('key1', 1);
map.set('key2', 2);

// Iterar con destructuring
for (const [key, value] of map) {
    console.log(`${key}: ${value}`);
}

// Convertir Map a array de arrays
const mapArray = [...map];
console.log(mapArray); // [['key1', 1], ['key2', 2]]
```

---

## ✅❌ 7. Valores Falsy y Truthy

### 🔍 Valores Falsy en JavaScript

En JavaScript, estos valores se evalúan como `false`:

```javascript
// Los 6 valores falsy
console.log(Boolean(false));     // false
console.log(Boolean(0));         // false
console.log(Boolean(-0));        // false
console.log(Boolean(''));        // false
console.log(Boolean(null));      // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN));       // false
```

### ✅ Valores Truthy

Cualquier valor que NO sea falsy es truthy:

```javascript
// Ejemplos de valores truthy
console.log(Boolean(1));           // true
console.log(Boolean(-1));          // true
console.log(Boolean('hello'));     // true
console.log(Boolean(' '));         // true (string con espacio)
console.log(Boolean([]));          // true (array vacío)
console.log(Boolean({}));          // true (objeto vacío)
console.log(Boolean(function(){})); // true (función)
```

### 🔄 Operadores de Negación

```javascript
// Negación simple (!)
console.log(!0);         // true
console.log(!'');        // true
console.log(!null);      // true
console.log(!undefined); // true
console.log(!false);     // true

// Doble negación (!!) - convierte a boolean
console.log(!!1);        // true
console.log(!!'hello');  // true
console.log(!!0);        // false
console.log(!!'');       // false
```

### ⚖️ Comparaciones y Coerción

```javascript
// Comparación con coerción (==)
console.log(1 == '1');        // true (coerción de tipos)
console.log(0 == false);      // true
console.log('' == false);     // true
console.log(null == undefined); // true

// Comparación estricta (===)
console.log(1 === '1');       // false (sin coerción)
console.log(0 === false);     // false
console.log('' === false);    // false
console.log(null === undefined); // false

// Comparación de desigualdad
console.log(1 !== '1');       // true (diferentes tipos)
console.log(1 != '1');        // false (con coerción son iguales)
```

### 🎯 Casos Prácticos

```javascript
// Validación de existencia
function processUser(user) {
    if (user) {  // user debe ser truthy
        console.log(`Procesando: ${user.name}`);
    } else {
        console.log('Usuario no válido');
    }
}

// Valores por defecto con OR
function greet(name) {
    name = name || 'Anónimo';  // Si name es falsy, usar 'Anónimo'
    console.log(`Hola, ${name}!`);
}

// Nullish coalescing operator (??) - ES2020
function greetModern(name) {
    name = name ?? 'Anónimo';  // Solo si name es null o undefined
    console.log(`Hola, ${name}!`);
}

greet('');        // "Hola, Anónimo!" (string vacío es falsy)
greetModern('');  // "Hola, !" (string vacío no es nullish)

// Optional chaining (?.) - ES2020
const user = { profile: { name: 'Juan' } };
console.log(user?.profile?.name);     // 'Juan'
console.log(user?.settings?.theme);  // undefined (no error)
```

### 🔍 Tabla de Comparaciones Útiles

| Expresión | Resultado | Explicación |
|-----------|-----------|-------------|
| `0 == false` | `true` | Ambos son falsy |
| `0 === false` | `false` | Tipos diferentes |
| `'' == 0` | `true` | Coerción a número |
| `'' === 0` | `false` | Tipos diferentes |
| `null == undefined` | `true` | Casos especiales |
| `null === undefined` | `false` | Tipos diferentes |
| `[] == false` | `true` | Array vacío se convierte a '' |
| `[] === false` | `false` | Tipos diferentes |

---

## 🎉 Conclusión

Esta guía cubre los aspectos fundamentales de JavaScript moderno que todo desarrollador debe conocer. Desde la evolución de las clases hasta los métodos de arrays y la manipulación del contexto, estos conceptos forman la base para el desarrollo con React y otras tecnologías modernas.

## Referencias
- **[JavaScript Info](https://javascript.info)**
