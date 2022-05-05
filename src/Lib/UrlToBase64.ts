import request from "request";

export default function urlToBase64(url: string): Promise<Buffer>
{
    return new Promise((resolve, reject) =>
    {
        request({ url, encoding: null }, (error, response, body) =>
        {
            if (!error && response.statusCode === 200)
                return resolve(Buffer.from(body, 'base64'));
            return reject(`Failed to get`);
        });
    });
}