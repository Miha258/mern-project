import { Navigate } from "react-router-dom"
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


    const filterDate = event => {
        const target = event.target
        const now = new Date()
        switch (target){
            case "lastYear":
                setTransactions(transactions.message.filter(transaction => (now.getFullYear() - new Date(transaction.date).getFullYear()) === 1))
                break

            case "lastMonth":
                setTransactions(transactions.message.filter(transaction => (now.getMonth() - new Date(transaction.date).getMonth()) === 1))
                break

            case "lastDay":
                setTransactions(transactions.message.filter(transaction => (now.getDate() - new Date(transaction.date).getDate()) === 1))
                break
        }
    }

    if (!isAuth){
        return <Navigate to="/user/login"/>
    }
    
    return (
        <>
            <div className="row" style={{paddingLeft: "10rem", paddingRight: "10rem"}}>
                <div className="filter" onClick={filterDate}>
                <label>Date filter</label>
                <p>
                    <label>
                        <input id="lastDay" className="with-gap" name="group1" type="radio" />
                        <span>Last day</span>
                    </label>
                </p>
                <p>
                    <label>
                        <input id="lastMonth" className="with-gap" name="group1" type="radio"  />
                        <span>Last month</span>
                    </label>
                </p>
                <p>
                    <label>
                        <input id="lastYear" className="with-gap" name="group1" type="radio"  />
                        <span>Last year</span>
                    </label>
                </p>
                </div>
                {
                    transactions.message && transactions.message.length === 0
                    ? 
                    <h1 className="center-align" style={{marginRight: "70px"}}>No transactions in this period</h1>
                    : 
                    <h1 className="center-align" style={{marginRight: "70px"}}>Your transactions</h1>
                }
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
                                    <h6>Date:&nbsp;<b>{transaction.date.substring(0, 10)}</b></h6>
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>
        </>
    );
}