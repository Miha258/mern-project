import { Link, Navigate } from "react-router-dom"
import { useBalance } from "../../hooks/balance.hook"
import { AuthContext } from "../../context"
import { useContext } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { useHttp } from "../../hooks/http.hook"
import CurrencyInput from 'react-currency-input'


export const UserTransfers = () => {
    const { isAuth, userId } = useContext(AuthContext)
    const { balance, currency, changeCurrency } = useBalance()
    const [form, setForm] = useState({
        email: "",
        balance: "USD 0.00"
    })
    const { request, setError } = useHttp()

    
    const formChange = event => {
        let value = event.target.value
        form[event.target.id] = value
        event.target.value = form[event.target.id]
    }

    const transferHandler = async event => {
        event.preventDefault()
        if (Object.values(form).includes("")){
            setError("All fields must be filled")
            return
        }
        const balanceInput = document.getElementById('balance')
        if (balanceInput.value !== 'USD'){
            form.balance = currency + " " + balance
        }
        if (event.target.innerText === 'TRANSFER') {
            await request('/api/transactions/transfer', 'POST', {
                userId,
                type: 'TRANSFER',
                email: form.email,
                sum: form.balance,
            })
        } else if (event.target.innerText === 'LEND'){
            await request('/api/transactions/lend', 'POST', {
                userId,
                type: 'LEND',
                email: form.email,
                sum: form.balance
            })
        }
    }

    if (!isAuth){
        return <Navigate to="/user/login"/>
    }

    return (
        <>
            <div className="row" style={{paddingLeft: "10rem", paddingRight: "10rem"}}>
                <h1>Transfer money</h1>
                <form className="col s12">
                    <div className="row" onChange={formChange}>
                        <div className="input-field" style={{marginTop: '50px'}}>
                            <div className="input-field col s12">
                                <input id="email" type="text" className="validate"/>
                                <label htmlFor="email">User email</label>
                            </div>
                            <div className="input-field col s12">
                                <CurrencyInput id="balance" value={balance} prefix={currency + " "} thousandSeparator=""/>
                                <label htmlFor="balance">Sum</label>
                            </div>
                            <button onClick={changeCurrency} className="waves-effect waves-light btn-small" id="USD" style={{margin: '5px'}}>USD</button>
                            <button onClick={changeCurrency} className="waves-effect waves-light btn-small" id="ILS" style={{margin: '5px'}}>ILS</button>
                            <button onClick={changeCurrency} className="waves-effect waves-light btn-small" id="LVC" style={{margin: '5px'}}>LVC</button>
                        </div>
                        <Link to="/user/transactions">Transactions history</Link>
                        <div className="card-action center-align">
                            <button onClick={transferHandler} id="changebtn" style={{margin: "20px"}} className="waves-effect waves-light btn">TRANSFER</button>
                            <button onClick={transferHandler} id="changebtn" style={{margin: "20px"}} className="waves-effect waves-light btn">LEND</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}