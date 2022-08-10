import { Link, Navigate } from "react-router-dom"
import { AuthContext } from "../../context"
import { useContext } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { useHttp } from "../../hooks/http.hook"
import { useCallback } from "react"


export const UserTransactions = () => {
    const { isAuth, userId } = useContext(AuthContext)
    const [ transactions, setTransactions ] = useState({})
    const { request } = useHttp()


    const getTransactions = useCallback(async () => {
        const data = await request(`/api/transactions/user-transactions/${userId}`, 'GET')
        return data
    }, [request, userId])
    
    useEffect(() => {
        getTransactions().then(data => {
            setTransactions(data)
        })
    }, [getTransactions, setTransactions])

    const formatDate = (date) => {
        const day = date.getDay()
        const month = date.getMonth()
        const year = date.getFullYear()
        return `${day > 10 ? day : "0" + day}-${month > 10 ? month : "0" + month}-${year}`
    }

    const filterDate = event => {
        console.log(event)
    }

    if (!isAuth){
        return <Navigate to="/user/login"/>
    }
    
    return (
        <>
            <div className="row" style={{paddingLeft: "10rem", paddingRight: "10rem"}}>
                <label>Date filter</label>
                <select className="browser-default" onSelect={filterDate}>
                    <option value="" disabled defaultValue>Choose your option</option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                </select>
                <h1 className="center-align" style={{marginRight: "70px"}}>Your transactions</h1>
                {
                    transactions.message && transactions.message.map((transaction, idx) => {
                        return <div className="col s3 m4" key={idx}>
                                <div className="card blue-grey darken-1 z-depth-4" style={{width: "30rem", height: "27rem"}}>
                                    <div className="card-content white-text">
                                        <span style={{marginBottom: "40px"}} className="card-title">{transaction.type}</span>
                                        {transaction.type === 'LEND' && <h6 style={{marginBottom: "30px"}}><b>Status:&nbsp;{!transaction.closed ? "Opened" : "Closed"}</b></h6>}
                                        <h6 style={{marginBottom: "30px"}}>From:&nbsp;<strong>{transaction.from}</strong></h6>
                                        <h6 style={{marginBottom: "30px"}}>To:&nbsp;<strong>{transaction.to}</strong></h6>
                                        <h6 style={{marginBottom: "30px"}}>Receiver email:&nbsp;<strong>{transaction.email}</strong></h6>
                                        <h6 style={{marginBottom: "40px"}}>Sum:&nbsp;<b>{transaction.sum}</b></h6>
                                        <h6>Date:&nbsp;<b>{formatDate(new Date(transaction.date))}</b></h6>
                                    </div>
                                </div>
                            </div>
                    }) 
                }
            </div>
        </>
    );
}