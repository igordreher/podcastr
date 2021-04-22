import { createContext } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    durationAsString: string;
    url: string;
};

type PlayerContextData = {
    episodeList: Array<Episode>;
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (episode: Episode) => void;
    setIsPlaying: (state: boolean) => void;
};

export const PlayerContext = createContext({} as PlayerContextData);