import { useParams } from "react-router-dom"
import LKUIVideoPlayer from "../components/LKUIVideoPlayer";
function Player() {
    const {id} = useParams<{id: string}>();
    if (id == null || id == '') {
        console.error('Failed to update params')
    }
    return (
        <div className="lkui-player-page">
            <LKUIVideoPlayer videoPath="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"></LKUIVideoPlayer>
            <h2>This is a video. The ID is {id}</h2>
        </div>
    )
}
export default Player