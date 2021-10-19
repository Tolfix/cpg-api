export default function DaysBetween(dateNow: Date, dateCheck: Date): number
{
    return (dateNow.getTime() - dateCheck.getTime()) / (1000 * 3600 * 24);
}