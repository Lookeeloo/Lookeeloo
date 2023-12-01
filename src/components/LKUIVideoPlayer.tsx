import React, { useRef, useState, useEffect } from 'react';
import LKUITransparentButton from './LKUITransparentButton';
import srtParser2 from 'srt-parser-2';
import {
  Play24Filled,
  Pause24Filled,
  FullScreenMaximize24Filled,
  SpeakerMute24Filled,
  Speaker224Filled,
  SkipBack1024Filled,
  SkipForward1024Filled,
} from '@fluentui/react-icons';

interface VideoPlayerAPI {
  videoPath: string;
  captionsPath?: string;
  width?: number;
  height?: number;
}

interface Subtitle {
  start: number;
  end: number;
  text: string;
}

let timeout: any;

function LKUIVideoPlayer(api: VideoPlayerAPI) {
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [seekValue, setSeekValue] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>('00:00');
  const [intCurTime, setIntCurTime] = useState<number>(0);
  const [previousCurrentTime, setPreviousCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<string>('00:00');
  const currentTimeRef = useRef<number>(0);
  const [captions, setCaptions] = useState<Subtitle[]>([]);
  const VideoElement = useRef<HTMLVideoElement>(null);
  const TimeDisplayElement = useRef<HTMLParagraphElement>(null);
  const CaptionsContainer = useRef<HTMLDivElement>(null);
  const ProgressBar = useRef<HTMLProgressElement>(null);
  const ControlBar = useRef<HTMLDivElement>(null);
  const Player = useRef<HTMLDivElement>(null);
  const Spinner = useRef<HTMLDivElement>(null);
  const SeekerElement = useRef<HTMLInputElement & { isSeeking?: boolean }>(null);
  const PlayElement = isPaused ? Play24Filled : Pause24Filled;
  const SpeakerElement = isMuted ? SpeakerMute24Filled : Speaker224Filled;

  const handleBuffering = () => {
    Spinner.current!.style.display = 'flex';
  };

  const handlePlaying = () => {
    Spinner.current!.style.display = 'none';
  };
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    const videoCurrent = VideoElement.current!;

    if (Player.current) {
      const playerContainer = Player.current;

      if (api.height != null) {
        const playerHeight = playerContainer.offsetHeight;
        const playerWidth = playerHeight * (videoCurrent.width / videoCurrent.height);
        playerContainer.style.width = `${playerWidth}px`;
      } else if (api.width != null) {
        const playerWidth = playerContainer.offsetWidth;
        const playerHeight = playerWidth * (videoCurrent.height / videoCurrent.width);
        playerContainer.style.height = `${playerHeight}px`;
      }
    }
  }, []);

  useEffect(() => {
    const videoCurrent = VideoElement.current!;
    if (videoCurrent) {
      videoCurrent.autoplay = false;

      videoCurrent.addEventListener('loadeddata', () => {
        const duration = videoCurrent.duration;
        if (TimeDisplayElement.current) {
          TimeDisplayElement.current.innerText = `00:00 / ${formatTime(duration)}`;
        }
        setIsPaused(true);
      });

      videoCurrent.addEventListener('timeupdate', () => {
        const currentTime = videoCurrent.currentTime;
        const duration = videoCurrent.duration;

        if (ProgressBar.current) {
          ProgressBar.current.value = (currentTime / duration) * 100;
        }

        if (SeekerElement.current) {
          SeekerElement.current.value = Math.floor(currentTime).toString();
        }

        if (TimeDisplayElement.current) {
          TimeDisplayElement.current.innerText = `${formatTime(currentTime)} / ${formatTime(duration)}`;
        }
        currentTimeRef.current! = currentTime;
      });

      return () => {
        if (videoCurrent) {
          videoCurrent.removeEventListener('loadeddata', () => {});
          videoCurrent.removeEventListener('timeupdate', () => {});
        }
      };
    }
  }, []);

  const parseSRT = (srtData: string): Subtitle[] => {
    const srtParser = new srtParser2();
    const parsedData = srtParser.fromSrt(srtData);

    return parsedData.map((subtitle: any) => ({
      start: subtitle.startSeconds,
      end: subtitle.endSeconds,
      text: subtitle.text,
    }));
  };

  useEffect(() => {
    if (api.captionsPath) {
      fetch(api.captionsPath)
        .then((response) => response.text())
        .then((srtData) => {
          const parsedCaptions = parseSRT(srtData);
          setCaptions(parsedCaptions);
        })
        .catch((error) => {
          console.error('Error loading captions:', error);
        });
    }
  }, [api.captionsPath]);

  useEffect(() => {
    const captionsContainer = CaptionsContainer.current;

    if (captionsContainer) {
      const updateCaptionsDisplay = () => {
        const currentCaption = captions.find(
          (caption) =>
            currentTimeRef.current! >= caption.start && currentTimeRef.current! <= caption.end
        );

        captionsContainer.innerText = currentCaption ? currentCaption.text : '';
      };

      updateCaptionsDisplay(); // Initial display

      const intervalId = setInterval(updateCaptionsDisplay, 500); // Update every 500ms

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [captions]);

  const SEEK_BUFFER = 0.1;

  function handleSeek(e: any) {
    const seekTime = parseFloat(e.target.value);
    const roundedSeekTime = Math.round(seekTime * 100) / 100;
    setSeekValue(roundedSeekTime);
  }

  function handleSeekEnd() {
    const videoCurrent = VideoElement.current;

    if (videoCurrent) {
      videoCurrent.currentTime = seekValue;
      setTimeout(() => {
        if (Math.abs(videoCurrent.currentTime - seekValue) <= SEEK_BUFFER) {
          videoCurrent.removeEventListener('timeupdate', () => {});
        }
      }, 500);
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

  function handleFullScreen() {
    const playerControls = ControlBar.current!;
    if (document.fullscreenElement) {
      document.exitFullscreen();
      Player.current?.classList.remove('lkui-fullscreen');
      playerControls.style.display = 'flex';
    } else {
      Player.current?.requestFullscreen();
      playerControls.style.display = 'none';
      Player.current?.classList.add('lkui-fullscreen');
    }
  }

  if (api.width === 0 || api.width === null) {
    api.width = 800;
  }

  function handleMouseMove() {
    const playerControls = ControlBar.current!;

    if (document.fullscreenElement) {
      if (playerControls) {
        playerControls.style.display = 'flex';
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          if (playerControls) {
            playerControls.style.display = 'none';
          }
        }, 4000);
      }
    } else {
      if (playerControls) {
        playerControls.style.display = 'flex';
      }
      clearTimeout(timeout);
    }
  }

  enum QuickSeekDirection {
    Back10,
    Forward10,
  }

  function handleQuickSeek(direction: QuickSeekDirection) {
    if (VideoElement.current) {
      const currentTime = VideoElement.current.currentTime;

      if (currentTime !== undefined) {
        switch (direction) {
          case QuickSeekDirection.Back10:
            VideoElement.current.currentTime = currentTime - 10;
            break;
          case QuickSeekDirection.Forward10:
            VideoElement.current.currentTime = currentTime + 10;
            break;
        }
      }
    }
  }

  document.onkeydown = function (e) {
    handleMouseMove();
    e.preventDefault();
    if (e.key === 'p' || e.key === ' ') {
      handlePlayPause();
    } else if (e.key === 'm') {
      handleMute();
    } else if (e.key === 'ArrowLeft') {
      handleQuickSeek(QuickSeekDirection.Back10);
    } else if (e.key === 'ArrowRight') {
      handleQuickSeek(QuickSeekDirection.Forward10);
    } else if (e.key === 'f') {
      handleFullScreen();
    }
  };

  return (
    <div className="lkui-video-player" ref={Player} style={{ width: api.width, height: api.height }} onMouseMove={handleMouseMove}>
      <div className="lkui-video-player-containers">
        <div className="lkui-video-captions" ref={CaptionsContainer}></div>
        <div className="lkui-video-player-controls" ref={ControlBar}>
          <div className="lkui-video-player-seekbar">
            <progress ref={ProgressBar} className="lkui-video-progress" max={100}></progress>
            <input
              type="range"
              ref={SeekerElement}
              className="lkui-video-player-seeker"
              value={seekValue}
              min={0}
              max={(VideoElement.current?.duration || 1) || 0}
              step={0.000001}
              onChange={handleSeek}
              onInput={handleSeek}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
            ></input>
          </div>
          <br></br>
          <div className="lkui-video-player-button-controls">
            <div className="lkui-video-player-controls-left">
              <LKUITransparentButton className="lkui-play-button" regComponent={PlayElement} onClick={handlePlayPause} title="Play (p)"></LKUITransparentButton>
              <LKUITransparentButton className="lkui-quick-seek-left" regComponent={SkipBack1024Filled} onClick={() => handleQuickSeek(QuickSeekDirection.Back10)} title="Rewind 10 (<-)"></LKUITransparentButton>
              <LKUITransparentButton className="lkui-quick-seek-right" regComponent={SkipForward1024Filled} onClick={() => handleQuickSeek(QuickSeekDirection.Forward10)} title="Forward 10 (->)"></LKUITransparentButton>
              <LKUITransparentButton className="lkui-mute-button" regComponent={SpeakerElement} onClick={handleMute} title="Mute (m)"></LKUITransparentButton>
              <p className="lkui-video-player-timecode" ref={TimeDisplayElement}>
                00:00 / 00:00
              </p>
            </div>
            <div className="lkui-video-player-controls-right">
              <LKUITransparentButton regComponent={FullScreenMaximize24Filled} onClick={handleFullScreen} title="Fullscreen (f)"></LKUITransparentButton>
            </div>
          </div>
        </div>
      </div>
      <div className="lkui-spinner-container" ref={Spinner}>
        <div className="lkui-spinner"></div>
      </div>
      <video controls={false} className="lkui-video-element" ref={VideoElement} src={api.videoPath} autoPlay={true} onWaiting={handleBuffering} onPlaying={handlePlaying}></video>
    </div>
  );
}

export default LKUIVideoPlayer;
