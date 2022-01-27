import { Request } from 'express';

/**
 * @description Gets query sorting/search from request
 * @param {Request} req
 */
export default <T>(req: Request) =>
{
    const sort = req.query.sort ?? req.query._sort ?? '';
    const search = req.query.search ?? req.query._search ?? '';
    const start = req.query.start ?? req.query._start ?? 1;
    const end = req.query.end ?? req.query._end ?? 10;

    let sortObj: { [key: string]: any } = {};

    Object.keys(req.query).forEach(key =>
    {
        // Get T keys, then check if they are found in key which should be key[]

        // Find if any looks like key[string]
        const keyRegex = new RegExp(`^${key}\\[(.*)\\]$`);
        const match = key.match(keyRegex);
        // If match is found, then get the value inside []
        if(match)
        {
            const value = req.query[key] as string;
            // Filter string to remove []
            // Filter can be [lte], [gte], [exists], [regex], [before], and [after]
            const filter = key.replace(/\[\]/g, '').replace(key, '');
            sortObj[key] = {
                [filter]: value
            }
        }
    });

    return {
        ...sortObj,
        sort,
        search,
        start,
        end
    }

}