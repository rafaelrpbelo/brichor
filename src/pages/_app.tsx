import { AppProps } from "next/app";
import Head from "next/head"

import "../styles/global.scss"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>brichor</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
