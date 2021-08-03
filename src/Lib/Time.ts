import dateFormat from "date-and-time";

export function getTime() 
{
    const D_CurrentDate = new Date();

    let S_FixedDate = dateFormat.format(D_CurrentDate, "YYYY-MM-DD HH:mm:ss");
    return S_FixedDate;
}