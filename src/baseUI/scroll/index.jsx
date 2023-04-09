import BScroll from "@better-scroll/core";
import PullDown from "@better-scroll/pull-down";
import PullUp from "@better-scroll/pull-up";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { forwardRef } from "react";
import styled from "styled-components";

// 安装下拉刷新和上拉加载的插件
BScroll.use(PullDown);
BScroll.use(PullUp);

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Scroll = forwardRef((props, ref) => {
  const [bScroll, setBScroll] = useState();

  const scrollContainerRef = useRef();

  useEffect(() => {
    const scroll = new BScroll(scrollContainerRef.current, {
      pullDownRefresh: true,
      pullUpLoad: true,
    });
  }, []);
  return (
    <ScrollContainer ref={scrollContainerRef}>{props.children}</ScrollContainer>
  );
});

export default Scroll;

// 滚动组件
