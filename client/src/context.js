import { createContext }  from "react";

function noop(){}

export const AuthContext = createContext({
    token: null,
    userId: null,
    login: noop,
    logout: noop,
    isAuth: false,
    password: null,
    isManager: false,
})