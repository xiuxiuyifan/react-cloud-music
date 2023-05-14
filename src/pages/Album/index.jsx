import { memo } from "react";
import { Container, Menu, TopDesc } from "./style";
import { useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../baseUI/header";
import Scroll from "../../baseUI/scroll";
import { getName, isEmptyObject } from "../../utils";
import { useRef } from "react";
import style from "../../assets/global-style";
import { useEffect } from "react";
import useStore from "../../store";
import Loading from "../../baseUI/loading";
import { useCallback } from "react";
import SongList from "../SongList";
import MusicNote from "../../baseUI/music-note";

export const HEADER_HEIGHT = 45;

// 专辑
function Album() {
  const [visible, setVisible] = useState(true);
  const [title, setTitle] = useState("歌单");
  const [isMarquee, setIsMarquee] = useState(false); // 是否跑马灯
  const {
    rankCurrentAlbum,
    rankCurrentAlbumLoading,
    rankSetCurrentAlbum,
    playerPlayList,
  } = useStore();

  const navigate = useNavigate();
  const { id } = useParams();

  const headerEl = useRef();

  const musicNoteRef = useRef();

  const onExit = () => {
    navigate(-1);
  };

  const handleClick = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    rankSetCurrentAlbum(id);
  }, []);

  // 将传递给子组件的函数用 useCallback 包裹，
  const handleScroll = useCallback(
    (pos) => {
      let minScrollY = -HEADER_HEIGHT;
      let percent = Math.abs(pos.y / minScrollY);
      let headerDom = headerEl.current;
      // 划过顶部的高度
      if (pos.y < minScrollY) {
        headerDom.style.backgroundColor = style["theme-color"];
        headerDom.style.opacity = Math.min(1, (percent - 1) / 2);
        setTitle(rankCurrentAlbum.name);
        setIsMarquee(true);
      } else {
        headerDom.style.backgroundColor = "";
        headerDom.style.opacity = 1;
        setTitle("歌单");
        setIsMarquee(false);
      }
    },
    [rankCurrentAlbum]
  );

  const renderTopDesc = () => {
    return (
      <TopDesc background={rankCurrentAlbum.coverImgUrl}>
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={rankCurrentAlbum.coverImgUrl} alt="" />
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">
              {Math.floor(rankCurrentAlbum.subscribedCount / 1000) / 10} 万{" "}
            </span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{rankCurrentAlbum.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={rankCurrentAlbum.creator.avatarUrl} alt="" />
            </div>
            <div className="name">{rankCurrentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    );
  };

  const renderMenu = () => {
    return (
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>
          更多
        </div>
      </Menu>
    );
  };

  const renderSongList = () => {
    const musicAnimation = (x, y) => {
      musicNoteRef.current.startAnimation({ x, y });
    };
    return (
      <SongList
        showCollect={true}
        songs={rankCurrentAlbum.tracks}
        collectCount={rankCurrentAlbum.subscribedCount}
        musicAnimation={musicAnimation}
      ></SongList>
    );
  };

  return (
    <CSSTransition
      in={visible}
      timeout={300}
      classNames="fly"
      unmountOnExit
      onExited={onExit}
      appear
    >
      <Container play={playerPlayList.length}>
        <Header
          ref={headerEl}
          title={title}
          isMarquee={isMarquee}
          handleClick={handleClick}
        ></Header>
        {!isEmptyObject(rankCurrentAlbum) ? (
          <Scroll bounceTop={false} onScroll={handleScroll}>
            <div>
              {renderTopDesc()}
              {renderMenu()}
              {renderSongList()}
            </div>
          </Scroll>
        ) : null}
        {rankCurrentAlbumLoading ? <Loading></Loading> : null}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  );
}

export default memo(Album);
