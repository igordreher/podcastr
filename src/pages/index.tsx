import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../services/api';
import convertDurationToTimeString from '../utils/convertDurationToTimeString';

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

type HomeProps = {
  episodes: Array<Episode>;
};

export default function Home(props: HomeProps) {
  return (
    <div>{JSON.stringify(props.episodes)}</div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map((episode) => {
    const { file, published_at, ...new_episode } = episode;
    return {
      ...new_episode, url: episode.file.url,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: episode.file.duration,
      durationAsString: convertDurationToTimeString(episode.file.duration)
    };
  });

  return {
    props: {
      episodes
    },
    revalidate: 60 * 60 * 8
  };
};