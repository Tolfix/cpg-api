import { IInvoice } from "@cpg/Interfaces/Invoice.interface";
import { Modal } from "../Modal";

/**
 * 
 * @stackoverflow https://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen
 */
export const popupCenter = ({url, title, w, h}: {
    url: string,
    title: string,
    w: number,
    h: number
}) =>
{
    // Fixes dual-screen position                             Most browsers      Firefox
    const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY;

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = (height - h) / 2 / systemZoom + dualScreenTop;
    window.open(url, title, 
      `
        scrollbars=yes,
        width=${w / systemZoom}, 
        height=${h / systemZoom}, 
        top=${top}, 
        left=${left}
      `
    )
}

export default ({
    invoice,
    show,
    setShow
}: {
    invoice: IInvoice,
    show: boolean,
    setShow: (show: boolean) => void
}) =>
{
    return (
        <>
            <Modal
                title={`Invoice #${invoice.id}`}
                onClose={() => setShow(false)}
                show={show}
            >
                <div className="flex flex-wrap">
                    {invoice.payment_method.match(/bank|swish|manual/i) && (
                        <div className="w-full">
                            <div className="text-gray-700 text-sm font-bold">
                                OCR: <span className="text-blue-700">{(invoice.dates.invoice_date as string).replaceAll("-", "")+invoice.id}</span>
                            </div>
                        </div>
                    )}
                    <div className="w-full">
                        <div className="text-gray-700 text-xl font-bold">
                            <p>
                                Invoice Date: <input type="date" name="" id="" value={(invoice.dates.invoice_date as string)} />
                            </p>
                            <p>
                                Due Date: <input type="date" name="" id="" value={(invoice.dates.due_date as string)} />
                            </p>
                            <p>
                                Paid: {invoice.paid ? (
                                    <span className="text-green-500">
                                        Yes
                                    </span>

                                ) : (
                                    <span className="text-red-500">
                                        No
                                    </span>
                                )}
                            </p>
                            <p>
                                Notified: {invoice.notified ? (
                                    <span className="text-green-500">
                                        Yes
                                    </span>

                                ) : (
                                    <span className="text-red-500">
                                        No
                                    </span>
                                )}
                            </p>
                            <p>
                                Amount: {invoice.amount} SEK
                            </p>
                            <p>
                                Tax Due: {invoice.tax_rate}%
                            </p>
                            <p>
                                Total: {(invoice.amount)+(invoice.amount*invoice.tax_rate/100)} SEK
                            </p>
                            <p>
                                Payment Method: {invoice.payment_method}
                            </p>
                        </div>
                    </div>
                    {/* Pay button */}
                    {(!invoice.paid && invoice.payment_method.match(/paypal|credit_card/i)) && (
                        <>
                            <div className="flex flex-wrap justify-center">
                                <button
                                    onClick={() => popupCenter({
                                        url: `${process.env.NEXT_PUBLIC_CPG_DOMAIN}/v2/${
                                            invoice.payment_method === "paypal" ? "paypal" : "stripe"
                                        }/pay/${invoice.uid}`,
                                        title: "Pay",
                                        w: 600,
                                        h: 900
                                    })}
                                
                                    className="bg-blue-600 m-2 px-28 text-white rounded"
                                >
                                    Pay
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </>
    )
}