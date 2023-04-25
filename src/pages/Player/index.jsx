import { memo } from "react";
import MiniPlayer from "./miniPlayer";
import NormalPlayer from "./normalPlayer";
import useStore from "../../store";

function Player(props) {
  const { playerFullScreen, playerSetFullScreen } = useStore();
  const currentSong = {
    al: {
      picUrl:
        "https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg",
    },
    name: "木偶人",
    ar: [{ name: "薛之谦" }],
  };
  return (
    <div>
      <MiniPlayer
        song={currentSong}
        fullScreen={playerFullScreen}
        toggleFullScreen={playerSetFullScreen}
      ></MiniPlayer>
      <NormalPlayer
        song={currentSong}
        fullScreen={playerFullScreen}
        toggleFullScreen={playerSetFullScreen}
      ></NormalPlayer>
    </div>
  );
}

export default memo(Player);
