import InvoiceModel from "../../Database/Models/Invoices.model";
import Logger from "../../Lib/Logger";

export default {
    name: 'markAsPaid',
    description: 'Mark an invoice as paid',
    args: [
        {
            name: 'invoiceId',
            type: 'input',
            message: 'Enter the invoice id',
            validate: (value: string) =>
            {
                if (isNaN(Number(value)))
                    return 'Please enter a valid number';
                return true;
            },
        },
    ],
    method: async ({
        invoiceId
    }: {
        invoiceId: string;
    }) =>
    {
        const invoice = await InvoiceModel.findOne({
            id: invoiceId,
        });
        if (!invoice)
            return Logger.error(`Invoice with id ${invoiceId} not found`);
        if (invoice.paid)
            return Logger.error(`Invoice with id ${invoiceId} is already paid`);
        await InvoiceModel.updateOne({
            id: invoiceId,
        }, { $set: { paid: true } });
        Logger.info(`Invoice with id ${invoiceId} marked as paid`);
    }
}