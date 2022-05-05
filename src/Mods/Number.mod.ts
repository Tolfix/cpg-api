export {};

declare global
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface NumberConstructor
    {
        isEven(n: number): boolean
        isOdd(n: number): boolean
    }
}

Object.defineProperty(Number, "isEven", {
    value: function(n: number)
    {
        return (n % 2) === 0;
    }
});

Object.defineProperty(Number, "isOdd", {
    value: function(n: number)
    {
        return !this.isEven(n);
    }
});