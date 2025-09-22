import { useState, useEffect } from "react";
export function useQuery(url) {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [data, setData] = useState([])

    useEffect(() => {
        setLoading(true)
        setError(null)
        
        fetch(url).then(response => {
            if (response.status >= 400) {
                throw ("Error en la carga de datos")
            }
            return response.json()
        })

        .then(data => setData([data]))

        .catch(err => setError(err))

        .finally(() => setLoading(false))


    }, [url])

    return {
        loading,
        error,
        data
    }
}