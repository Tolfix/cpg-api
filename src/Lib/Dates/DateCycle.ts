import datetime from "date-and-time";
import { TRecurringMethod } from "../../Types/PaymentMethod";

export default function nextRecycleDate(date: Date, type: TRecurringMethod): Date
{
    if(type === "monthly")
        return (datetime.addMonths(date, 1));

    if(type === "yearly")
        return (datetime.addMonths(date, 12));

    if(type === "biennially")
        return (datetime.addYears(date, 2));
    
    if(type === "quarterly")
        return (datetime.addMonths(date, 4));

    if(type === "semi_annually")
        return (datetime.addMonths(date, 6));

    if(type === "triennially")
        return (datetime.addYears(date, 3));

    return (datetime.addMonths(date, 1));
}