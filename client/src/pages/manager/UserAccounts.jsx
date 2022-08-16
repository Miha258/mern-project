import { useEffect, useState, useCallback } from "react"
import { useHttp } from "../../hooks/http.hook"
import { useContext } from "react"
import { AuthContext } from "../../context"
import { useMail } from "../../hooks/mail.hook"
import { Navigate } from "react-router-dom"


export const UserAccounts = () => {
    const { request } = useHttp()
    const { isAuth, isManager} = useContext(AuthContext)
    const [ accounts, setAccounts ] = useState([])
    const { accountOpened, accountClosed} = useMail()


    const getUserAccounts = useCallback(async () => {
        const data = await request('/api/accounts/user-accounts', 'GET')
        setAccounts(data.data)
    }, [request])


    useEffect(() => {
        getUserAccounts()
    }, [getUserAccounts])


    const formatDate = (date) => {
        const day = date.getDay()
        const month = date.getMonth()
        const year = date.getFullYear()
        return `${day > 10 ? day : "0" + day}-${month > 10 ? month : "0" + month}-${year}`
    }

    const openAccount = async (id, email, name, surname) => {
        await request(`/api/accounts/open-account/${id}`, 'GET')
        await getUserAccounts()
        await request('/api/mail/send-mail', 'POST', {
            to: email, html: accountOpened(name, surname)
        })
    }

    const closeAccount = async (id, email, name, surname) => {
        await request(`/api/accounts/delete-account/${id}`, 'DELETE')
        await getUserAccounts()
        await request('/api/mail/send-mail', 'POST', {
            to: email, html: accountClosed(name, surname)
        })
    }

    if (!isAuth && !isManager){
        return <Navigate to="/manager/login"/>
    } else if (isAuth && !isManager){
        return <Navigate to="/user"/>
    } 

    return (
        <>
            <div className="row">
                <h1 className="center-align" style={{marginRight: "100px"}}>User accounts</h1>
                {
                    accounts && accounts.map((account, idx) => 
                        !account.opened &&
                        <div className="col s3 m4" key={idx}>
                                <div id={account._id} className="card blue-grey darken-1 z-depth-4" style={{width: "30rem", height: "27rem", margin: "40px"}}>
                                    <div className="card-content white-text">
                                        <span style={{marginBottom: "40px"}} className="card-title">{account.surname + " " + account.name}</span>
                                        <h6 style={{marginBottom: "30px"}}>Email:&nbsp;<strong>{account.email}</strong></h6>
                                        <h6 style={{marginBottom: "30px"}}>Date of birth:&nbsp;<strong>{formatDate(new Date(account.dateOfBirth))}</strong></h6>
                                        <h6 style={{marginBottom: "30px"}}>Addres:&nbsp;<strong>{account.addres}</strong></h6>
                                        <h6 style={{marginBottom: "40px"}}>Balance:&nbsp;<b>{account.balance}</b></h6>
                                    </div>
                                    <div className="card-action">
                                        <button onClick={() => openAccount(account._id, account.email, account.name, account.surname)} style={{margin: "20px"}} className="dark-grey waves-light btn text-center">Accept</button>
                                        <button onClick={() => closeAccount(account._id, account.email, account.name, account.surname)} style={{margin: "20px"}} className="dark-grey waves-light btn text-center">Reject</button>
                                    </div>
                                </div>
                        </div>
                    ) 
                }
            </div>
        </>
    )
}