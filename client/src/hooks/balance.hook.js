import { useCallback, useState } from "react"
import { useHttp } from "./http.hook"



export const useBalance = () => {
    const [balance, setBalance] = useState(0)
    const { request } = useHttp()
    const [ currency, setCurrency ] = useState("USD")

    const convertCurrency = useCallback(async (to, from, amount) => {
        try {
            const data = await request(`/api/currency/convert?from=${from}&to=${to}&amount=${amount.substring(4)}`, 'GET')
            return data.result.toString()
        } catch (err) {
            console.log(err)    
        }   
    }, [request])
    
    const changeCurrency = useCallback(async event => {
        const currency = event.target.id
        const balanceInput = document.getElementById('balance')
        if (balanceInput.value){
            let changedCurrency = await convertCurrency('ILS', 'USD', balanceInput.value.replace(',','.')) 
            switch (currency){
                case 'ILS':
                    setCurrency('ILS')
                    console.log(changedCurrency)
                    balanceInput.value = 'ILS ' + changedCurrency
                    break
                case 'USD':
                    changedCurrency = await convertCurrency('USD', 'ILS', balanceInput.value.replace(',','.'))
                    setCurrency('USD')
                    balanceInput.value = 'USD ' + changedCurrency
                    break
                default:
                    break
            }
        }
    }, [convertCurrency])
    return { balance, currency, changeCurrency }
}

