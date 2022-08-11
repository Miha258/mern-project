import { useState } from "react"
import { useHttp } from "../../hooks/http.hook"
import { useContext } from "react"
import { AuthContext } from "../../context"
import { Navigate } from "react-router-dom"
import { Link } from "react-router-dom"


export const ManagerLogin = () => {
    const { request, setError} = useHttp()
    const [ form, setForm ] = useState(
        {
            email: '', 
            password: ''
        }
    )
    const { isAuth, login } = useContext(AuthContext)

    
    const formChange = event => {
        const value = event.target.value
        form[event.target.id] = value
    }

    const loginHandler = async () => {
        try {
            if (Object.values(form).includes("")){
                setError("All fields must be filled")
                return
            }
            const data = await request('/api/auth/user-login', 'POST', {...form})
            login(data.userId, data.token, form.password)
        } catch (err) {
            console.log(err)
        }
    } 

    if (isAuth){
        return <Navigate to="/manager"/>
    }
    
    return (
        <>
            <div className="row">
                <div className="col s6 offset-s3">
                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text" style={{padding: '4rem'}} onChange={formChange}>
                            <span className="card-title">Login</span>
                            <div className="input-field" style={{marginTop: '50px'}}>
                                <input id="email" type="text"/>
                                <label htmlFor="email">Email</label>
                            </div> 
                            <div className="input-field" style={{marginTop: '50px'}}>
                                <input id="password" type="password"/>
                                <label htmlFor="password">Password</label>
                            </div> 
                        </div>
                        <div className="card-action center-align">
                            <Link to="/manager/register" style={{color: '#9e9e9e'}}>Create account</Link>
                            <button onClick={loginHandler} className="waves-effect waves-light btn text-center">Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}