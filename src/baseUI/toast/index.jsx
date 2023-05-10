import { forwardRef, memo, useImperativeHandle, useState } from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import style from "../../assets/global-style";

const ToastWrapper = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  height: 50px;
  &.dorp-enter {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  &.drop-enter-active {
    opacity: 1;
    transition: all 0.3s;
    transform: translate3d(0, 0, 0);
  }
  &.drop-exit-active {
    opacity: 0;
    transition: all 0.3s;
    transform: translate3d(0, 100%, 0);
  }
  .text {
    line-height: 50px;
    text-align: center;
    color: #fff;
    font-size: ${style["font-size-l"]};
  }
`;

const Toast = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const [timer, setTimer] = useState("");
  const { text } = props;
  // 外面组件拿函数组件 ref 的方法， 用 useImperativeHandle 这个 hook
  useImperativeHandle(ref, () => ({
    show() {
      // 做了防抖处理
      if (timer) clearTimeout(timer);
      setShow(true);
      // 3 秒之后关闭
      setTimer(
        setTimeout(() => {
          setShow(false);
        }, 3000)
      );
    },
  }));
  return (
    <CSSTransition in={show} timeout={300} classNames="drop" unmountOnExit>
      <ToastWrapper>
        <div className="text">{text}</div>
      </ToastWrapper>
    </CSSTransition>
  );
});

export default memo(Toast);
