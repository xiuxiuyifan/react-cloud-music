import { memo } from "react";
import {
  ListContent,
  ListHeader,
  PlayListWrapper,
  ScrollWrapper,
} from "./style";
import { useState } from "react";
import { CSSTransition } from "react-transition-group";
import useStore from "../../../store";
import { useCallback } from "react";
import { useRef } from "react";
import { findIndex, getName, prefixStyle, shuffleArray } from "../../../utils";
import Scroll from "../../../baseUI/scroll";
import { playMode } from "../../../api/static";
import Confirm from "../../../baseUI/confirm";

const transform = prefixStyle("transform");

function PlayList(props) {
  const {
    playListVisible,
    playListSetVisible,
    playerCurrentIndex,
    playerSetCurrentIndex,
    playerCurrentSong,
    playerPlayList,
    playerSetPlayList,
    playerSequencePlayList,
    playerMode,
    playerSetMode,
    playerDeleteSong,
    playerClear,
  } = useStore();
  const [isShow, setIsShow] = useState(false);
  const playListRef = useRef();
  const listWrapperRef = useRef();
  const confirmRef = useRef();
  const [canTouch, setCanTouch] = useState();
  const listContentRef = useRef();

  // touchStat 后记录 y 值
  const [startY, setStartY] = useState(0);
  // touchStart 事件是否被触发
  const [initialed, setInitialed] = useState(false);
  // 用户下滑的距离
  const [distance, setDistance] = useState(0);

  const onEnterCB = useCallback(() => {
    // 让列表显示出来
    setIsShow(true);
    // 最开始的时候是隐藏在下面的
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  }, [transform]);

  const onEnteringCB = useCallback(() => {
    // 动画进行的过程中
    listWrapperRef.current.style["transition"] = "all 0.3s";
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`;
  }, [transform]);

  const onExitingCB = useCallback(() => {
    listWrapperRef.current.style["transition"] = "all 0.3s";
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`;
  }, [transform]);

  const onExitedCB = useCallback(() => {
    setIsShow(false);
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  }, [transform]);

  const getCurrentIcon = (item) => {
    // 是不是当前正在播放的歌曲
    const current = playerCurrentSong.id === item.id;
    const className = current ? "icon-play" : "";
    const content = current ? "&#xe6e3;" : "";
    return (
      <i
        className={`current iconfont ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      ></i>
    );
  };

  const getPlayMode = () => {
    let content, text;
    if (playerMode === playMode.sequence) {
      content = "&#xe625;";
      text = "顺序播放";
    } else if (playerMode === playMode.loop) {
      content = "&#xe653;";
      text = "单曲循环";
    } else {
      content = "&#xe61b;";
      text = "随机播放";
    }
    return (
      <div>
        <i
          className="iconfont"
          onClick={(e) => changeMode(e)}
          dangerouslySetInnerHTML={{ __html: content }}
        ></i>
        <span className="text" onClick={(e) => changeMode(e)}>
          {text}
        </span>
      </div>
    );
  };

  const changeMode = (e) => {
    const newMode = (playerMode + 1) % 3; // 目标值只有两个，可以对 3 进行取余 等于 3 的时候取余等于0，就相当于又归零了。
    if (newMode === 0) {
      // 顺序模式
      playerSetPlayList(playerSequencePlayList);
      // 查找当前播放歌曲在播放列表中的位置
      let index = findIndex(playerCurrentSong, playerSequencePlayList);
      playerSetCurrentIndex(index);
    } else if (newMode === 1) {
      //
      playerSetPlayList(playerSequencePlayList);
    } else if (newMode === 2) {
      // 随机播放
      // 生成一个新的数组
      let newList = shuffleArray(playerSequencePlayList);
      // 找当前播放的歌曲在随机后列表中的位置
      let index = findIndex(playerCurrentSong, newList);
      playerSetPlayList(newList);
      playerSetCurrentIndex(index);
    }
    playerSetMode(newMode);
  };

  const handleShowClear = () => {
    confirmRef.current.show();
  };

  const handleConfirmClear = () => {
    playerClear();
  };

  // 点击切换歌曲
  const handleChangeCurrentIndex = (index) => {
    if (playerCurrentIndex === index) {
      return;
    }
    // 改变当前正在播放的音乐
    playerSetCurrentIndex(index);
  };

  // 删除一首歌曲
  const handleDeleteSong = (e, song) => {
    e.stopPropagation();
    playerDeleteSong(song);
  };

  // 触摸开始
  const handleTouchStart = (e) => {
    if (!canTouch || initialed) return;
    listWrapperRef.current.style["transition"] = "";
    setStartY(e.nativeEvent.touches[0].pageY); // 记录 y 值
    // 每次重置 滑动的距离
    setDistance(0);
    setInitialed(true);
  };

  // 触摸移动
  const handleTouchMove = (e) => {
    if (!canTouch || !initialed) return;
    let distance = e.nativeEvent.touches[0].pageY - startY;
    if (distance < 0) return;
    setDistance(distance); // 记录下滑距离
    listWrapperRef.current.style.transform = `translate3d(0, ${distance} px, 0)`;
  };

  //  触摸结束
  const handleTouchEnd = (e) => {
    setInitialed(false);
    // 这里设置阈值为 150px
    if (distance >= 150) {
      // 大于 150px 则关闭 PlayList
      playListSetVisible(false);
    } else {
      // 否则反弹回去
      listWrapperRef.current.style["transition"] = "all 0.3s";
      listWrapperRef.current.style[transform] = `translate3d(0px, 0px, 0px)`;
    }
  };

  const handleScroll = (pos) => {
    // 只有当内容偏移量为0 的时候才能下滑关闭 playList 列表，否则一边内容在移动，一边列表在移动，会出现 bug
    let state = pos.y === 0;
    setCanTouch(state);
  };
  return (
    <CSSTransition
      in={playListVisible}
      timeout={300}
      classNames="list-fade"
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
    >
      <PlayListWrapper
        ref={playListRef}
        style={isShow === true ? { display: "block" } : { display: "none" }}
        onClick={() => playListSetVisible(false)}
      >
        <div
          ref={listWrapperRef}
          className="list_wrapper"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ListHeader>
            <h1 className="title">
              {getPlayMode()}
              <span className="iconfont clear" onClick={handleShowClear}>
                &#xe63d;
              </span>
            </h1>
          </ListHeader>
          <ScrollWrapper>
            <Scroll
              ref={listContentRef}
              onScroll={(pos) => handleScroll(pos)}
              bounceTop={false}
            >
              <ListContent>
                {playerPlayList.map((item, index) => {
                  return (
                    <li
                      className="item"
                      key={item.id}
                      onClick={() => handleChangeCurrentIndex(index)}
                    >
                      {getCurrentIcon(item)}
                      <span className="text">
                        {item.name} - {getName(item.ar)}
                      </span>
                      <span className="like">
                        <i className="iconfont">&#xe601;</i>
                      </span>
                      <span
                        className="delete"
                        onClick={(e) => handleDeleteSong(e, item)}
                      >
                        <i className="iconfont">&#xe63d;</i>
                      </span>
                    </li>
                  );
                })}
              </ListContent>
            </Scroll>
          </ScrollWrapper>
        </div>
        <Confirm
          ref={confirmRef}
          text="是否全部删除？"
          cancelBtnText="取消"
          confirmBtnText="确定"
          handleConfirm={handleConfirmClear}
        ></Confirm>
      </PlayListWrapper>
    </CSSTransition>
  );
}

export default memo(PlayList);
