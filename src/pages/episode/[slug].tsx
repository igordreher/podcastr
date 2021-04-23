import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { usePlayer } from '../../contexts/PlayerContext';
import api from '../../services/api';
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';

type Episode = {
  id: string,
  title: string,
  members: string,
  publishedAt: string,
  thumbnail: string,
  description: string,
  url: string,
  duration: number,
  durationAsString: string;
};

type EpisodeProps = {
  episode: Episode;
};


export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer();

  return (
    <div className={styles.episodeContainer}>

      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>

      <div className={styles.episode}>
        <div className={styles.thumbnailContainer}>
          <Link href="/">
            <button type="button">
              <img src="/arrow-left.svg" alt="Voltar" />
            </button>
          </Link>
          <Image
            width={700}
            height={160}
            src={episode.thumbnail}
            objectFit="cover"
          />

          <button type="button" onClick={() => play(episode)}>
            <img src="/play.svg" alt="Tocar episódio" />
          </button>
        </div>

        <header>
          <h1>{episode.title}</h1>
          <span>{episode.members}</span>
          <span>{episode.publishedAt}</span>
          <span>{episode.durationAsString}</span>
        </header>

        <div className={styles.description}
          dangerouslySetInnerHTML={{ __html: episode.description }} />
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    };
  });

  return {
    paths,
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const { data } = await api.get(`/episodes/${slug}`);

  const { file, published_at, ...rest } = data;
  const episode = {
    ...rest, url: file.url,
    publishedAt: format(parseISO(published_at), 'd MMM yy', { locale: ptBR }),
    duration: file.duration,
    durationAsString: convertDurationToTimeString(file.duration)
  };

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24
  };
};