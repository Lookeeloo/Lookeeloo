import React, { useRef, useState } from 'react';
import LKUITransparentButton from './LKUITransparentButton';
import { Play24Filled, Pause24Filled } from '@fluentui/react-icons';

interface VideoPlayerAPI {
  videoPath: string;
}

function LKUIVideoPlayer(api: VideoPlayerAPI) {
    const [isPaused, setIsPaused] = useState<boolean>(true);
    const TogglePlayPause = useRef<HTMLDivElement>(null)
    const VideoElement = useRef<HTMLVideoElement>(null)
    const ProgressBar = useRef<HTMLProgressElement>(null)
    const SeekerElement = useRef<HTMLInputElement>(null)
    const PlayElement = isPaused ? Play24Filled : Pause24Filled;
    function handlePlayPause() {
        if (VideoElement.current?.paused === false) {
          VideoElement.current?.pause();
          setIsPaused(true);
        } else {
          VideoElement.current?.play();
          setIsPaused(false);
        }
      }
    
    return (
        <div className='lkui-video-player'>
        <div className='lkui-video-player-containers'>
            <div className='lkui-video-player-controls'>
                <div className='lkui-video-player-seekbar'>
                    <progress ref={ProgressBar} className='lkui-video-progress'></progress>
                    <input type='range' ref={SeekerElement} className='lkui-video-player-seeker' value={0} min={0} max={288} step={1}></input>
                </div>
                <LKUITransparentButton ref={TogglePlayPause} regComponent={PlayElement} onClick={handlePlayPause}></LKUITransparentButton>
            </div>
        </div>
        <video controls={false} className='lkui-video-element' ref={VideoElement} src={api.videoPath} autoPlay={true}></video>
        </div>
    );
}
export default LKUIVideoPlayer;
