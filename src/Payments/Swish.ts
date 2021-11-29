import request from "request";

// Create qr code for Swish from IInvoice interface
export function createSwishQRCode(number: string, amount: number, notes: string)
{
    return new Promise((resolve, reject) => {
        const url = "https://mpc.getswish.net/qrg-swish";
        const endpoint = "/api/v1/prefilled";

        const data = {
            format: "png",
            payee: {
                value: number,
                editable: false
            },
            amount: {
                value: amount,
                editable: false,
            },
            message: {
                value: notes,
                editable: false
            },
            size: 300,
            transparent: true,
        }

        request(`${url}${endpoint}`, {
            method: "POST",
            json: true,
            encoding: null,
            body: data
        }, (error, response, body) => {
            if (!error && response.statusCode === 200)
                resolve(Buffer.from(body).toString("base64"));
        });
    })
}