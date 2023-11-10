import React, { useRef, useState, useEffect } from 'react';
import LKUITransparentButton from './LKUITransparentButton';
import { Play24Filled, Pause24Filled, FullScreenMaximize24Filled, SpeakerMute24Filled, Speaker224Filled } from '@fluentui/react-icons';

interface VideoPlayerAPI {
  videoPath: string;
}

function LKUIVideoPlayer(api: VideoPlayerAPI) {
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [seekValue, setSeekValue] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>('00:00');
  const [duration, setDuration] = useState<string>('00:00');
  const VideoElement = useRef<HTMLVideoElement>(null);
  const TimeDisplayElement = useRef<HTMLParagraphElement>(null)
  const ProgressBar = useRef<HTMLProgressElement>(null);
  const SeekerElement = useRef<HTMLInputElement & { isSeeking?: boolean }>(null);
  const PlayElement = isPaused ? Play24Filled : Pause24Filled;
  const SpeakerElement = isMuted ? SpeakerMute24Filled : Speaker224Filled;
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
  };  

  useEffect(() => {
    const videoCurrent = VideoElement.current;

    if (videoCurrent) {
      videoCurrent.autoplay = false;

      // Add an event listener to play the video when it has finished loading
      videoCurrent.addEventListener('loadeddata', () => {
        setIsPaused(true);
      });

      // Update progress bar and seeker based on the video's time
      videoCurrent.addEventListener('timeupdate', () => {
        const currentTime = videoCurrent.currentTime;
        const duration = videoCurrent.duration;
      
        // Update progress bar value
        if (ProgressBar.current) {
          ProgressBar.current.value = (currentTime / duration) * 101;
        }
      
        // Update seeker input value
        if (SeekerElement.current) {
          SeekerElement.current.value = currentTime.toString();
        }
      
        // Update display of current time and total duration
        if (TimeDisplayElement.current) {
          TimeDisplayElement.current.innerText = `${formatTime(currentTime)} / ${formatTime(duration)}`;
        }
      });

    return () => {
      // Remove the event listeners when the component unmounts
      if (videoCurrent) {
        videoCurrent.removeEventListener('loadeddata', () => {});
        videoCurrent.removeEventListener('timeupdate', () => {});
      }
    };
  }}, []);
  
  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const seekTime = parseFloat(e.target.value);
    setSeekValue(seekTime);

    // Update progress bar value
    if (ProgressBar.current) {
      ProgressBar.current.value = ((seekTime || 0) / (VideoElement.current?.duration || 1)) * 100;
    }
  }

  function handleSeekEnd() {
    const videoCurrent = VideoElement.current;

    if (videoCurrent) {
      videoCurrent.currentTime = seekValue;
    }
  }
  
  function handlePlayPause() {
    const videoCurrent = VideoElement.current;
  
    if (videoCurrent?.paused === false) {
      videoCurrent?.pause();
      setIsPaused(true);
    } else {
      videoCurrent?.play().then(() => {
        setIsPaused(false);
      }).catch((error) => {
        console.error('Error playing video:', error);
      });
    }
  }
  
  function handleMute() {
    const videoCurrent = VideoElement.current;
  
    if (videoCurrent && videoCurrent.muted === true) {
      videoCurrent.muted = false;
      setIsMuted(false);
    } else if (videoCurrent) {
      videoCurrent.muted = true;
      setIsMuted(true);
    }
  }
  return (
    <div className="lkui-video-player">
      <div className="lkui-video-player-containers">
        <div className="lkui-video-player-controls">
          <div className="lkui-video-player-seekbar">
            <progress ref={ProgressBar} className="lkui-video-progress" max={100}></progress>
            <input
              type="range"
              ref={SeekerElement}
              className="lkui-video-player-seeker"
              value={seekValue}
              min={0}
              max={(VideoElement.current?.duration || 1) || 0}
              step={1}
              onChange={handleSeek}
              onInput={handleSeek}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
            ></input>
          </div>
          <br></br>
          <div className="lkui-video-player-button-controls">
            <div className="lkui-video-player-controls-left">
              <LKUITransparentButton regComponent={PlayElement} onClick={handlePlayPause}></LKUITransparentButton>
              <LKUITransparentButton regComponent={SpeakerElement} onClick={handleMute}></LKUITransparentButton>
              <p className='lkui-video-player-timecode' ref={TimeDisplayElement}>00:00 / 00:00</p>
            </div>
            <div className="lkui-video-player-controls-right">
              <LKUITransparentButton regComponent={FullScreenMaximize24Filled}></LKUITransparentButton>
            </div>
          </div>
        </div>
      </div>
      <video controls={false} className="lkui-video-element" ref={VideoElement} src={api.videoPath} autoPlay={true}></video>
    </div>
  );
}

export default LKUIVideoPlayer;
