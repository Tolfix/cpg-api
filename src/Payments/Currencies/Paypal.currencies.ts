// A list of accaptable curenices for paypal
const data = {
    /*
     Australian dollar	AUD
     Brazilian real 2	BRL
     Canadian dollar	CAD
     Chinese Renmenbi 3	CNY
     Czech koruna	CZK
     Danish krone	DKK
     Euro	EUR
     Hong Kong dollar	HKD
     Hungarian forint 1	HUF
     Israeli new shekel	ILS
     Japanese yen 1	JPY
     Malaysian ringgit 3	MYR
     Mexican peso	MXN
     New Taiwan dollar 1	TWD
     New Zealand dollar	NZD
     Norwegian krone	NOK
     Philippine peso	PHP
     Polish złoty	PLN
     Pound sterling	GBP
     Russian ruble	RUB
     Singapore dollar	SGD
     Swedish krona	SEK
     Swiss franc	CHF
     Thai baht	THB
     United States dollar	USD
     */
    // Use these currencies for paypal
    currencies: ["AUD", "BRL", "CAD", "CNY", "CZK", "DKK", "EUR", "HKD", "HUF", "ILS", "JPY", "MYR", "MXN", "TWD", "NZD", "NOK", "PHP", "PLN", "GBP", "RUB", "SGD", "SEK", "CHF", "THB", "USD"] as const,
}

export const PaypalCurrencies = data.currencies;

export function validCurrencyPaypal(currency: typeof PaypalCurrencies)
{
    // @ts-ignore
    return data.currencies.includes(currency);
}