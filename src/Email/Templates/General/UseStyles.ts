import style from "../CSS/Style"
import Footer from "./Footer"
import Header from "./Header"

export default async (s: string) =>
{
    return `
    <html>
        <head>
            <style type="text/css">
                ${style}
            </style>
        </head>
        <body>
            <div style="
                background-color: #F4F4F4;
                padding: 10px;
                margin: 10px auto;
                max-width: 650px;
                width: auto;
                line-height: 20px;"
            >
                ${await Header()}
                <div style="
                    background-color: #FFF;
                    padding: 20px; }
                        content p:last-child {
                        margin: 0;"
                >
                    ${s}
                </div>
                ${Footer}
            </div>
        </body>
    </html> 
    `
}