import { useState, useCallback, useEffect, useRef} from "react"

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [password, setPassword] = useState(null)
    const [isManager, setIsManager] = useState(null)

    const login = useCallback((id, token, password, isManager) => {
        localStorage.setItem('userData', JSON.stringify({
            userId: id, 
            token,
            password,
            isManager
        }))
        setToken(token)
        setPassword(password)
        setIsManager(isManager)
        setUserId(id)
    }, [setToken, setUserId, setPassword, setIsManager])

    const logout = useCallback(() => {
        localStorage.removeItem('userData')
        setUserId(null)
        setToken(null)
        setPassword(null)
        setIsManager(null)
    }, [setUserId, setToken])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('userData'))
        if (data && data.token && data.userId){
            login(data.userId, data.token, data.password, data.isManager)
        }
    }, [login])
    return { token, userId, password, login, logout, isManager}
}
