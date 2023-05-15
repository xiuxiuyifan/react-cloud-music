import { memo } from "react";
import MiniPlayer from "./miniPlayer";
import NormalPlayer from "./normalPlayer";
import useStore from "../../store";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import {
  findIndex,
  getSongUrl,
  isEmptyObject,
  shuffleArray,
} from "../../utils";
import Toast from "../../baseUI/toast";
import { playMode } from "../../api/static";
import PlayList from "./playList";

function Player(props) {
  const {
    playerFullScreen,
    playerSetFullScreen,
    playerPlaying,
    playerSetPlaying,
    playerCurrentIndex,
    playerPlayList,
    playerSetPlayList,
    playerSetCurrentIndex,
    playerCurrentSong,
    playerSetCurrentSong,
    playerMode,
    playerSetMode,
    playerSequencePlayList,
    playerSetSequencePlayList,
    playListSetVisible,
  } = useStore();

  // 目前播放时间
  const [currentTime, setCurrentTime] = useState(0);
  // 歌曲总时长
  const [duration, setDuration] = useState(0);

  const [preSong, setPreSong] = useState({});

  // 切换播放模式，显示 toast 内容
  const [modeText, setModeText] = useState("");

  const toastRef = useRef();

  const songReady = useRef(true);

  // 歌曲播放进度 , 当目前播放时间变化之后会重新刷新当前组件 重新 render, 然后重新计算播放进度
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

  const clickPlaying = (e, playing) => {
    e.stopPropagation();
    // 如果音乐没有播放，则让音乐播放
    if (!playerPlaying) {
      // 切换播放状态
      audioRef.current.play(); // 播放音乐
    } else {
      audioRef.current.pause(); // 暂停音乐
    }
    playerSetPlaying(playing);
  };

  const audioRef = useRef();

  useEffect(() => {
    // 设置当前播放的索引为0
    playerSetCurrentIndex(0);
  }, []);

  // 控制音乐的暂停和播放
  useEffect(() => {
    playerPlaying ? audioRef.current.play() : audioRef.current.pause();
  }, [playerPlaying]);

  // 当前播放的音乐发生变化的时候，监听 currentIndex 和 播放列表变化
  useEffect(() => {
    // 进行一些边界判断
    if (
      !playerPlayList.length ||
      playerCurrentIndex === -1 ||
      !playerPlayList[playerCurrentIndex] ||
      playerPlayList[playerCurrentIndex].id === preSong.id ||
      !songReady.current // 没有准备好
    ) {
      return;
    }
    // 取出当前正在播放的歌曲
    const current = playerPlayList[playerCurrentIndex];
    // 更新当前正在播放的音乐
    playerSetCurrentSong(current);
    setPreSong(current);
    // 把标志位设置为 false 表示当前正在 缓冲
    songReady.current = false;
    // 设置播放器播放音乐的路径
    audioRef.current.src = getSongUrl(current.id);
    setTimeout(() => {
      audioRef.current.play().then(() => {
        songReady.current = true;
      });
    });
    // 切换播放状态
    playerSetPlaying(true);
    // 从头开始播放
    setCurrentTime(0);
    // 设置播放总时长
    setDuration((current.dt / 1000) | 0);
  }, [playerPlayList, playerCurrentIndex]);

  const updateTime = (e) => {
    let currentTime = e.target.currentTime;
    setCurrentTime(currentTime);
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

  // 一首歌循环
  const handleLoop = () => {
    audioRef.current.currentTime = 0;
    playerSetPlaying(true);
    audioRef.current.play();
  };

  // 前一首歌曲
  const handlePrev = () => {
    // 如果只有一首歌曲，则循环播放
    if (playerPlayList.length === 1) {
      handleLoop();
      return;
    }
    // 否则计算出最新的 index
    let index = playerCurrentIndex - 1;
    // 当向前的时候超出了边界的时候，将 index 设置为歌曲列表的最后一个
    if (index < 0) {
      index = playerPlayList.length - 1;
    }
    // 如果当前没有播放，则让音乐开始播放
    if (!playerPlaying) playerSetPlaying(true);
    // 更改当前播放音乐的索引
    playerSetCurrentIndex(index);
  };

  // 下一首歌曲
  const handleNext = () => {
    // 如果只有一首歌曲，则循环播放
    if (playerPlayList.length === 1) {
      handleLoop();
      return;
    }
    let index = playerCurrentIndex + 1;
    // 判断如果当前播放的 index 到了最后一个，则重置为 第一个(0)
    if (index === playerPlayList.length) playerCurrentIndex = 0;
    if (!playerPlaying) playerSetPlaying(true);
    playerSetCurrentIndex(index);
  };

  const changeMode = () => {
    const newMode = (playerMode + 1) % 3; // 目标值只有两个，可以对 3 进行取余 等于 3 的时候取余等于0，就相当于又归零了。
    if (newMode === 0) {
      // 顺序模式
      playerSetPlayList(playerSequencePlayList);
      // 查找当前播放歌曲在播放列表中的位置
      let index = findIndex(playerCurrentSong, playerSequencePlayList);
      playerSetCurrentIndex(index);
      setModeText("顺序循环");
    } else if (newMode === 1) {
      //
      playerSetPlayList(playerSequencePlayList);
      setModeText("单曲循环");
    } else if (newMode === 2) {
      // 随机播放
      // 生成一个新的数组
      let newList = shuffleArray(playerSequencePlayList);
      // 找当前播放的歌曲在随机后列表中的位置
      let index = findIndex(playerCurrentSong, newList);
      playerSetPlayList(newList);
      playerSetCurrentIndex(index);
      setModeText("随机播放");
    }
    playerSetMode(newMode);
    toastRef.current.show();
  };

  const handleEnd = () => {
    console.log(playerMode);
    if (playerMode === playMode.loop) {
      handleLoop();
    } else {
      handleNext();
    }
  };

  const handleError = () => {
    songReady.current = true;
    alert("播放出错");
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
          togglePlayList={playListSetVisible}
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
          mode={playerMode}
          toggleFullScreen={playerSetFullScreen}
          clickPlaying={clickPlaying}
          onProgressChange={onProgressChange}
          handlePrev={handlePrev}
          handleNext={handleNext}
          changeMode={changeMode}
          togglePlayList={playListSetVisible}
        ></NormalPlayer>
      )}
      <PlayList></PlayList>
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        onError={handleError}
      ></audio>
      <Toast ref={toastRef} text={modeText}></Toast>
    </div>
  );
}

export default memo(Player);
