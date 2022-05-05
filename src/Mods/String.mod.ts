export {};

declare global
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface String
    {
        firstLetterUpperCase(): string
    }
}

Object.defineProperty(String.prototype, "firstLetterUpperCase", {
    value: function()
    {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
});