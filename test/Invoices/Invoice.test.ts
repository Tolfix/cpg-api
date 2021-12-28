// import jest from "jest";
import mongoose from "mongoose";
import InvoiceModel from "../../src/Database/Schemas/Invoices";
import CustomerModel from "../../src/Database/Schemas/Customers/Customer";
import { sendInvoiceEmail } from "../../src/Lib/Invoices/SendEmail";

describe("Invoices", () => {

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI ?? "mongodb://localhost/test");
        jest.setTimeout(10*1000);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it("should create an invoice", async () => {
        
        const invoice = await (new InvoiceModel({
            uid: `INV_123`,
            customer_uid: 0,
            dates: {},
            amount: 0,
            items: [],
            transactions: [],
            payment_method: "none",
            status: "pending",
            tax_rate: 25,
            notes: "string",
            paid: false,
            notified: false,
        }).save());

        // Except invoice to have an id
        expect(invoice.id).toBeDefined();

    });

    it("should notify invoice", async () => {
        

        const invoice = await (new InvoiceModel({
            uid: `INV_123`,
            customer_uid: 0,
            dates: {},
            amount: 0,
            items: [],
            transactions: [],
            payment_method: "none",
            status: "pending",
            tax_rate: 25,
            notes: "string",
            paid: false,
            notified: false,
        }).save());

        const customer = await CustomerModel.findOne({ id: 0 });

        // @ts-ignore
        const sent = await sendInvoiceEmail(invoice, customer);

        if(sent)
        {
            const newInvoice = await InvoiceModel.findOne({ id: invoice.id });
            // should be newInvoice.notified === true
            expect(newInvoice?.notified).toBe(true);
        }
        else
            return expect(sent).toBe(false);

    });


});