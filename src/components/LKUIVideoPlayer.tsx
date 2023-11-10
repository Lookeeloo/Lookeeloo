import React, { useRef, useState, useEffect } from 'react';
import LKUITransparentButton from './LKUITransparentButton';
import { Play24Filled, Pause24Filled, FullScreenMaximize24Filled, SpeakerMute24Filled, Speaker224Filled } from '@fluentui/react-icons';

interface VideoPlayerAPI {
  videoPath: string;
}

function LKUIVideoPlayer(api: VideoPlayerAPI) {
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const VideoElement = useRef<HTMLVideoElement>(null);
  const ProgressBar = useRef<HTMLProgressElement>(null);
  const SeekerElement = useRef<HTMLInputElement>(null);
  const PlayElement = isPaused ? Play24Filled : Pause24Filled;
  const SpeakerElement = isMuted ? SpeakerMute24Filled : Speaker224Filled;

  useEffect(() => {
    const videoCurrent = VideoElement.current;

    if (videoCurrent) {
      videoCurrent.autoplay = false;

      // Add an event listener to play the video when it has finished loading
      videoCurrent.addEventListener('loadeddata', () => {
        videoCurrent.play();
        setIsPaused(false);
      });
    }

    return () => {
      // Remove the event listener when the component unmounts
      if (videoCurrent) {
        videoCurrent.removeEventListener('loadeddata', () => {});
      }
    };
  }, []);

  function handlePlayPause() {
    const videoCurrent = VideoElement.current;

    if (videoCurrent?.paused === false) {
      videoCurrent?.pause();
      setIsPaused(true);
    } else {
      videoCurrent?.play();
      setIsPaused(false);
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

  if (VideoElement.current?.ended === true) {
    setIsPaused(true);
  }

  return (
    <div className="lkui-video-player">
      <div className="lkui-video-player-containers">
        <div className="lkui-video-player-controls">
          <div className="lkui-video-player-seekbar">
            <progress ref={ProgressBar} className="lkui-video-progress"></progress>
            <input
              type="range"
              ref={SeekerElement}
              className="lkui-video-player-seeker"
              value={0}
              min={0}
              max={288}
              step={1}
            ></input>
          </div>
          <br></br>
          <div className="lkui-video-player-button-controls">
            <div className="lkui-video-player-controls-left">
              <LKUITransparentButton regComponent={PlayElement} onClick={handlePlayPause}></LKUITransparentButton>
              <LKUITransparentButton regComponent={SpeakerElement} onClick={handleMute}></LKUITransparentButton>
            </div>
            <div className="lkui-video-player-controls-right">
              <LKUITransparentButton regComponent={FullScreenMaximize24Filled}></LKUITransparentButton>
            </div>
          </div>
        </div>
      </div>
      <video controls={false} className="lkui-video-element" ref={VideoElement} src={api.videoPath}></video>
    </div>
  );
}

export default LKUIVideoPlayer;
