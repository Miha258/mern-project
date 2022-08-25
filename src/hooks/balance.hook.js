import { useCallback, useRef, useState } from "react"
import { useHttp } from "./http.hook"



export const useBalance = () => {
    const [ balance, setBalance ] = useState("0.00")
    const { request } = useHttp()
    const currency = useRef("USD")

    const convertCurrency = useCallback(async (to, from, amount) => {
        try {
            amount = parseFloat(amount.substring(4))
            if (amount !== 0){
                const data = await request(`/api/currency/convert?from=${to}&to=${from}&amount=${amount}`, 'GET')
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
            const changedCurrency = await convertCurrency(currency.current, currentCurrency, balanceInput.value) 
            currency.current = currentCurrency
            setBalance(changedCurrency)
        }
    }, [convertCurrency, setBalance])
    
    return { balance, currency: currency.current, changeCurrency, convertCurrency, setBalance }
}

