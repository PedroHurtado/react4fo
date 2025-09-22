import { useEffect, useRef } from 'react';

/**
 * Cache global para evitar peticiones duplicadas
 * Estructura: { url: { status: 'pending' | 'resolved' | 'rejected', promise: Promise, data?: any, error?: Error } }
 */
const fetchCache = new Map();

/**
 * Custom hook que se integra con Suspense y Error Boundaries
 * @param {string} url - URL para hacer el fetch
 * @param {RequestInit} options - Opciones del fetch (opcional)
 * @returns {any} - Los datos de la respuesta
 */
export const useFetch = (url, options = {}) => {
  const optionsRef = useRef(options);
  
  // Actualizamos las opciones solo si han cambiado
  useEffect(() => {
    optionsRef.current = options;
  }, [JSON.stringify(options)]);

  // Efecto que se ejecuta cuando cambia la URL
  useEffect(() => {
    if (!url) return;

    const cacheKey = `${url}-${JSON.stringify(optionsRef.current)}`;
    
    // Si ya existe en caché y está pendiente o resuelta, no hacemos nada
    if (fetchCache.has(cacheKey)) {
      const cached = fetchCache.get(cacheKey);
      if (cached.status === 'pending' || cached.status === 'resolved') {
        return;
      }
    }

    // Creamos la promesa del fetch
    const fetchPromise = fetch(url, optionsRef.current)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }
        
        // Actualizamos el caché con los datos
        fetchCache.set(cacheKey, {
          status: 'resolved',
          promise: fetchPromise,
          data
        });
        
        return data;
      })
      .catch((error) => {
        // Actualizamos el caché con el error
        fetchCache.set(cacheKey, {
          status: 'rejected',
          promise: fetchPromise,
          error
        });
        
        throw error;
      });

    // Guardamos la promesa en caché como pendiente
    fetchCache.set(cacheKey, {
      status: 'pending',
      promise: fetchPromise
    });

  }, [url]);

  // Lógica principal del hook
  if (!url) {
    return null;
  }

  const cacheKey = `${url}-${JSON.stringify(optionsRef.current)}`;
  const cached = fetchCache.get(cacheKey);

  if (!cached) {
    // No hay caché, iniciamos el fetch
    const fetchPromise = fetch(url, optionsRef.current)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }
        
        fetchCache.set(cacheKey, {
          status: 'resolved',
          promise: fetchPromise,
          data
        });
        
        return data;
      })
      .catch((error) => {
        fetchCache.set(cacheKey, {
          status: 'rejected',
          promise: fetchPromise,
          error
        });
        
        throw error;
      });

    fetchCache.set(cacheKey, {
      status: 'pending',
      promise: fetchPromise
    });

    // Lanzamos la promesa para que Suspense la capture
    throw fetchPromise;
  }

  // Manejamos los diferentes estados del caché
  switch (cached.status) {
    case 'pending':
      // Lanzamos la promesa para que Suspense muestre el fallback
      throw cached.promise;
    
    case 'resolved':
      // Retornamos los datos
      return cached.data;
    
    case 'rejected':
      // Lanzamos el error para que Error Boundary lo capture
      throw cached.error;
    
    default:
      throw new Error('Estado de caché desconocido');
  }
};

/**
 * Hook adicional para obtener el estado de loading (opcional)
 * Útil si necesitas mostrar un spinner fuera de Suspense
 */
export const useFetchStatus = (url, options = {}) => {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  const cached = fetchCache.get(cacheKey);
  
  return {
    isLoading: cached?.status === 'pending' || !cached,
    isError: cached?.status === 'rejected',
    isSuccess: cached?.status === 'resolved'
  };
};

/**
 * Función para limpiar el caché (útil para refrescar datos)
 */
export const clearFetchCache = (url, options = {}) => {
  if (url) {
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    fetchCache.delete(cacheKey);
  } else {
    // Limpiar todo el caché
    fetchCache.clear();
  }
};