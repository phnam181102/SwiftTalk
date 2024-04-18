import { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WaveSurfer from 'wavesurfer.js';

import { FaMicrophone, FaPauseCircle, FaPlay, FaStop, FaTrash } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import { formatTime } from '../../utils/formatTime';
import { toast } from 'react-hot-toast';
import { createFormData } from '../../utils/createFormData';
import {
    useAddAudioMessageMutation,
    useGetMessagesQuery,
    useGetInitialContactQuery,
} from '../../redux/message/messageApi';

function CaptureAudio({ hide, socket }) {
    const { currentChatUser } = useSelector((state) => state.user);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [waveForm, setWaveForm] = useState(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [renderedAudio, setRenderedAudio] = useState(false);

    const audioRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const waveFormRef = useRef(null);

    const [addAudioMessageMutation] = useAddAudioMessageMutation();

    const { refetch } = useGetMessagesQuery({
        from: user?.id,
        to: currentChatUser?.id,
    });

    const { refetch: refetchInitialContact } = useGetInitialContactQuery({ from: user?.id });

    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingDuration((prevDuration) => {
                    setTotalDuration(prevDuration + 1);
                    return prevDuration + 1;
                });
            }, 1000);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isRecording]);

    useEffect(() => {
        const waveSurfer = WaveSurfer.create({
            container: waveFormRef.current,
            waveColor: '#ccc',
            progressColor: '#4a9eff',
            cursorColor: '#7ae3c3',
            barWidth: 2,
            height: 30,
            responsive: true,
        });
        setWaveForm(waveSurfer);

        waveSurfer.on('finish', () => {
            setIsPlaying(false);
        });

        return () => {
            waveSurfer.destroy();
        };
    }, []);

    useEffect(() => {
        if (waveForm) handleStartRecording();
    }, [waveForm]);

    const handleStartRecording = () => {
        setRecordingDuration(0);
        setCurrentPlaybackTime(0);
        setTotalDuration(0);
        setIsRecording(true);
        setRecordedAudio(null);

        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioRef.current.srcObject = stream;

                const chunks = [];
                mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
                    const audioURL = URL.createObjectURL(blob);
                    const audio = new Audio(audioURL);
                    setRecordedAudio(audio);

                    waveForm.load(audioURL);
                };

                mediaRecorder.start();
            })
            .catch((e) => {
                toast.error('Please open allow microphone!');
            });
    };

    const handleStopRecording = () => {
        console.log(mediaRecorderRef.current);
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            waveForm.stop();

            const audioChunks = [];
            mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
                audioChunks.push(event.data);
            });

            mediaRecorderRef.current.addEventListener('stop', () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                const audioFile = new File([audioBlob], 'recording.mp3');
                setRenderedAudio(audioFile);
            });
        }
    };

    useEffect(() => {
        if (recordedAudio) {
            const updatePlaybackTime = () => {
                setCurrentPlaybackTime(recordedAudio.currentTime);
            };
            recordedAudio.addEventListener('timeupdate', updatePlaybackTime);
            return () => {
                recordedAudio.removeEventListener('timeupdate', updatePlaybackTime);
            };
        }
    }, [recordedAudio]);

    const handlePlayRecording = () => {
        if (recordedAudio) {
            waveForm.stop();
            waveForm.play();
            recordedAudio.play();
            setIsPlaying(true);
        }
    };

    const handlePauseRecording = () => {
        waveForm.stop();
        recordedAudio.pause();
        setIsPlaying(false);
    };

    const sendRecording = async () => {
        try {
            const formData = createFormData('audio', renderedAudio);
            const from = user?.id;
            const to = currentChatUser?.id;
            const { data } = await addAudioMessageMutation({ formData, from, to });

            if (data) {
                socket.current.emit('send-msg', {
                    from: user?.id,
                    to: currentChatUser?.id,
                    message: data.message,
                });
                refetch();
                refetchInitialContact();
                hide();
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="flex text-2xl w-full justify-between items-center">
            <div className="pt-1">
                <FaTrash className="text-primary-300" onClick={() => hide()} />
            </div>
            <div className="py-2 text-primary-300 text-lg flex gap-3 justify-center items-center bg-primary-100 rounded-lg">
                {isRecording ? (
                    <div className="text-red-500 animate-pulse w-60 text-center">
                        Recording <span>{recordingDuration}s</span>
                    </div>
                ) : (
                    <div>
                        {recordedAudio && (
                            <>
                                {!isPlaying ? (
                                    <FaPlay onClick={handlePlayRecording} />
                                ) : (
                                    <FaStop onClick={handlePauseRecording} />
                                )}
                            </>
                        )}
                    </div>
                )}
                <div className="w-60" ref={waveFormRef} hidden={isRecording} />
                {recordedAudio && isPlaying && <span>{formatTime(currentPlaybackTime)}</span>}
                {recordedAudio && !isPlaying && <span>{formatTime(totalDuration)}</span>}
                <audio ref={audioRef} hidden />
            </div>

            <div className="mr-4">
                {!isRecording ? (
                    <FaMicrophone className="text-red-500" onClick={handleStartRecording} />
                ) : (
                    <FaPauseCircle className="text-red-500" onClick={handleStopRecording} />
                )}
            </div>
            <div>
                <IoSend
                    className="text-primary-300 cursor-pointer text-2xl hover:text-[#5f61ed]"
                    title="Send Message"
                    onClick={sendRecording}
                />
            </div>
        </div>
    );
}

export default CaptureAudio;
