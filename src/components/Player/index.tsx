import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';
import styles from './styles.module.scss';

export function Player() {
    const player = usePlayer();
    const audioRef = useRef<HTMLAudioElement>(null);
    const episode = player.episodeList[player.currentEpisodeIndex];

    const [progress, setProgress] = useState(0);

    function setupProgressListener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        });
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if (player.hasNextEpisode)
            player.playNext();
        else
            player.clearPlaylist();
    }

    useEffect(() => {
        if (!audioRef.current)
            return;

        if (player.isPlaying)
            audioRef.current.play();
        else
            audioRef.current.pause();
    }, [player.isPlaying]);

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                    <div className={styles.emptyPlayer}>
                        <strong>Selecione um podcast para ouvir</strong>
                    </div>
                )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress} >
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderBlockColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                                <div className={styles.emptySlider} />
                            )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        autoPlay
                        loop={player.isLooping}
                        onPlay={() => player.setIsPlaying(true)}
                        onPause={() => player.setIsPlaying(false)}
                        onEnded={handleEpisodeEnded}
                        onLoadedMetadata={setupProgressListener}
                    />
                )}

                <div className={styles.buttons}>
                    <button type="button"
                        className={player.isShuffling ? styles.isActive : ''}
                        disabled={!episode || player.episodeList.length === 1}
                        onClick={player.toggleShuffle}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type="button"
                        disabled={!episode || !player.hasPreviousEpisode}
                        onClick={player.playPrevious}
                    >
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>
                    <button type="button"
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={player.togglePlay}
                    >
                        {player.isPlaying
                            ? <img src="/pause.svg" alt="Tocar" />
                            : <img src="/play.svg" alt="Tocar" />}
                    </button>
                    <button type="button"
                        disabled={!episode || !player.hasNextEpisode}
                        onClick={player.playNext}
                    >
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>
                    <button type="button"
                        className={player.isLooping ? styles.isActive : ''}
                        disabled={!episode} onClick={player.toggleLoop}
                    >
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div >
    );
}