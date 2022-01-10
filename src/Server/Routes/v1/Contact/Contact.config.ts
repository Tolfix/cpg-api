import { Application, Router } from "express";
//@ts-ignore
import { OSTicket } from 'ac-osticket'
import { osticket_api_key, osticket_url } from "../../../../Config";

export default class ContactRouter
{
    private server: Application;
    private router = Router();

    private ost = new OSTicket({
        baseURL: osticket_url,
        apiKey: osticket_api_key, 
    })

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/contact`, this.router);

        this.router.post("/", (req) =>
        {
            const {
                first_name,
                last_name,
                email,
                subject,
                body
            } = req.body;

            this.ost.createTicket({
                "name": `${first_name} ${last_name}`,
                "email": email,
                "subject": subject,
                "message": body
            });
        });

    }
}