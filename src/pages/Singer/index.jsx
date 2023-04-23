import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { HEADER_HEIGHT } from "../Album";
import useStore from "../../store";
import Loading from "../../baseUI/loading";

function Singer(props) {
  const [showStatus, setShowStatus] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  const goBack = () => {
    navigate(-1);
  };

  const { artistsList, artistsSongOfArtists, artistsSetList, artistsLoading } =
    useStore();

  const collectButton = useRef();
  const imageWrapper = useRef();
  const songsScrollWrapper = useRef();
  const songScroll = useRef();
  const header = useRef();
  const layer = useRef();

  // 图片初始高度
  const initialHeight = useRef(0);

  // 往上偏移的高度

  const OFFSET = 5;

  // 设置歌手列表的初始高度

  useEffect(() => {
    artistsSetList(id);
    let h = imageWrapper.current.offsetHeight;
    songsScrollWrapper.current.style.top = `${h - OFFSET}px`;
    initialHeight.current = h;
    layer.current.style.top = `${h - OFFSET} px`;
    songScroll.current.refresh();
  }, []);

  const setShowStatusFalse = useCallback(() => {
    setShowStatus(false);
  });

  const handleScroll = useCallback((pos) => {
    // 获取图片的原始高度
    let height = initialHeight.current;
    // 获取 滚动的 y 轴方向的距离
    const newY = pos.y;
    const imageDOM = imageWrapper.current;
    const buttonDOM = collectButton.current;
    const headerDOM = header.current;
    const layerDOM = layer.current;

    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT;

    // 滑动距离占图片高度的百分比
    const percent = Math.abs(newY / height);
    // 下拉的情况
    if (newY > 0) {
      imageDOM.style["transform"] = `scale(${1 + percent})`;
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      layerDOM.style.top = `${height - OFFSET + newY}px`;
    } else if (newY >= minScrollY) {
      // 往上滑动，但是遮罩层还没超过 header 部分
      layerDOM.style.top = `${header - OFFSET - Math.abs(newY)}px`;
      // 这时候保证遮罩层的优先级比图片搞，不至于被图片遮挡住
      layerDOM.style.zIndex = 1;
      imageDOM.style.paddingTop = "75%";
      imageDOM.style.height = 0;
      imageDOM.style.zIndex = -1;
      // 按钮随着移动渐变且透明
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      buttonDOM.style["opacity"] = `${1 - percent * 2}`;
    } else if (newY < minScrollY) {
      // 往上滑动， 但是超过了 Header 部分
      layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;
      layerDOM.style.zIndex = 1;
      // 防止溢出的歌单内容遮挡住 Header
      headerDOM.style.zIndex = 100;

      imageDOM.style.height = `${HEADER_HEIGHT}px`;
      imageDOM.style.paddingTop = 0;
      imageDOM.style.zIndex = 99;
    }
  }, []);

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
          title={artistsList.name}
          ref={header}
          handleClick={setShowStatusFalse}
        ></Header>
        <ImgWrapper bgUrl={artistsList.picUrl} ref={imageWrapper}>
          <div className="filter"></div>
        </ImgWrapper>
        <CollectButton ref={collectButton}>
          <i className="iconfont">&#xe62d;</i>
          <span className="text">收藏</span>
        </CollectButton>
        <BgLayer ref={layer}></BgLayer>
        <SongListWrapper ref={songsScrollWrapper}>
          <Scroll ref={songScroll} onScroll={handleScroll}>
            <SongList
              songs={artistsSongOfArtists}
              showCollect={false}
            ></SongList>
          </Scroll>
        </SongListWrapper>
        {artistsLoading ? <Loading></Loading> : null}
      </Container>
    </CSSTransition>
  );
}

export default memo(Singer);
