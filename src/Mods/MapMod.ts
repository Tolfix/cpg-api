declare global
{
    interface Map<K, V>
    {
        array(): Array<V>
    }
}

export default Object.defineProperty(Map.prototype, "array", {
    value: function()
    {
        return [...(this.values())];
    }
});

