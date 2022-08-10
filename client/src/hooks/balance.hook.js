import { useCallback, useEffect, useState } from "react"
import { useHttp } from "./http.hook"



export const useBalance = () => {
    const [balance, setBalance] = useState(0)
    const { request } = useHttp()
    const [ currency, setCurrency ] = useState("USD")


    const changeBalance = useCallback(value => {
        const options = { minimumFractionDigits: 2 }
        const result = new Intl.NumberFormat('pt-BR', options).format(
        parseFloat(value.replace(',', '').replace(/\D/g, '')) / 100)
        setBalance(result.split('.').join(''))
    }, [setBalance])
    
    const convertCurrency = useCallback(async (to, from, amount) => {
        try {
            const data = await request(`/api/currency/convert?from=${from}&to=${to}&amount=${amount}`, 'GET')
            return data.result.toString().replace('.', ',')
        } catch (err) {
            console.log(err)    
        }   
    }, [request])
    
    const changeCurrency = useCallback(async event => {
        const currency = event.target.id
        // setCurrency(currency)
        const balanceInput = document.getElementById('balance')
        if (balanceInput.value){
            let changedCurrency = await convertCurrency('ILS', 'USD', balanceInput.value.replace(',','.')) 
            switch (currency){
                case 'ILS':
                    balanceInput.value = changedCurrency + ' ILS'
                    break
                case 'USD':
                    changedCurrency = await convertCurrency('USD', 'ILS', balanceInput.value.replace(',','.'))
                    balanceInput.value = changedCurrency + ' USD'
                    break
                default:
                    break
            }
        }
    }, [convertCurrency])
    return { balance, changeBalance, currency, changeCurrency }
}

