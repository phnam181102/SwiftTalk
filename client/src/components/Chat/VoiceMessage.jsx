import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import WaveSurfer from 'wavesurfer.js';

import { FaPlay, FaStop } from 'react-icons/fa';

import { HOST } from '@/utils/ApiRoutes';
import Avatar from '../common/Avatar';
import { formatTime } from '../../utils/formatTime';
import { calculateTime } from '../../utils/CalculateTime';
import MessageStatus from '../common/MessageStatus';

function VoiceMessage({ message }) {
    const { currentChatUser } = useSelector((state) => state.user);
    const { user } = useSelector((state) => state.auth);

    const [audioMessage, setAudioMessage] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);

    const waveFormRef = useRef(null);
    const waveForm = useRef(null);

    useEffect(() => {
        if (waveForm.current === null) {
            waveForm.current = WaveSurfer.create({
                container: waveFormRef.current,
                waveColor: '#ccc',
                progressColor: '#4a9eff',
                cursorColor: '#7ae3c3',
                barWidth: 2,
                height: 30,
                responsive: true,
            });

            waveForm.current.on('finish', () => {
                setIsPlaying(false);
            });
            console.log('1', waveForm.current);
        }

        return () => {
            waveForm.current.destroy();
        };
    }, []);

    useEffect(() => {
        const audioUrl = `${HOST}/${message.message}`;
        const audio = new Audio(audioUrl);
        setAudioMessage(audio);
        if (waveForm.current) {
            console.log('2', waveForm.current);
            // waveForm.current?.load(audioUrl);
            waveForm.current.on('ready', () => {
                setTotalDuration(waveForm.current.getDuration());
            });
        } else {
            console.error('waveForm.current is null');
        }
    }, [message.message]);

    useEffect(() => {
        if (audioMessage) {
            const updatePlaybackTime = () => {
                setCurrentPlaybackTime(audioMessage.currentTime);
            };
            audioMessage.addEventListener('timeupdate', updatePlaybackTime);
            return () => {
                audioMessage.removeEventListener('timeupdate', updatePlaybackTime);
            };
        }
    }, [audioMessage]);

    const handlePlayAudio = () => {
        if (audioMessage) {
            audioMessage.play();
            setIsPlaying(true);
        }
    };

    const handlePauseAudio = () => {
        audioMessage.pause();
        setIsPlaying(false);
    };

    return (
        <div
            className={`flex items-center p-4 gap-5 rounded-md ${
                message.senderId === currentChatUser.id ? 'bg-primary-100 text-dark' : 'bg-primary-300 text-light'
            }`}
        >
            <div className="cursor-pointer text-xl">
                {!isPlaying ? <FaPlay onClick={handlePlayAudio} /> : <FaStop onClick={handlePauseAudio} />}
            </div>
            <div className="relative">
                <div className="w-60" ref={waveFormRef} />
                <div className="text-light text-[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full">
                    <span>{formatTime(isPlaying ? currentPlaybackTime : totalDuration)}</span>
                    <div className="flex gap-1">
                        <span>{calculateTime(message.createdAt)}</span>
                        {message.senderId === user.id && <MessageStatus messageStatus={message.messageStatus} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VoiceMessage;
