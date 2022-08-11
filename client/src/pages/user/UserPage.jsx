import Navbar from "../../components/Navbar"
import { Link, Navigate, Outlet, useLocation } from "react-router-dom"
import { AuthContext } from "../../context"
import { useContext } from "react"

export const UserPage = () => {
    const location = useLocation()
    let { isAuth } = useContext(AuthContext)

    return (
        <>  
            <Navbar/>
            {location.pathname === '/user' && 
            <div className="center-align">
                <h1>User page</h1>
                {isAuth ? 
                <Link className="waves-effect blue-grey darken-1 btn" to="account">My account</Link> 
                : 
                <Link className="waves-effect blue-grey darken-1 btn" to="register">Create account</Link>
                }
            </div>}
            <Outlet/>
        </>
    )
}