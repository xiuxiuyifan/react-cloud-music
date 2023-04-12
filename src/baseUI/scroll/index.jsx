import BScroll from "@better-scroll/core";
import PullDown from "@better-scroll/pull-down";
import PullUp from "@better-scroll/pull-up";
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import LoadingV2 from "../loading-v2";
import Loading from "../loading";

// 安装下拉刷新和上拉加载的插件
BScroll.use(PullDown);
BScroll.use(PullUp);

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const PullUpLoading = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 34px;
  width: 120px;
  margin: auto;
  z-index: 100;
`;

const PullDownLoading = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0px;
  height: 30px;
  margin: auto;
  z-index: 100;
`;

// 不能再函数组件上直接使用 ref 因为函数组件是没有实例的
// 当ref属性用于 HTML 元素时，接受底层DOM元素作为当前的 current 属性
// 当 ref 属性用于 class 组件的时候，ref 接受组件挂载的实例作为其 current 属性

const Scroll = forwardRef((props, ref) => {
  const {
    direction,
    click,
    refresh,
    pullUpLoading,
    pullDownLoading,
    bounceTop,
    bounceBottom,
  } = props;
  const { pullUp, pullDown, onScroll } = props;

  // 用来保存当前滚动实例
  const [bScroll, setBScroll] = useState();

  const scrollContainerRef = useRef();

  useEffect(() => {
    const scroll = new BScroll(scrollContainerRef.current, {
      scrollX: direction === "horizontal",
      scrollY: direction === "vertical",
      pullDownRefresh: true,
      useTransition: false,
      pullUpLoad: true,
      probeType: 3,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom,
      },
      click,
    });
    // 保存当前滚动实例
    setBScroll(scroll);
    return () => {
      setBScroll(null);
    };
  }, []);

  //每次渲染实例都要刷新实例，防止无法滚动
  useEffect(() => {
    if (refresh && bScroll) {
      bScroll.refresh();
    }
  });

  //  给实例绑定 scroll 事件
  useEffect(() => {
    if (!bScroll || !onScroll) return;
    bScroll.on("scroll", (scroll) => {
      onScroll(scroll);
    });
    // 组件销毁的时候执行，
    // 销毁绑定的 scroll 事件
    return () => {
      bScroll.off("scroll");
    };
  }, [onScroll, bScroll]);

  // 上拉到底的判断，和调用用户传进来的刷新的函数
  useEffect(() => {
    if (!bScroll || !pullUp) return;
    bScroll.on("pullingUp", () => {
      pullUp();
      bScroll.finishPullUp();
    });
    return () => {
      bScroll.off("pullingUp");
    };
  }, [pullUp, bScroll]);

  // 进行下拉的判断，调用下拉刷新的函数
  useEffect(() => {
    if (!bScroll || !pullDown) return;
    bScroll.on("pullingDown", (pos) => {
      // 判断用户的下拉
      pullDown();
      bScroll.finishPullDown();
    });
    return () => {
      bScroll.off("pullingDown");
    };
  }, [pullDown, bScroll]);

  // 值暴露特定的操作，给外部
  useImperativeHandle(ref, () => ({
    refresh() {
      if (bScroll) {
        bScroll.refresh();
        bScroll.scrollTo(0, 0);
      }
    },
    getBScroll() {
      if (bScroll) {
        return bScroll;
      }
    },
  }));

  return (
    <ScrollContainer ref={scrollContainerRef}>
      {props.children}
      {pullUpLoading ? (
        <PullUpLoading>
          <LoadingV2></LoadingV2>
        </PullUpLoading>
      ) : null}
      {pullDownLoading ? (
        <PullDownLoading>
          <Loading></Loading>
        </PullDownLoading>
      ) : null}
    </ScrollContainer>
  );
});

export default Scroll;

Scroll.propTypes = {
  direction: PropTypes.oneOf(["vertical", "horizontal"]), // 滚动的方向
  click: PropTypes.bool, // 是否支持点击,
  refresh: PropTypes.bool, // 是否刷新
  onScroll: PropTypes.func, // 滑动触发的回调函数
  pullUp: PropTypes.func, // 上拉加载逻辑
  pullDown: PropTypes.func, // 下拉加载逻辑
  pullUpLoading: PropTypes.bool, // 是否显示上拉加载的 loading
  pullDownLoading: PropTypes.bool, // 是否显示下拉的 loading
  bounceTop: PropTypes.bool, // 是否支持向上吸顶
  bounceBottom: PropTypes.bool, // 是否支持向下吸底
};

Scroll.defaultProps = {
  direction: "vertical",
  click: true,
  refresh: true,
  onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: () => {},
  pullDown: () => {},
  bounceTop: true,
  bounceBottom: true,
};
// 滚动组件
