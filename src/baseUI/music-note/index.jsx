import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { prefixStyle } from "../../utils";
import styled from "styled-components";
import style from "../../assets/global-style";

const Container = styled.div`
  .icon_wrapper {
    position: fixed;
    z-index: 1000;
    margin-top: -10px;
    margin-left: -10px;
    color: ${style["theme-color"]};
    font-size: 14px;
    display: none;
    transition: transform 1s cubic-bezier(0.62, -0.1, 0.86, 0.57);
    transform: translate3d(0, 0, 0);
    > div {
      transition: transform 1s;
    }
  }
`;

const MusicNote = forwardRef((props, ref) => {
  const iconsRef = useRef();

  // 容器中有 3个 音符，也就是同时只能有 3 个音符下落
  const ICON_NUMBER = 3;

  const transform = prefixStyle("transform");

  // 原生 DOM 操作， 返回一个 DOM 节点对象
  const createNode = (txt) => {
    const template = `<div class='icon_wrapper'>${txt}</div>`;
    let tempNode = document.createElement("div");
    tempNode.innerHTML = template;
    return tempNode.firstChild;
  };

  useEffect(() => {
    for (let i = 0; i < ICON_NUMBER; i++) {
      let node = createNode(`<div class="iconfont">&#xe642;</div>`);
      // 向容器中插入 3 个音符
      iconsRef.current.appendChild(node);
    }
    // 拿到子元素
    let domArray = [...iconsRef.current.children];
    domArray.forEach((item) => {
      item.running = false;
      // 当过渡完成知乎隐藏元素
      item.addEventListener(
        "transitionend",
        function () {
          this.style["display"] = "none";
          this.style[transform] = `translate3d(0,0,0)`;
          this.running = false;

          let icon = this.querySelector("div");
          icon.style[transform] = `translate3d(0,0,0)`;
        },
        false
      );
    });
  }, []);

  const startAnimation = ({ x, y }) => {
    let domArray = [].slice.call(iconsRef.current.children);
    for (let i = 0; i < ICON_NUMBER; i++) {
      let item = domArray[i];
      // 选择一个空闲的元素来开始动画
      if (item.running === false) {
        // 设置当前元素为当前点击的位置
        item.style.left = x + "px";
        item.style.top = y + "px";
        // 并让其显示出来
        item.style.display = "block";
        // 放到下一次宏任务中执行动画逻辑，
        // 因为本次元素虽然由 none 变换成了 block 了，但是元素要显示出来，需要浏览器的回流
        // 过程，无法立即显示，也就是元素目前还是隐藏的，那么位置就是未知的，所以 transform 就无法生效
        Promise.resolve().then(() => {
          item.running = true;
          item.style[transform] = `translate3d(0, 750px, 0)`;
          let icon = item.querySelector("div");
          icon.style[transform] = `translate3d(-40px, 0, 0)`;
        });
        break;
      }
    }
  };

  // 提供给外部 ref 调用的方法
  useImperativeHandle(ref, () => ({
    startAnimation,
  }));

  return <Container ref={iconsRef}></Container>;
});

export default memo(MusicNote);
