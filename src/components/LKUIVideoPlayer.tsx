import React, { useRef } from 'react';

interface VideoPlayerAPI {
  videoPath: string;
}

function LKUIVideoPlayer(api: VideoPlayerAPI) {
  return (
    <div className='lkui-video-player'>
      <div className='lkui-video-player-containers'>
        <div className='lkui-video-player-controls'>
          check
        </div>
      </div>
      <video controls={false} className='lkui-video-element' src={api.videoPath} autoPlay={true}></video>
    </div>
  );
}
export default LKUIVideoPlayer;
