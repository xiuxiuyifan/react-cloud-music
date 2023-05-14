import { useEffect, useRef, useState } from "react";
import Horizon from "../../baseUI/horizon-item";
import { List, ListContainer, ListItem, NavContainer } from "./style";
import { alphaTypes, categoryTypes } from "../../api/static";
import Scroll from "../../baseUI/scroll";
import useStore from "../../store";
import LazyLoad, { forceCheck } from "react-lazyload";
import singerPng from "./singer.png";
import { debounce } from "../../utils";
import { Outlet, useNavigate } from "react-router-dom";

// 渲染函数，返回歌手列表组件

const renderSingerList = () => {
  const {
    singerList,
    singerSetSingerHotList,
    singerSetCategoryOrAlphaSingerList,
    singerEnterLoading,
    singerPullUpLoading,
    singerPullDownLoading,
    singerPageCount,
  } = useStore();

  // 初始化数据
  useEffect(() => {
    if (!singerList.length) {
      singerSetSingerHotList(0);
    }
  }, []);

  const navigate = useNavigate();

  const enterDetail = (id) => {
    navigate(`/singers/${id}`);
  };
  return (
    <List>
      {singerList.map((item, index) => {
        return (
          <ListItem
            key={item.accountId + "" + index}
            onClick={() => enterDetail(item.id)}
          >
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
                  src={`${item.picUrl}?param=300*300`}
                  width="100%"
                  height="100%"
                  alt="singer"
                />
              </LazyLoad>
            </div>
            <span className="name">{item.name}</span>
          </ListItem>
        );
      })}
    </List>
  );
};

function Singers() {
  const {
    singerList,
    singerSetSingerHotList,
    singerSetCategoryOrAlphaSingerList,
    singerEnterLoading,
    singerSetEnterLoading,
    singerPullUpLoading,
    singerSetPullUploading,
    singerPullDownLoading,
    singerSetPullDownLoading,
    singerPageCount,
    singerSetPageCount,
    singerSetSingerHotListPullUp,
    singerSetCategoryOrAlphaSingerListPullUp,
    playerPlayList,
  } = useStore();
  const singerListRef = useRef(null);

  // 分类
  const [category, setCategory] = useState("");
  const handleUpdateCategory = (val) => {
    setCategory(val);
    singerSetCategoryOrAlphaSingerList(val, alpha);
  };

  const [alpha, setAlpha] = useState("");
  const handleUpdateAlpha = (val) => {
    setAlpha(val);
    singerSetCategoryOrAlphaSingerList(category, val);
  };

  // 上拉加载
  const handlePullUp = debounce(() => {
    singerSetPageCount(singerPageCount + 1);
    if (category === "" && alpha === "") {
      singerSetSingerHotListPullUp();
    } else {
      singerSetCategoryOrAlphaSingerListPullUp(category, alpha);
    }
  }, 300);

  // 下拉刷新
  const handlePullDown = debounce(() => {
    // 下拉刷新的时候如果   分类和 alpha 都是空的话就获取 热门歌手
    // 否则获取歌手和 alpha
    if (category === "" && alpha === "") {
      singerSetSingerHotList(0);
    } else {
      singerSetCategoryOrAlphaSingerList(category, alpha);
    }
  }, 300);

  useEffect(() => {}, []);

  return (
    <div>
      <NavContainer>
        <Horizon
          title="分类（默认热门）"
          list={categoryTypes}
          oldVal={category}
          handleClick={handleUpdateCategory}
        ></Horizon>
        <Horizon
          title="首字母："
          list={alphaTypes}
          oldVal={alpha}
          handleClick={handleUpdateAlpha}
        ></Horizon>
      </NavContainer>
      <ListContainer play={playerPlayList.length}>
        <Scroll
          ref={singerListRef}
          pullUp={handlePullUp}
          pullDown={handlePullDown}
          pullUpLoading={singerPullUpLoading}
          pullDownLoading={singerPullDownLoading}
          onScroll={forceCheck}
        >
          {renderSingerList()}
        </Scroll>
      </ListContainer>
      <Outlet></Outlet>
    </div>
  );
}

export default Singers;
