import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";

class ExtendedDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700&display=optional"
            rel="stylesheet"
          />
        </Head>
        <body className="bg-white text-gray-900 bg-green dark:text-white">
          <div className="bg-white-100 bg-white-100 min-h-screen">
            <Main />
          </div>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default ExtendedDocument;

export async function getServerSideProps(context) {
  const initialProps = await Document.getInitialProps(context);
  return { ...initialProps };
}
