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
  const { percentChange } = props;

  const progressBar = useRef();
  // 进度条
  const progress = useRef();
  // 拖拽按钮
  const progressBtn = useRef();

  const [touch, setTouch] = useState({});

  const progressBtnWidth = 16;

  // 处理进度条的偏移

  const _offset = (offsetWidth) => {
    // 进度条变宽
    progress.current.style.width = `${offsetWidth}px`;
    // 按钮向右移动
    progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
  };

  const progressTouchStart = (e) => {
    const startTouch = {};
    startTouch.initiated = true; // Initial 表示滑动动作开始了
    startTouch.startX = e.touches[0].pageX; // 记录滑动开始的横向坐标
    startTouch.left = progress.current.clientWidth; // 当前 progress 长度
    setTouch(startTouch);
  };

  const progressTouchMove = (e) => {
    // 如果没有初始值则 return 掉
    if (!touch.initiated) return;
    // 计算滑动距离
    const deltaX = e.touches[0].pageX - touch.startX;
    // 进度条最大的宽度
    const barWidth = progressBar.current.clientWidth - progressBtnWidth;
    // offset 的距离
    // 进度条初始的宽度 + 滑动的宽度
    const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth);
    _offset(offsetWidth);
  };

  // 计算新的进度，并把进度传递给回调函数
  const _changePercent = () => {
    // 进度条的总长度
    const barWidth = progress.current.clientWidth - progressBtnWidth;
    // 进度条当前的长度/总长度
    const curPercent = progress.current.clientWidth / barWidth;
    // 调用比例发生变化的钩子函数，告诉父组件当前最新的 percent (百分比)
    percentChange(curPercent);
  };

  // 拖拽完成
  const progressTouchEnd = () => {
    // 保留一下拖拽结束之后的状态
    // 深拷贝一个对象
    const endTouch = JSON.parse(JSON.stringify(touch));
    endTouch.initiated = false;
    setTouch(endTouch);
    _changePercent();
  };

  // 用户点击进度条
  const progressClick = (e) => {
    const rect = progress.current.getBoundingClientRect();
    // 计算出进度条的宽度
    const offsetWidth = e.pageX - rect.left;
    _offset(offsetWidth);
    _changePercent();
  };

  return (
    <ProgressBarWrapper>
      <div className="bar-inner" ref={progressBar} onClick={progressClick}>
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
