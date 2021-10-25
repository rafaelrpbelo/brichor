import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { RichText } from "prismic-dom";

import { getPrismicClient } from "../../../services/prismic"

import styles from "../post.module.scss"
import React, { useEffect } from "react";

type Post = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface PostPreviewProps {
  post: Post
}

export default function PostPreview({ post: { slug, title, content, updatedAt } }: PostPreviewProps) {
  const [session] = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${slug}`)
    }
  }, [session])

  return (
    <>
      <Head>
        <title>{title} | Brichor</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{title}</h1>
          <time>{updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{__html: content}}
          />

          <div className={styles.continueReading}>
            Do you want to read more?

            <Link href="#">
              <a>Subscribe now</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params

  const prismic = getPrismicClient()
  const response = await prismic.getByUID("po", String(slug), {})
  const MAX_PARAGRAPHS = 2

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, MAX_PARAGRAPHS)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  }

  return {
    props: {
      post,
    },
    redirect: 60 * 30, // 30 minutes
  }
}
