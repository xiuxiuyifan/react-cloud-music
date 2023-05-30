import { memo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import {
  Container,
  HotKey,
  List,
  ListItem,
  ShortcutWrapper,
  SongItem,
} from "./style";
import SearchBox from "../../baseUI/search-box";
import Scroll from "../../baseUI/scroll";
import useStore from "../../store";
import LazyLoad, { forceCheck } from "react-lazyload";
import musicPng from "./music.png";
import singerPng from "./singer.png";
import { getName } from "../../utils";

const Search = () => {
  const {
    searchHotList,
    searchSetHotList,
    searchSuggestList,
    searchSetSuggestList,
    searchSongsList,
  } = useStore();

  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    setShow(true);
    // 获取热门列表信息
    if (!searchHotList.length) {
      searchSetHotList();
    }
  }, []);

  const searchBack = useCallback(() => {
    setShow(false);
  }, []);

  const handleQuery = (q) => {
    if (!q) return;
    setQuery(q);
    // 调用查询接口
    searchSetSuggestList(q);
  };

  // 编写热门搜索列表

  const renderHotKey = () => {
    let list = searchHotList || [];
    return (
      <ul>
        {list.map((item) => {
          return (
            <li
              className="item"
              key={item.first}
              onClick={() => setQuery(item.first)}
            >
              <span>{item.first}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderSingers = () => {
    let singers = searchSuggestList.artists;
    if (!singers || !singers.length) {
      return;
    }
    return (
      <List>
        <h1 className="title">相关歌手</h1>
        {singers.map((item, index) => {
          return (
            <ListItem key={item.accountId + "" + index}>
              <div className="img_wrapper">
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={singerPng}
                      alt="singer"
                    />
                  }
                >
                  <img
                    src={item.picUrl}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
              </div>
              <span className="name"> 歌手: {item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };

  const renderAlbum = () => {
    let albums = searchSuggestList.albums;
    if (!albums || !albums.length) return;
    return (
      <List>
        <h1 className="title">相关歌单</h1>
        {albums.map((item, index) => {
          return (
            <ListItem key={item.accountId + "" + index}>
              <div className="img_wrapper">
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={musicPng}
                      alt="music"
                    />
                  }
                >
                  <img
                    src={item.artist.picUrl}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
              </div>
              <span className="name"> 歌单: {item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };

  const renderSongs = () => {
    return (
      <SongItem style={{ paddingLeft: "20px" }}>
        {searchSongsList.map((item) => {
          return (
            <li key={item.id}>
              <div className="info">
                <span>{item.name}</span>
                <span>
                  {getName(item.artists)} - {item.album.name}
                </span>
              </div>
            </li>
          );
        })}
      </SongItem>
    );
  };

  return (
    <CSSTransition
      in={show}
      timeout={300}
      appear={true}
      classNames="fly"
      onExit={() => goBack()}
    >
      <Container>
        {/* 热门列表 */}
        <ShortcutWrapper show={!query}>
          <Scroll>
            <div>
              <HotKey>
                <h1 className="title"> 热门搜索 </h1>
                {renderHotKey()}
              </HotKey>
            </div>
          </Scroll>
        </ShortcutWrapper>
        <ShortcutWrapper show={query}>
          <Scroll onScroll={forceCheck}>
            <div>
              {renderSingers()}
              {renderAlbum()}
              {renderSongs()}
            </div>
          </Scroll>
        </ShortcutWrapper>
        <div className="search_box_wrapper">
          <SearchBox
            back={searchBack}
            newQuery={query}
            handleQuery={handleQuery}
          ></SearchBox>
        </div>
      </Container>
    </CSSTransition>
  );
};

export default memo(Search);
