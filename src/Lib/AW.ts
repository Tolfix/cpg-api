// Promise<P> extends P ? P extends P ? any : Promise<P extends P ? P : any> : any
export default async function 
    AW<P>(data: P extends Promise<P> ? Promise<P> : P)
        : Promise<[P | null, PromiseRejectedResult | null]>
{
    try
    {
        // @ts-ignore
        return [await data, null];
    } catch (e)
    {
        return [null, e as PromiseRejectedResult];
    }
}