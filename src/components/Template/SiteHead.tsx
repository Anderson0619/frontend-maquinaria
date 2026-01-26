import Head from "next/head";

const SiteHead = () => (
  <Head>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
    />
    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" type="image/x-icon" href="/images/png/logo.png" />
  </Head>
);

export default SiteHead;
