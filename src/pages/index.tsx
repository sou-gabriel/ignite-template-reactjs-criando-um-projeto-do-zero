import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import { useState } from 'react';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [linkNextPage, setLinkNextPage] = useState(postsPagination.next_page);
  const [posts, setPosts] = useState(postsPagination.results);

  const handleLoadNewPosts = (): void => {
    fetch(linkNextPage)
      .then(response => response.json())
      .then(({ next_page, results }) => {
        setLinkNextPage(next_page);
        setPosts(prevPosts => prevPosts.concat(results));
      });
  };

  return (
    <>
      <Head>
        <title>Home | spacetraveling.</title>
      </Head>

      <main>
        <div className={commonStyles.container}>
          <ul className={styles.list}>
            {posts.map(post => (
              <li className={styles.listItem} key={post.uid}>
                <Link href={`/post/${post.uid}`}>
                  <a>
                    <h2 className={styles.title}>{post.data.title}</h2>
                    <p className={styles.description}>{post.data.subtitle}</p>
                    <div className={styles.row}>
                      <time className={styles.time}>
                        <FiCalendar />
                        <span>
                          {format(
                            new Date(post.first_publication_date),
                            'dd MMM yyyy'
                          )}
                        </span>
                      </time>
                      <div className={styles.author}>
                        <FiUser />
                        <span>{post.data.author}</span>
                      </div>
                    </div>
                  </a>
                </Link>
              </li>
            ))}
          </ul>

          {linkNextPage && (
            <button
              type="button"
              className={styles.loadNewPostsButton}
              onClick={handleLoadNewPosts}
            >
              Carregar mais posts
            </button>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    {
      fetch: [],
      pageSize: 1,
    }
  );

  const posts = postsResponse.results.map(
    ({ uid, first_publication_date, data }) => {
      return {
        uid,
        first_publication_date,
        data: {
          title: data.title,
          subtitle: data.subtitle,
          author: data.author,
        },
      };
    }
  );

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
    },
  };
};
