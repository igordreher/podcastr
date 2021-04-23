import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Array<Episode>;
    currentEpisodeIndex: number;
    isPlaying: boolean;
    hasNextEpisode: boolean;
    hasPreviousEpisode: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    playNext: () => void;
    playPrevious: () => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    setIsPlaying: (state: boolean) => void;
    clearPlaylist: () => void;
};

const PlayerContext = createContext({} as PlayerContextData);

export const usePlayer = () => { return useContext(PlayerContext); };

type PlayerContextProviderProps = {
    children: ReactNode;
};

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    const hasNextEpisode = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;
    const hasPreviousEpisode = currentEpisodeIndex > 0;

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function toggleLoop() {
        setIsLooping(!isLooping);
    }

    function toggleShuffle() {
        setIsShuffling(!isShuffling);
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function playNext() {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        } else if (hasNextEpisode)
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }

    function playPrevious() {
        if (!hasPreviousEpisode)
            return;

        setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }

    function clearPlaylist() {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    return (
        <PlayerContext.Provider
            value={{
                episodeList, currentEpisodeIndex, play, playList, playNext, playPrevious,
                isPlaying, setIsPlaying, hasNextEpisode, hasPreviousEpisode, clearPlaylist,
                isLooping, toggleLoop, togglePlay, isShuffling, toggleShuffle
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}
