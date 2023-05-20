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
import { getName, prefixStyle } from "../../../utils";
import Scroll from "../../../baseUI/scroll";
import { playMode } from "../../../api/static";

const transform = prefixStyle("transform");

function PlayList(props) {
  const {
    playListVisible,
    playListSetVisible,
    playerCurrentIndex,
    playerCurrentSong,
    playerPlayList,
    playerSequencePlayList,
    playerMode,
  } = useStore();
  const [isShow, setIsShow] = useState(false);
  const playListRef = useRef();
  const listWrapperRef = useRef();

  const onEnterCB = useCallback(() => {
    // 让列表显示出来
    setIsShow(true);
    // 最开始的时候是隐藏在下面的
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  });

  const onEnteringCB = useCallback(() => {
    // 动画进行的过程中
    listWrapperRef.current.style["transition"] = "all 0.3s";
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`;
  });

  const onExitingCB = useCallback(() => {
    listWrapperRef.current.style["transition"] = "all 0.3s";
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`;
  });

  const onExitedCB = useCallback(() => {
    setIsShow(false);
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  });

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
    let newMode = (playMode + 1) % 3;
  };

  const handleShowClear = () => {};
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
        <div ref={listWrapperRef} className="list_wrapper">
          <ListHeader>
            <h1 className="title">
              {getPlayMode()}
              <span className="iconfont clear" onClick={handleShowClear}>
                &#xe63d;
              </span>
            </h1>
          </ListHeader>
          <ScrollWrapper>
            <Scroll>
              <ListContent>
                {playerPlayList.map((item, index) => {
                  return (
                    <li className="item" key={item.id}>
                      {getCurrentIcon(item)}
                      <span className="text">
                        {item.name} - {getName(item.ar)}
                      </span>
                      <span className="like">
                        <i className="iconfont">&#xe601;</i>
                      </span>
                      <span className="delete">
                        <i className="iconfont">&#xe63d;</i>
                      </span>
                    </li>
                  );
                })}
              </ListContent>
            </Scroll>
          </ScrollWrapper>
        </div>
      </PlayListWrapper>
    </CSSTransition>
  );
}

export default memo(PlayList);
