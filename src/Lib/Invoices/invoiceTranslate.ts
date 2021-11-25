export const translate_sweden =
{
    "invoiceNumber": "Fakturanummer",
    "invoiceDate": "Fakturadatum",
    "products": "Produkter", 
    "quantity": "Antal", 
    "price": "Pris",
    "subtotal": "Belopp",
    "total": "Totalt",
}

export function getTranslate(country: string)
{
    country = country.toLowerCase();

    if(country === 'sweden' || country === 'se' || country === 'sverige')
        return translate_sweden;
    
}