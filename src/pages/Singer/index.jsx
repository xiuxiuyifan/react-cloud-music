import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import Header from "../../baseUI/header";

import {
  BgLayer,
  CollectButton,
  Container,
  ImgWrapper,
  SongListWrapper,
} from "./style";
import Scroll from "../../baseUI/scroll";
import SongList from "../SongList";

function Singer(props) {
  const [showStatus, setShowStatus] = useState(true);

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const artist = {
    picUrl:
      "https://p2.music.126.net/W__FCWFiyq0JdPtuLJoZVQ==/109951163765026271.jpg",
    name: "薛之谦",
    hotSongs: [
      {
        id: 1,
        name: "我好像在哪见过你",
        ar: [{ name: "薛之谦" }],
        al: {
          name: "薛之谦专辑",
        },
      },
      {
        id: 2,
        name: "我好像在哪见过你",
        ar: [{ name: "薛之谦" }],
        al: {
          name: "薛之谦专辑",
        },
      },
      // 省略 20 条
    ],
  };

  const collectButton = useRef();
  const imageWrapper = useRef();
  const songsScrollWrapper = useRef();
  const songScroll = useRef();
  const header = useRef();
  const layer = useRef();

  // 图片初始高度
  const initialHeight = useRef(0);

  // 网上偏移的高度

  const OFFSET = 5;

  // 设置歌手列表的初始高度

  useEffect(() => {
    let h = imageWrapper.current.offsetHeight;
    console.log(h - OFFSET);
    songsScrollWrapper.current.style.top = `${h - OFFSET}px`;
    initialHeight.current = h;
    layer.current.style.top = `${h - OFFSET} px`;
    songScroll.current.refresh();
  }, []);

  const setShowStatusFalse = useCallback(() => {
    setShowStatus(false);
  });

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={goBack}
    >
      <Container>
        <Header
          title={artist.name}
          ref={header}
          handleClick={setShowStatusFalse}
        ></Header>
        <ImgWrapper bgUrl={artist.picUrl} ref={imageWrapper}>
          <div className="filter"></div>
        </ImgWrapper>
        <CollectButton ref={collectButton}>
          <i className="iconfont">&#xe62d;</i>
          <span className="text">收藏</span>
        </CollectButton>
        <BgLayer ref={layer}></BgLayer>
        <SongListWrapper ref={songsScrollWrapper}>
          <Scroll ref={songScroll}>
            <SongList songs={artist.hotSongs} showCollect={false}></SongList>
          </Scroll>
        </SongListWrapper>
      </Container>
    </CSSTransition>
  );
}

export default memo(Singer);
