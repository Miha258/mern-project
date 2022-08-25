import { useState } from "react"
import { useHttp } from "../../hooks/http.hook"
import { useContext } from "react"
import { AuthContext } from "../../context"
import { Navigate } from "react-router-dom"
import { Link } from "react-router-dom"


export const ManagerRegister = () => {
    const { request, setError } = useHttp()
    const [ form, setForm ] = useState(
        {
            surname: '', 
            name: '', 
            email: '', 
            password: '',
        }
    )
    const { isAuth, login, isManager} = useContext(AuthContext)
    
    const formChange = event => {
        let value = event.target.value
        form[event.target.id] = value
        event.target.value = value
    }
    
    const registerHandler = async () => {
        try {
            if (Object.values(form).includes("")){
                setError("All fields must be filled")
                return
            }
            await request('/api/auth/manager-register', 'POST', form)
            const data = await request('/api/auth/manager-login', 'POST', {...form})
            const isManager = true
            login(data.userId, data.token, form.password, isManager)
        } catch (err) {
            console.log(err)
        }
    } 
    
    if (isAuth && isManager){
        return <Navigate to="/manager"/>
    } else if (isAuth && !isManager) {
        return <Navigate to="/user"/>
    }

    return (
        <>
            <div className="row">
                <div className="col s6 offset-s3">
                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text" style={{padding: '4rem'}} onChange={formChange}>
                            <span className="card-title">Create account</span>
                            <div className="input-field" style={{marginTop: '50px'}}>
                                <input id="surname" type="text"/>
                                <label htmlFor="surname">Surname</label>
                            </div> 
                            <div className="input-field" style={{marginTop: '50px'}}>
                                <input id="name" type="text"/>
                                <label htmlFor="name">Name</label>
                            </div> 
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
                            <Link to="/manager/login" style={{color: '#9e9e9e'}}>I have account</Link>
                            <button onClick={registerHandler} className="waves-effect waves-light btn">Create account</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}