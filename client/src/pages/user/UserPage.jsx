import Navbar from "../../components/Navbar"
import { Link, Outlet, useLocation } from "react-router-dom"
import { AuthContext } from "../../context"
import { useEffect, useCallback, useState } from "react"
import { useHttp } from "../../hooks/http.hook"
import { useContext } from "react"
import { useBalance } from "../../hooks/balance.hook"


export const UserPage = () => {
    const location = useLocation()
    let { isAuth, userId } = useContext(AuthContext)
    const { request } = useHttp()
    const { convertCurrency } = useBalance()
    const [ currensies, setCurrensies ] = useState({})
    
    const getAccountBalance = useCallback(async () => {   
        const data = await request(`/api/accounts/user-account/${userId}`, 'GET')
        setCurrensies({
            usd: "USD: " + data.data.balance.substring(4),
            ils: "ILS: " + await convertCurrency('ILS', 'USD', data.data.balance),
            lvc: "LVC: " + await convertCurrency('LVC', 'USD', data.data.balance)
        })
    }, [userId, request])

    useEffect(() => {
        if (userId) {
            getAccountBalance()
        }
    }, [getAccountBalance])

    return (
        <>  
            <Navbar/>
            {location.pathname === '/user' && 
            <div className="center-align">
                <h1>User page</h1>
                {isAuth ? 
                    <ul>
                        <h4>Balance:</h4>
                        <li><strong>{currensies.usd}</strong></li>
                        <li><strong>{currensies.ils}</strong></li>
                        <li><strong>{currensies.lvc}</strong></li>
                    </ul>
                : 
                <>
                    <Link className="waves-effect blue-grey darken-1 btn" to="login" style={{margin: "10px"}}>Login</Link>
                    <Link className="waves-effect blue-grey darken-1 btn" to="register" style={{margin: "10px"}}>Create account</Link>
                </>
                }
            </div>}
            <Outlet/>
        </>
    )
}