import { useState } from "react"
import { useHttp } from "../../hooks/http.hook"
import { useBalance } from "../../hooks/balance.hook"
import { useMail } from "../../hooks/mail.hook"
import { useContext } from "react"
import { AuthContext } from "../../context"
import { Navigate } from "react-router-dom"
import { Link } from "react-router-dom"
import CurrencyInput from 'react-currency-input'


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
            balance: 'USD 0.00'
        }
    )
    const { balance, currency, changeCurrency, convertCurrency} = useBalance()
    const { isAuth, login } = useContext(AuthContext)
    const { needOpenAccount } = useMail()
    
    const formChange = event => {
        event.preventDefault()
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

            if (currency !== 'USD'){
                const data = await convertCurrency('USD', 'ILS', form.balance)
                form.balance = currency + " " + data.result
            }

            await request('/api/auth/user-register', 'POST', form)
            let data = await request('/api/auth/user-login', 'POST', {...form})
            const isManager = false
            login(data.userId, data.token, form.password, isManager)
            
            const userId = data.userId
            data = await request('/api/accounts/all-managers')
            const managersEmails = data.data.filter(manager => manager.email)

            for (let email of managersEmails){
                await request('/api/mail/send-mail', 'POST', {
                    to: email, html: needOpenAccount(userId, form.name, form.surname)
                })
            }
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
                            <div className="input-field" style={{marginTop: '50px'}}>
                                <CurrencyInput id="balance" value={balance} prefix={currency + " "} thousandSeparator=""/>
                                <label htmlFor="balance">Balance</label>
                                <button onClick={changeCurrency} className="waves-effect waves-light btn-small" id="USD" style={{margin: '5px'}}>USD</button>
                                <button onClick={changeCurrency} className="waves-effect waves-light btn-small" id="ILS" style={{margin: '5px'}}>ILS</button>
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