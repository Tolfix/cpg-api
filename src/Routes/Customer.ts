import { Application, Router } from "express";

export default class CustomerRouter
{
    private server: Application;
    private router = Router();

    public name = "Customer";

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/customer", this.router);

        this.router.post("/create", (req, res) => {

            let {
                first_name,
                last_name,
                email,
                phone,
                company,
                company_vat,
                street01,
                street02,
                city,
                state,
                postcode,
                country
            } = req.body;

            

        });
    }
}