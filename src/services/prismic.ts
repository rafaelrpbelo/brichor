import Prismic from "@prismicio/client";

const apiEndpoint = process.env.PRISMIC_API_ENDPOINT
const accessToken = process.env.PRISMIC_ACCESS_TOKEN

export function getPrismicClient(req?: unknown) {
  return Prismic.client(
    apiEndpoint,
    {
      req,
      accessToken
    }
  )
}
