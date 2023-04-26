import { memo, useRef, useState } from "react";
import styled from "styled-components";
import style from "../../assets/global-style";

const ProgressBarWrapper = styled.div`
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba (0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: ${style["theme-color"]};
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -15px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid ${style["border-color"]};
        border-radius: 50%;
        background: ${style["theme-color"]};
      }
    }
  }
`;

function ProgressBar(props) {
  const progressBar = useRef();
  // 进度条
  const progress = useRef();
  // 拖拽按钮
  const progressBtn = useRef();

  const [touch, setTouch] = useState();

  // 处理进度条的偏移

  const _offset = (offsetWidth) => {
    // 进度条变宽
    progress.current.style.width = `${offsetWidth}px`;
    // 按钮向右移动
    progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
  };

  const progressTouchStart = () => {};

  const progressTouchMove = () => {};

  const progressTouchEnd = () => {};

  return (
    <ProgressBarWrapper>
      <div className="bar-inner" ref={progressBar}>
        <div className="progress" ref={progress}></div>
        <div
          className="progress-btn-wrapper"
          ref={progressBtn}
          onTouchStart={progressTouchStart}
          onTouchMove={progressTouchMove}
          onTouchEnd={progressTouchEnd}
        >
          <div className="progress-btn"></div>
        </div>
      </div>
    </ProgressBarWrapper>
  );
}

export default memo(ProgressBar);
