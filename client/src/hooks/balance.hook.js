import { useCallback, useEffect, useState } from "react"
import { useHttp } from "./http.hook"



export const useBalance = () => {
    const [ balance, setBalance ] = useState("0.00")
    const { request } = useHttp()
    const [ currency, setCurrency ] = useState("USD")

    const convertCurrency = useCallback(async (to, from, amount) => {
        try {
            amount = parseFloat(amount.substring(4))
            if (amount !== 0){
                const data = await request(`/api/currency/convert?from=${from}&to=${to}&amount=${amount}`, 'GET')
                return data.result.toString()
            }
        } catch (err) {
            console.log(err)    
        }   
    }, [request])
    
    const changeCurrency = useCallback(async event => {
        event.preventDefault()
        const currentCurrency = event.target.id
        const balanceInput = document.getElementById('balance')
        if (balanceInput.value){
            const changedCurrency = await convertCurrency(currency, currentCurrency, balanceInput.value) 
            setCurrency(currentCurrency)
            setBalance(changedCurrency)
        }
    }, [convertCurrency, setBalance])
    
    useEffect(() => {
        console.log(currency)
    }, [currency])
    return { balance, currency, changeCurrency, convertCurrency, setBalance }
}

