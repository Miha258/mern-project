import { Route, Routes, BrowserRouter } from "react-router-dom"
import { RegisterUserAccount } from "./pages/user/UserRegister"

import { UserPage } from "./pages/user/UserPage"
import { UserLogin } from "./pages/user/UserLogin"
import { UserAccount } from "./pages/user/UserAccount"
import { UserTransfers } from "./pages/user/UserTransfers"
import { UserTransactions } from "./pages/user/UserTransactions"

import { ManagerRegister } from "./pages/manager/ManagerRegister"
import { ManagerPage } from "./pages/manager/ManagerPage"
import { ManagerLogin } from "./pages/manager/ManagerLogin"
import { UserAccounts } from "./pages/manager/UserAccounts"

export const useRoutes = () => {
    return ( 
        <BrowserRouter>
            <Routes>
                <Route path="/user" element={<UserPage/>}>
                    <Route path="register" element={<RegisterUserAccount/>}/>
                    <Route path="login" element={<UserLogin/>}/>
                    <Route path="account" element={<UserAccount/>}/>
                    <Route path="transfers" element={<UserTransfers/>}/>
                    <Route path="transactions" element={<UserTransactions/>}/>
                </Route>
                <Route path="/manager" element={<ManagerPage/>}>
                    <Route path="register" element={<ManagerRegister/>}/>
                    <Route path="login" element={<ManagerLogin/>}/>
                    <Route path="user-accounts" element={<UserAccounts/>}/>
                </Route>
            </Routes>
            
        </BrowserRouter>
    )
}