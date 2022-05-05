import { Application, Router } from "express";
import { createSwishQRCode } from "../../../../Payments/Swish";

export = SwishRouter;
class SwishRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/swish`, this.router);

        this.router.get("/qrcode", async (req, res) =>
        {
            const { phone, amount, notes } = req.body;
            const qr = await createSwishQRCode(phone, parseInt(amount), notes);
            res.send(qr);
        });

    }

}