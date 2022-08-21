import { AuthContext } from "../../context"
import { useContext } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { useHttp } from "../../hooks/http.hook"
import { Navigate, useNavigate } from "react-router-dom"
import { useCallback } from "react"
import { useBalance } from "../../hooks/balance.hook"
import CurrencyInput from 'react-currency-input'


export const UserAccount = () => {
    const { isAuth, password, userId } = useContext(AuthContext)
    const [ form, setForm ] = useState({})
    const { request, setError } = useHttp()
    const { changeCurrency, currency, balance, setBalance } = useBalance()
    const [ isOpened, setOpened ] = useState(true)
    const navigate = useNavigate()

    const getAccountData = useCallback(async () => { 
        const data = await request(`/api/accounts/user-account/${userId}`, 'GET')
        setForm(data.data)
        return data.data
    }, [userId, request])
 
    const padTo2Digits = useCallback(num => num.toString().padStart(2, '0'), [])
    const formatDate = useCallback((date = new Date()) => {
        return [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-')
    }, [padTo2Digits])
    
    const formChange = event => {
        const button = document.getElementById('changebtn')
        if (event.target.value !== form[event.target.id]){
            button.classList.remove('disabled')
        } else {
            button.classList.add('disabled')
        }
    }

    const changePassword = (newPassword) => {
        const data = JSON.parse(localStorage.getItem('userData'))
        data.password = newPassword
        localStorage.setItem('userData', JSON.stringify(data))
    }

    const changeAccountData = async event => {
        event.preventDefault()
        form.surname = document.getElementById('surname').value
        form.name = document.getElementById('name').value
        form.email = document.getElementById('email').value
        form.password = document.getElementById('password').value
        form.dateOfBirth = document.getElementById('dateOfBirth').value
        form.addres = document.getElementById('addres').value
       
        const button = document.getElementById('changebtn')
        button.classList.add('disabled')
        if (Object.values(form).includes("")){
            setError("All fields must be filled")
            return
        }
        await request(`/api/accounts/change-user-account`, 'PUT', {
            userId, ...form
        })
        changePassword(document.getElementById('password').value)
        navigate("/user/account", { replace: true })
    }
    
    useEffect(() => {
        getAccountData().then(data => {
            if (data){
                setOpened(data.opened)
                Object.keys(data).forEach(value => {
                const input = document.getElementById(value)
                    if (input){
                        if (value === "password"){
                            input.value = password
                        } else if (value === "dateOfBirth") {
                            input.value = formatDate(new Date(data[value]))
                        } else if (value === "balance") {
                            setBalance(data[value])
                        } else {
                            input.value = data[value]
                        }
                    }
                })
            }
        })
    }, [])

    if (!isAuth){
        <Navigate to="/user/login"/>
    }
    return (
        <>  
            <div className="row" style={{paddingLeft: "10rem", paddingRight: "10rem"}}>
                <h1>Your account data</h1>
                {isOpened ? <form className="col s12" onChange={formChange}>
                    <div className="row">
                        <div className="input-field col s6">
                            <input id="surname" type="text" className="validate"/>
                            <label htmlFor="surname">Surname</label>
                        </div>
                        <div className="input-field col s6">
                            <input id="name" type="text" className="validate"/>
                            <label htmlFor="name">Name</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input id="email" type="text" className="validate"/>
                            <label htmlFor="email">Email</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input id="password" type="text" className="validate"/>
                            <label htmlFor="password">Password</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input id="addres" type="text" className="validate"/>
                            <label htmlFor="addres">Address</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <input id="dateOfBirth" type='date'placeholder='Date of birth'/>
                            <label htmlFor="dateOfBirth">Date of birth</label>
                        </div>
                    </div>
                    <div className="input-field" style={{marginTop: '50px'}}>
                        <CurrencyInput disabled value={balance} id="balance" prefix={currency + " "} thousandSeparator=""/>
                        <label htmlFor="disabled"></label>
                        <button onClick={changeCurrency} className="waves-effect waves-light btn-small" id="USD" style={{margin: '5px'}}>USD</button>
                        <button onClick={changeCurrency} className="waves-effect waves-light btn-small" id="ILS" style={{margin: '5px'}}>ILS</button>
                        <button onClick={changeCurrency} className="waves-effect waves-light btn-small" id="LVC" style={{margin: '5px'}}>LVC</button>
                    </div>
                    <div className="card-action center-align">
                        <button id="changebtn" className="waves-effect waves-light btn disabled" onClick={changeAccountData}>Change</button>
                    </div>
                    </form>
                : <h2>Wait until manager accept you request</h2>}
            </div>
        </>
    );
}