import { Link, useLocation, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context"


const Navbar = () => {
    const { isAuth, logout } = useContext(AuthContext)
    const location = useLocation()
    const navigate = useNavigate()
    const logoutHandler = event => {
        event.preventDefault()
        logout()
        navigate('/user', {replace: true})
    }
    const getNavItems = (pathname) => {
        if (pathname.includes("/user") && !location.pathname.includes("/manager")){
            return <ul id="nav-mobile" className="left hide-on-med-and-down" style={{marginLeft: '20px'}}>
                <li><Link to="/user">Main page</Link></li>
                <li><Link to={isAuth ? "account" : "login"}>My account</Link></li>    
                {isAuth && <li><Link to="transfers">Transfers</Link></li>}
                {isAuth && <li onClick={logoutHandler}><Link to="logout">Logout</Link></li>}
            </ul>
        } else if (pathname.includes("/manager")){
            return <ul id="nav-mobile" className="left hide-on-med-and-down" style={{marginLeft: '20px'}}>
                {isAuth && <li><Link to="user-accounts">User requests</Link></li>}
            </ul>
        }
    }
    return (
        <>
            <nav style={{marginBottom: '40px'}}>
                <div className="nav-wrapper" style={{backgroundColor: '#26a69a'}}>
                    {getNavItems(location.pathname)}
                </div>
            </nav>
        </>
    );
}


export default Navbar