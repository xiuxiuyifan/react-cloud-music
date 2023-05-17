import { memo } from "react";
import { PlayListWrapper, ScrollWrapper } from "./style";
import { useState } from "react";
import { CSSTransition } from "react-transition-group";
import useStore from "../../../store";
import { useCallback } from "react";
import { useRef } from "react";
import { prefixStyle } from "../../../utils";

const transform = prefixStyle("transform");

function PlayList(props) {
  const { playListVisible, playListSetVisible } = useStore();
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
          <ScrollWrapper></ScrollWrapper>
        </div>
      </PlayListWrapper>
    </CSSTransition>
  );
}

export default memo(PlayList);
