/**
 * 
 * @param {any} v 
 * @returns {v}
 * @link https://github.com/vkarpov15/mongo-sanitize/blob/master/index.js
 */
export function sanitizeMongoose<A>(v: A): A
{
    if (v instanceof Object)
    {
        for (const key in v)
        {
            if (/^\$/.test(key))
            {
                delete v[key];
            } 
            else 
            {
                sanitizeMongoose(v[key]);
            }
        }
    }
    return v;
}

export const setTypeValueOfObj = (obj: any) =>
{
    // Go through each property of the object
    // And if we find "type", we call it by typeof ...type() to get type
    // And we set the value of the property to the type
    // It can also be recursive
    for (const key in obj)
    {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(key))
        {
            const element = obj[key];
            if (typeof element === "object")
                setTypeValueOfObj(element);
            else if (typeof element === "function")
                obj[key] = typeof element()
        }
    }
};