import { signIn, useSession } from "next-auth/client";

import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";

import styles from "./styles.module.scss"

interface SubscribeButtonProps {
  priceId: string;
}

interface SubscriptionResponseData {
  data: {
    sessionId: string;
  }
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn("github")
      return;
    }

    try {
      const response: SubscriptionResponseData = await api.post("/subscribe")

      const { sessionId } = response.data;

      const stripeJs = await getStripeJs()

      await stripeJs.redirectToCheckout({ sessionId })
    }
    catch (err) {
      console.error(err)
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}
