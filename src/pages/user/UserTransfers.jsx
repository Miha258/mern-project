import { Link, Navigate } from "react-router-dom"
import { AuthContext } from "../../context"
import { useContext } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { useCallback } from "react"
import { useHttp } from "../../hooks/http.hook"
import CurrencyInput from 'react-currency-input'
import { useRef } from "react"


export const UserTransfers = () => {
    const { isAuth, userId } = useContext(AuthContext)
    
    const email = useRef(null)
    const balance = useRef(null)
   
    const [ isOpened, setOpened ] = useState(true)
    const { request, setError } = useHttp()

    
    const isAccountOpened = useCallback(async () => { 
        const data = await request(`/api/accounts/user-account/${userId}`, 'GET')
        return data.data.opened
    }, [userId, request])
    

    useEffect(() => {
        isAccountOpened().then(isOpened => setOpened(isOpened))
    }, [isAccountOpened])

    

    const transferHandler = async event => {
        event.preventDefault()
        const currentSum = balance.current.state.maskedValue
        const currentEmail = email.current.value
        
        if (currentSum === "" || currentEmail === ""){
            setError("All fields must be filled")
            return
        }

        if (event.target.innerText === 'TRANSFER') {
            await request('/api/transactions/transfer', 'POST', {
                userId,
                type: 'TRANSFER',
                email: currentEmail,
                sum: currentSum
            })
        } else if (event.target.innerText === 'LEND'){
            await request('/api/transactions/lend', 'POST', {
                userId,
                type: 'LEND',
                email: currentEmail,
                sum: currentSum
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
                {isOpened ? <form className="col s12">
                    <div className="row">
                        <div className="input-field" style={{marginTop: '50px'}}>
                            <div className="input-field col s12">
                                <input ref={email} id="email" type="text" className="validate"/>
                                <label htmlFor="email">User email</label>
                            </div>
                            <div className="input-field col s12">
                                <CurrencyInput ref={balance} id="balance" value={balance.current ? balance.current.state.value : 0} prefix={"LVC "} thousandSeparator=""/>
                                <label htmlFor="balance">Sum</label>
                            </div>
                        </div>
                        <Link to="/user/transactions">Transactions history</Link>
                        <div className="card-action center-align">
                            <button onClick={transferHandler} id="changebtn" style={{margin: "20px"}} className="waves-effect waves-light btn">TRANSFER</button>
                            <button onClick={transferHandler} id="changebtn" style={{margin: "20px"}} className="waves-effect waves-light btn">LEND</button>
                        </div>
                    </div>
                </form> : <h2>Wait until manager accept your request</h2>}
            </div>
        </>
    );
}