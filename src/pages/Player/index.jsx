import { memo } from "react";
import MiniPlayer from "./miniPlayer";
import NormalPlayer from "./normalPlayer";
import useStore from "../../store";

function Player(props) {
  const {
    playerFullScreen,
    playerSetFullScreen,
    playerPlaying,
    playerSetPlaying,
  } = useStore();
  const currentSong = {
    al: {
      picUrl:
        "https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg",
    },
    name: "木偶人",
    ar: [{ name: "薛之谦" }],
  };

  const clickPlaying = (e, playing) => {
    e.stopPropagation();
    playerSetPlaying(playing);
  };

  return (
    <div>
      <MiniPlayer
        song={currentSong}
        percent={0.2}
        fullScreen={playerFullScreen}
        playing={playerPlaying}
        toggleFullScreen={playerSetFullScreen}
        clickPlaying={clickPlaying}
      ></MiniPlayer>
      <NormalPlayer
        song={currentSong}
        fullScreen={playerFullScreen}
        playing={playerPlaying}
        toggleFullScreen={playerSetFullScreen}
        clickPlaying={clickPlaying}
      ></NormalPlayer>
    </div>
  );
}

export default memo(Player);
