
declare global
{
    interface Map<K, V>
    {
        array: () => Array<V>
    }
}

export default Object.defineProperty(Map.prototype, "array", {
    value: function()
    {
        let a = [];
        for (let [key, value] of this.entries())
        {
            a.push(value);
        }
        return a;
    }
})