import { Link, Navigate } from "react-router-dom"
import { useBalance } from "../../hooks/balance.hook"
import { AuthContext } from "../../context"
import { useContext } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { useHttp } from "../../hooks/http.hook"


export const UserTransfers = () => {
    const { isAuth, userId } = useContext(AuthContext)
    const { balance, changeBalance, currency, changeCurrency } = useBalance()
    const [form, setForm] = useState({
        email: "",
        balance: "0,00 " + currency
    })
    const { request, setError } = useHttp()

    useEffect(() => {
        const balanceInput = document.getElementById('balance')
        balanceInput.value = form.balance
    }, [form])
    
    
    const formChange = event => {
        let value = event.target.value
        if (event.target.id === "balance"){
            changeBalance(value)
            value = balance + " " + currency
        }
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
            changeBalance(form.balance)
            form.balance = balance + " " + currency
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
                                <input id="balance" type="text" className="validate"/>
                                <label htmlFor="balance">Sum</label>
                            </div>
                            <p>
                                <label>
                                    <input onClick={changeCurrency} id="USD" className="with-gap" name="group3" type="radio" defaultChecked/>
                                    <span>USD</span>
                                </label>
                            </p>
                            <p>
                                <label>
                                    <input onClick={changeCurrency} id="ILS" className="with-gap" name="group3" type="radio"/>
                                    <span>ILS</span>
                                </label>
                            </p>
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