import { useContext } from "react"
import { AuthContext } from "../context"
import Navbar from "../components/Navbar"
import { Link, Navigate } from "react-router-dom"


export const MainPage = () => {
    let { isManager, isAuth } = useContext(AuthContext)

    if (isAuth && isManager){
        return <Navigate to="/manager"/>
    } else if (isAuth && !isManager){
        return <Navigate to="/user"/>
    }
    return (
        <>  
            <Navbar/>
            <div className="center-align">
                <h1>Choose page</h1>
                <Link style={{margin: "20px"}} className="waves-effect blue-grey darken-1 btn" to="user">User page</Link> 
                <Link style={{margin: "20px"}} className="waves-effect blue-grey darken-1 btn" to="manager">Manager page</Link>
            </div>
        </>
    )
}