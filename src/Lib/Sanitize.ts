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