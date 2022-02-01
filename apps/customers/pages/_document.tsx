import Document, { Html, Head, Main, NextScript } from "next/document";

export default class _Document extends Document
{
    render()
    {
        return (
            <>
                <Html lang="en">
                    <Head>
                        <meta charSet="utf-8" />
                        <link rel="manifest" href="/manifest.json" />
                        <link rel="apple-touch-icon" href="/icon-512x512.png" />
                        <meta name="theme-color" content="#4aa447" />
                    </Head>
                    <body className="bg-[#e3ebee]">
                        <Main />
                        <NextScript />
                        <div id="modal-root"></div>
                    </body>
                </Html>
            </>
        )
    }
} 