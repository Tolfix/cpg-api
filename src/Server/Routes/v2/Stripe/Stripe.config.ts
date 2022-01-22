import { Application, Router } from "express";
import { 
    Company_Currency,
    Company_Website, DebugMode, Full_Domain, 
    Stripe_PK_Public, Stripe_PK_Public_Test, 
    Stripe_SK_Live, Stripe_SK_Test, Stripe_Webhook_Secret
} from "../../../../Config";
import InvoiceModel from "../../../../Database/Models/Invoices.model";
import { APIError } from "../../../../Lib/Response";
import stripe from "stripe";
import { CreatePaymentIntent, createSetupIntent, markInvoicePaid, RetrivePaymentIntent, RetriveSetupIntent } from "../../../../Payments/Stripe";
import CustomerModel from "../../../../Database/Models/Customers/Customer.model";
const Stripe = new stripe(DebugMode ? Stripe_SK_Test : Stripe_SK_Live, {
    apiVersion: "2020-08-27",
});

export = class StripeRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/stripe`, this.router);

        this.router.get("/pay/:invoiceId", async (req, res) =>
        {
            const invoiceId = req.params.invoiceId as any;
            const invoice = await InvoiceModel.findOne( { uid: invoiceId } );
            if(!invoice)
                return APIError("Couldn't find invoice")(res);

            if(invoice.paid)
                return APIError("Invoice already paid")(res);

            const intent = await CreatePaymentIntent(invoice);

            res.send(`
            <head>
                <title>Checkout | ${invoice.id}</title>
                <script src="https://js.stripe.com/v3/"></script>
                <style>
                    * {
                        font-family: "Verdana";
                    }
                    table, td, th {  
                        border: 1px solid #ddd;
                        text-align: left;
                    }
                    
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    
                    th, td {
                        padding: 15px;
                    }
                    body {
                        text-align: center;
                        padding: 40px 0;
                        background: #EBF0F5;
                    }
                    .card {
                        background: white;
                        padding: 40px;
                        border-radius: 4px;
                        box-shadow: 0 2px 3px #C8D0D8;
                        margin: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="card">
                    <div id="items">

                        <!-- Table of items from invoice -->
                        <table>
                            <tr>
                                <th>Item</th>
                                <th>Price</th>
                            </tr>
                            ${await (await Promise.all(invoice.items.map(async (item) => `
                                <tr>
                                    <td>${item.notes}</td>
                                    <td>${item.amount} ${(await Company_Currency()).toUpperCase()}</td>
                                </tr>
                            `))).join("")}

                            <tr>
                                <td>Tax</td>
                                <td>${invoice.tax_rate}%</td>
                            </tr>
                            <tr>
                                <td>Total</td>
                                <td>${invoice.amount+invoice.amount*invoice.tax_rate/100} ${(await Company_Currency()).toUpperCase()}</td>
                            </tr>
                        </table>


                    </div>
                    <hr />
                    <form id="payment-form">
                        <div id="payment-element">
                            <!-- Elements will create form elements here -->
                        </div>
                        <button style="
                            padding: 20px;
                            margin-top: 30px;
                            display: block;
                            width: 100%;
                            " id="submit">Submit</button>
                        <div style="
                        margin-top: 10px;
                        " id="error-message">
                            <!-- Display error message to your customers here -->
                        </div>
                    </form>
                </div>

                <script>
                    const stripe = Stripe('${DebugMode ? Stripe_PK_Public_Test : Stripe_PK_Public}');
                    
                    const appearance = {
                        theme: 'none',
                        variables: {
                          fontFamily: 'Verdana',
                          fontLineHeight: '1.5',
                          borderRadius: '0',
                          colorBackground: '#dfdfdf'
                        },
                        rules: {
                          '.Input': {
                            backgroundColor: '#ffffff',
                            boxShadow: 'inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080'
                          },
                          '.Input--invalid': {
                            color: '#DF1B41'
                          },
                          '.Tab, .Block': {
                            boxShadow: 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf'
                          },
                          '.Tab:hover': {
                            backgroundColor: '#eee'
                          },
                          '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
                            backgroundColor: '#ccc'
                          }
                        }
                      };
                    
                    const options = {
                        clientSecret: '${intent.client_secret}',
                        appearance: appearance,
                    };
                      
                    // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 2
                    const elements = stripe.elements(options);
                    
                    // Create and mount the Payment Element
                    const paymentElement = elements.create('payment');
                    paymentElement.mount('#payment-element');
                </script>

                <script>
                    const form = document.getElementById('payment-form');

                    form.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    
                    const {error} = await stripe.confirmPayment({
                        elements,
                        confirmParams: {
                            return_url: '${Full_Domain}/v2/stripe/${invoice.id}/complete',
                        },
                    });
                    
                    if (error) {
                        const messageContainer = document.querySelector('#error-message');
                        messageContainer.textContent = error.message;
                    } else {

                    }
                    });
                </script>

            </body>
            `)
        });

        this.router.get("/:invoiceId/complete", async (req, res) =>
        {
            const invoiceId = req.params.invoiceId;
            const payment_intent = req.query.payment_intent as string;
            const invoice = await InvoiceModel.findOne( { id: invoiceId } );
            if(!invoice)
                return APIError("Couldn't find invoice")(res);

            if(!payment_intent)
                return APIError("No payment_intent")(res);

            const intent = await RetrivePaymentIntent(payment_intent);

            let message = "";
            let href = "";
            let status = "";

            switch (intent.status)
            {
                case 'succeeded':
                    message = 'Success! Payment received.';
                    href = await Company_Website();
                    status = intent.status;
                    break;
            
                case 'processing':
                    message = "Payment processing. We'll update you when payment is received.";
                    href = await Company_Website();
                    status = intent.status;
                    break;
            
                case 'requires_payment_method':
                    message = 'Payment failed. Please try another payment method.';
                    href = `${Full_Domain}/v2/stripe/pay/${invoice.id}`;
                    status = intent.status;
                    // Redirect your user back to your payment page to attempt collecting
                    // payment again
                    break;
            
                default:
                    message = 'Something went wrong.';
                    href = await Company_Website();
                    break;
            }

            res.send(`
            <html>
                <head>
                    <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap" rel="stylesheet">
                </head>
                <style>
                    body {
                        text-align: center;
                        padding: 40px 0;
                        background: #EBF0F5;
                    }
                    h1 {
                        color: ${status === "requires_payment_method" ? '#B04B4B' : '#88B04B'};
                        font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                        font-weight: 900;
                        font-size: 40px;
                        margin-bottom: 10px;
                    }
                    i {
                        color: ${status === "requires_payment_method" ? '#B04B4B' : '#9ABC66'};
                        font-size: 100px;
                        line-height: 200px;
                        margin-left:-15px;
                    }
                    .card {
                        background: white;
                        padding: 60px;
                        border-radius: 4px;
                        box-shadow: 0 2px 3px #C8D0D8;
                        display: inline-block;
                        margin: 0 auto;
                    }
                </style>
                <body>
                    <div class="card">
                        <div style="border-radius:200px; height:200px; width:200px; background: #F8FAF5; margin:0 auto;">
                            <i class="checkmark">${status === "requires_payment_method" ? "❌" : "✓"}</i>
                        </div>
                        <h1>${message}</h1> 
                        <a href="${href}">${status === "requires_payment_method" ? "Pay again" : "Home"}</a>
                    </div>
                </body>
            </html>
            `);
        });

        this.router.get("/setup/:customer_uid", async (req, res) =>
        {
            const customer_uid = req.params.customer_uid;
            const customer = await CustomerModel.findOne( { uid: customer_uid } );
            if(!customer)
                return APIError("Couldn't find customer")(res);

            // Create a SetupIntent with a PaymentMethod
            const setupIntent = await createSetupIntent(customer.id);

            res.send(`
            <head>
                <title>Setup Method</title>
                <script src="https://js.stripe.com/v3/"></script>
                <style>
                    * {
                        font-family: "Verdana";
                    }
                    table, td, th {  
                        border: 1px solid #ddd;
                        text-align: left;
                    }
                    
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    
                    th, td {
                        padding: 15px;
                    }
                    body {
                        text-align: center;
                        padding: 40px 0;
                        background: #EBF0F5;
                    }
                    .card {
                        background: white;
                        padding: 40px;
                        border-radius: 4px;
                        box-shadow: 0 2px 3px #C8D0D8;
                        margin: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="card">
                    <form id="payment-form">
                        <div id="payment-element">
                            <!-- Elements will create form elements here -->
                        </div>
                        <button style="
                            padding: 20px;
                            margin-top: 30px;
                            display: block;
                            width: 100%;
                            " id="submit">Submit</button>
                        <div style="
                        margin-top: 10px;
                        " id="error-message">
                            <!-- Display error message to your customers here -->
                        </div>
                    </form>
                </div>

                <script>
                    const stripe = Stripe('${DebugMode ? Stripe_PK_Public_Test : Stripe_PK_Public}');
                    
                    const appearance = {
                        theme: 'none',
                        variables: {
                          fontFamily: 'Verdana',
                          fontLineHeight: '1.5',
                          borderRadius: '0',
                          colorBackground: '#dfdfdf'
                        },
                        rules: {
                          '.Input': {
                            backgroundColor: '#ffffff',
                            boxShadow: 'inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080'
                          },
                          '.Input--invalid': {
                            color: '#DF1B41'
                          },
                          '.Tab, .Block': {
                            boxShadow: 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf'
                          },
                          '.Tab:hover': {
                            backgroundColor: '#eee'
                          },
                          '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
                            backgroundColor: '#ccc'
                          }
                        }
                      };
                    
                    const options = {
                        clientSecret: '${setupIntent.client_secret}',
                        appearance: appearance,
                    };
                      
                    // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 2
                    const elements = stripe.elements(options);
                    
                    // Create and mount the Payment Element
                    const paymentElement = elements.create('payment');
                    paymentElement.mount('#payment-element');
                </script>

                <script>
                    const form = document.getElementById('payment-form');

                    form.addEventListener('submit', async (event) => {
                        event.preventDefault();
                        
                        const {error} = await stripe.confirmSetup({
                            elements,
                            confirmParams: {
                                return_url: '${Full_Domain}/v2/stripe/setup-complete',
                            },
                        });
                        
                        if (error) {
                            const messageContainer = document.querySelector('#error-message');
                            messageContainer.textContent = error.message;
                        }
                    });
                </script>

            </body>
            `);
        });

        this.router.get("/setup-complete", async (req, res) =>
        {
            const payment_intent = DebugMode ? req.query.setup_intent as string : req.query.setup_intent_client_secret as string;
            if(!payment_intent)
                return APIError("No payment_intent")(res);

            const intent = await RetriveSetupIntent(payment_intent);
            const customer = await CustomerModel.findOne( { uid: intent.metadata?.customer_uid } );
            if(!customer)
                return APIError("Couldn't find customer")(res);

            let message = "";
            let href = "";
            let status = "";

            switch (intent.status)
            {
                case 'succeeded':
                    message = 'Success!';
                    href = await Company_Website();
                    customer.extra.stripe_setup_intent = true;
                    customer.markModified("extra");
                    await customer.save();
                    status = intent.status;
                    break;
            
                case 'processing':
                    message = "Payment processing. We'll update you when payment is received.";
                    href = await Company_Website();
                    status = intent.status;
                    break;
            
                case 'requires_payment_method':
                    message = 'Failed to process payment details. Please try another payment method.';
                    href = `${Full_Domain}/v2/stripe/setup/${customer.uid}`;
                    status = intent.status;
                    break;
            
                default:
                    message = 'Something went wrong.';
                    href = await Company_Website();
                    break;
            }

            res.send(`
            <html>
                <head>
                    <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap" rel="stylesheet">
                </head>
                <style>
                    body {
                        text-align: center;
                        padding: 40px 0;
                        background: #EBF0F5;
                    }
                    h1 {
                        color: ${status === "requires_payment_method" ? '#B04B4B' : '#88B04B'};
                        font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
                        font-weight: 900;
                        font-size: 40px;
                        margin-bottom: 10px;
                    }
                    i {
                        color: ${status === "requires_payment_method" ? '#B04B4B' : '#9ABC66'};
                        font-size: 100px;
                        line-height: 200px;
                        margin-left:-15px;
                    }
                    .card {
                        background: white;
                        padding: 60px;
                        border-radius: 4px;
                        box-shadow: 0 2px 3px #C8D0D8;
                        display: inline-block;
                        margin: 0 auto;
                    }
                </style>
                <body>
                    <div class="card">
                        <div style="border-radius:200px; height:200px; width:200px; background: #F8FAF5; margin:0 auto;">
                            <i class="checkmark">${status === "requires_payment_method" ? "❌" : "✓"}</i>
                        </div>
                        <h1>${message}</h1> 
                        <a href="${href}">${status === "requires_payment_method" ? "Try again" : "Home"}</a>
                    </div>
                </body>
            </html>
            `);

        });

        this.router.post("/webhook", async (req, res) =>
        {
            const sig = req.headers['stripe-signature'] as string;
            let event;
            try
            {
                // @ts-ignore
                event = Stripe.webhooks.constructEvent(req.rawBody, sig, Stripe_Webhook_Secret);
            } 
            catch (err)
            {
                // @ts-ignore
                return res.status(400).send(`Webhook Error: ${err.message}`);
            }

            switch (event.type)
            {
                case 'payment_intent.succeeded': {
                    const payment_intent = event.data.object as any;
                    const intent = await RetrivePaymentIntent(payment_intent.id);
                    markInvoicePaid(intent);
                    break;
                }

            }
            return res.sendStatus(200);
        });

    }

}