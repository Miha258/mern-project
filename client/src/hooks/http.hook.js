import { useCallback, useEffect, useState } from "react"

export const useHttp = () => {
    const [error, setError] = useState(null)
    const [alert, setAlert] = useState(null)
    
    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        try {
            if (body) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }
            const response = await fetch('http://localhost:8080' + url, {method, body, headers})
            const data = await response.json()
            if (data.errors){
                setError(data.errors[0].msg)
            } else {
                setAlert(data.message)
            }
            return data
        } catch (err) {
            setError(err)
            console.log(err) 
        }
        
    }, [setError])
    
    const clear = useCallback(() => {
        setAlert(null)
        setError(null)
    }, [setAlert, setError])

    useEffect(() => {
        if (error){
            window.M.toast({html: error})
            clear()
        }
        if (alert){
            window.M.toast({html: alert})
            clear()
        }
    }, [alert, error, clear])

    return { request, setError, setAlert }
}