export default async function 
    AW<P>(data: Promise<P> extends P ? P extends P ? any : Promise<P extends P ? P : any> : any)
        : Promise<[P | null, PromiseRejectedResult | null]>
{
    try
    {
        return [await data, null];
    } catch (e)
    {
        return [null, e as PromiseRejectedResult];
    }
}