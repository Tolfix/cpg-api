import { IInvoice } from "@ts/interfaces";
import { useState } from "react";
import InvoiceModal from "./Invoice.modal";

export default ({
    invoice
}: {
    invoice: IInvoice
}) =>
{

    const [showModal, setShowModal] = useState(false);

    return (
        <>

            {/* tailwind card */}
            <div key={invoice.id} className={`
                bg-white shadow-lg rounded-lg overflow-hidden m-3
                relative 
                border-l-8
                ${!invoice.paid ? `border-red-400` : `border-green-400`} 
                `}>
                <div className="px-6 py-4">
                    {/* Information about our invoice */}
                    {/* Important: id, ocr, paid, dates */}

                    <div className="flex flex-col justify-between">
                        <div className="flex-1">
                            <div className="text-gray-700 text-sm font-bold">
                                #{invoice.id}

                                <div className="text-gray-700 text-sm font-bold">
                                    OCR: <span className="text-blue-700">{(invoice.dates.invoice_date as string).replaceAll("-", "")+invoice.id}</span>
                                </div>
                            </div>
                        </div>
                        {/* Dates and if paid */}
                        <div>
                            <div className="text-gray-700 text-sm font-bold">
                                <p>
                                    Invoice Date: {(invoice.dates.invoice_date)}
                                </p>
                                <p>
                                    Due Date: {(invoice.dates.due_date)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Buttons to view / pay */}
                    <div className="flex flex-wrap justify-center">
                        <button onClick={(e) => setShowModal(true)} className="bg-blue-600 m-2 px-10 text-white rounded">
                            View
                        </button>

                        <InvoiceModal show={showModal} setShow={setShowModal} invoice={invoice} />

                    </div>

                </div>
            </div>
        
        </>
    )
}