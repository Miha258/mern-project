import { useState } from "react"
import { useHttp } from "../../hooks/http.hook"
import { useEffect } from "react"
import { useBalance } from "../../hooks/balance.hook"
import { useContext } from "react"
import { AuthContext } from "../../context"
import { Navigate } from "react-router-dom"
import { Link } from "react-router-dom"

export const RegisterUserAccount = () => {
    const { request, setError } = useHttp()
    const [ form, setForm ] = useState(
        {
            surname: '', 
            name: '', 
            email: '', 
            password: '',
            dateOfBirth: '', 
            addres: '',
            balance: '0,00 USD'
        }
    )
    const { balance, changeBalance, currency, changeCurrency } = useBalance()
    const { isAuth, login } = useContext(AuthContext)
        
    const formChange = event => {
        let value = event.target.value
        if (event.target.id === "balance"){
            changeBalance(value)
            value = balance + " " + currency
        }
        form[event.target.id] = value
        event.target.value = value
    }

    useEffect(() => {
        const balanceInput = document.getElementById('balance')
        balanceInput.value = form.balance
    }, [form])
    
    const registerHandler = async () => {
        try {
            if (Object.values(form).includes("")){
                setError("All fields must be filled")
                return
            }
            const currency = document.getElementById("USD").checked ? 'USD' : 'ILS'
            form.balance = balance + ' ' + currency
            await request('/api/auth/user-register', 'POST', form)
            const data = await request('/api/auth/user-login', 'POST', {...form})
            login(data.userId, data.token, form.password)
        } catch (err) {
            console.log(err)
        }
    } 

    if (isAuth){
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
                            <div className="input-field" style={{marginTop: '50px'}}>
                                <input id="dateOfBirth" type='date'/>
                                <label htmlFor="dateOfBirth">Date of birth</label>
                            </div> 
                            <div className="input-field" style={{marginTop: '50px'}}>
                                <input id="addres" type="text"/>
                                <label htmlFor="addres">Addres</label>
                            </div> 
                            <div className="input-field" style={{marginTop: '50px'}} onChange={changeCurrency}>
                                <input className="white-text" id="balance" type="text"/>
                                <label htmlFor="balance">Balance</label>
                                <p>
                                    <label>
                                        <input id="USD" className="with-gap" name="group3" type="radio" defaultChecked/>
                                        <span>USD</span>
                                    </label>
                                </p>
                                <p>
                                    <label>
                                        <input id="ILS" className="with-gap" name="group3" type="radio"/>
                                        <span>ILS</span>
                                    </label>
                                </p>
                            </div>
                        </div>
                        <div className="card-action center-align">
                            <Link to="/user/login" style={{color: '#9e9e9e'}}>I have account</Link>
                            <button onClick={registerHandler} className="waves-effect waves-light btn">Create account</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}