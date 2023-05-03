import { memo } from "react";
import MiniPlayer from "./miniPlayer";
import NormalPlayer from "./normalPlayer";
import useStore from "../../store";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { getSongUrl, isEmptyObject } from "../../utils";

function Player(props) {
  const {
    playerFullScreen,
    playerSetFullScreen,
    playerPlaying,
    playerSetPlaying,
    playerCurrentIndex,
    playerSetCurrentIndex,
    playerCurrentSong,
    playerSetCurrentSong,
  } = useStore();

  // 目前播放时间
  const [currentTime, setCurrentTime] = useState(0);
  // 歌曲总时长
  const [duration, setDuration] = useState(0);
  // 歌曲播放进度
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

  const playList = [
    {
      ftype: 0,
      djId: 0,
      a: null,
      cd: "01",
      crbt: null,
      no: 1,
      st: 0,
      rt: "",
      cf: "",
      alia: ["手游《梦幻花园》苏州园林版推广曲"],
      rtUrls: [],
      fee: 0,
      s_id: 0,
      copyright: 0,
      h: {
        br: 320000,
        fid: 0,
        size: 9400365,
        vd: -45814,
      },
      mv: 0,
      al: {
        id: 84991301,
        name: "拾梦纪",
        picUrl:
          "http://p1.music.126.net/M19SOoRMkcHmJvmGflXjXQ==/109951164627180052.jpg",
        tns: [],
        pic_str: "109951164627180052",
        pic: 109951164627180050,
      },
      name: "拾梦纪",
      l: {
        br: 128000,
        fid: 0,
        size: 3760173,
        vd: -41672,
      },
      rtype: 0,
      m: {
        br: 192000,
        fid: 0,
        size: 5640237,
        vd: -43277,
      },
      cp: 1416668,
      mark: 0,
      rtUrl: null,
      mst: 9,
      dt: 234947,
      ar: [
        {
          id: 12084589,
          name: "妖扬",
          tns: [],
          alias: [],
        },
        {
          id: 12578371,
          name: "金天",
          tns: [],
          alias: [],
        },
      ],
      pop: 5,
      pst: 0,
      t: 0,
      v: 3,
      id: 1416767593,
      publishTime: 0,
      rurl: null,
    },
  ];

  const clickPlaying = (e, playing) => {
    e.stopPropagation();
    // 如果音乐没有播放，则让音乐播放
    if (!playerPlaying) {
      let current = playList[0];

      // 切换播放状态
      playerSetPlaying(true);
      setCurrentTime(0);
      setDuration((current.dt / 1000) | 0); // 计算出时长
      audioRef.current.play(); // 播放音乐
    } else {
      audioRef.current.pause(); // 暂停音乐
    }
    playerSetPlaying(playing);
  };

  const audioRef = useRef();

  useEffect(() => {
    if (!playerCurrentSong) return;
    playerSetCurrentIndex(0); // 默认当前播放值为 -1 页面一加载改成 0
    let current = playList[0];
    playerSetCurrentSong(current);
    audioRef.current.src = getSongUrl(current.id);
  }, []);

  // 控制音乐的暂停和播放
  useEffect(() => {
    playerPlaying ? audioRef.current.play() : audioRef.current.pause();
  }, [playerPlaying]);

  const updateTime = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const onProgressChange = (curPercent) => {
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    // 播放音乐
    if (!playerPlaying) {
      playerSetPlaying(true);
    }
  };

  return (
    <div>
      {isEmptyObject(playerCurrentSong) ? null : (
        <MiniPlayer
          song={playerCurrentSong}
          percent={percent}
          fullScreen={playerFullScreen}
          playing={playerPlaying}
          currentTime={currentTime}
          duration={duration}
          toggleFullScreen={playerSetFullScreen}
          clickPlaying={clickPlaying}
        ></MiniPlayer>
      )}
      {isEmptyObject(playerCurrentSong) ? null : (
        <NormalPlayer
          song={playerCurrentSong}
          percent={percent}
          fullScreen={playerFullScreen}
          playing={playerPlaying}
          currentTime={currentTime}
          duration={duration}
          toggleFullScreen={playerSetFullScreen}
          clickPlaying={clickPlaying}
          onProgressChange={onProgressChange}
        ></NormalPlayer>
      )}
      <audio ref={audioRef} onTimeUpdate={updateTime}></audio>
    </div>
  );
}

export default memo(Player);
