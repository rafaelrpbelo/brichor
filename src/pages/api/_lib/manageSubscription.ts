import { query as q } from "faunadb";

import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

export async function saveSubscription (
  subscriptionId: string,
  customerId: string,
  createEntry: boolean = false
) {
  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(q.Match(
        q.Index("users_by_stripe_customer_id"),
        customerId
      ))
    )
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
  }

  if (createEntry) {
    await fauna.query(
      q.Create(
        q.Collection("subscriptions"),
        { data: subscriptionData }
      )
    )
  }
  else {
    await fauna.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(q.Match(q.Index("subscriptions_by_id"), subscriptionId))
        ),
        { data: subscriptionData }
      )
    )
  }
}
