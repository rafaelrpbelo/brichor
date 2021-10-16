import { GetServerSideProps } from "next"
import Head from "next/head"
import { SubscribeButton } from "../components/SubscribeButton"
import { stripe } from "../services/stripe"

import styles from "./home.module.scss"

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | brichor</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>

          <h1>Hotest news about <span>Web Development</span></h1>

          <p>
            Get access to all the content <br />
            <span>for {product.amount}/month only</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/girl-coding.svg" alt="Girl coding" />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { id, unit_amount } = await stripe.prices.retrieve("price_1Jl2KDCUNbX09kiw2Pg09Gom")

  const product = {
    priceId: id,
    amount: new Intl.NumberFormat("pt-br", {
      style: "currency",
      currency: "USD",
    }).format(unit_amount / 100),
  }

  return {
    props: {
      product
    }
  } 
}
