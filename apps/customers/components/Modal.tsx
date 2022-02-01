import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

export const Modal = (
    { show, onClose, children, title }: {
        show: boolean;
        onClose: () => void;
        children: React.ReactNode;
        title: string;
    }
) =>
{
    const [isBrowser, setIsBrowser] = useState(false);
  
    useEffect(() =>
    {
        setIsBrowser(true);
    }, []);

    const handleCloseClick = (e: { preventDefault: () => void; }) =>
    {
        e.preventDefault();
        onClose();
    };

    const modalContent = show ? (
        <>
            {/* Tailwind modal */}
            <div className="fixed inset-0 z-50 overflow-hidden">
                <div className="absolute inset-0 bg-gray-500 opacity-75 blur-lg"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm">
                        <div className="flex justify-between items-center pb-3">
                            <h2 className="text-2xl font-bold">{title}</h2>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={handleCloseClick}>
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    ) : null;

    if (isBrowser)
    {
        return ReactDOM.createPortal(
            modalContent,
            document.getElementById("modal-root") as Element
        );
    }
    else
    {
        return null;
    }
};