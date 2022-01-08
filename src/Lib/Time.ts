import dateFormat from "date-and-time";

export function getTime() 
{
    const D_CurrentDate = new Date();

    const S_FixedDate = dateFormat.format(D_CurrentDate, "YYYY-MM-DD HH:mm:ss");
    return S_FixedDate;
}

export function getDate(removeDays = false)
{
    const D_CurrentDate = new Date();
    let S_FixedDate = dateFormat.format(D_CurrentDate, "YYYY-MM-DD");
    if(removeDays)
        S_FixedDate = dateFormat.format(D_CurrentDate, "YYYY-MM")
    return S_FixedDate;
}