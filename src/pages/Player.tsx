import { useParams } from "react-router-dom"
function Player() {
    const {id} = useParams<{id: string}>();
    if (id == null || id == '') {
        console.error('Failed to update params')
    }
    return (
        <div className="lkui-player-page">
            <h2>This is a video. The ID is {id}</h2>
        </div>
    )
}
export default Player