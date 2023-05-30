import { memo } from "react";
import { ListWrapper, List, ListItem } from "./style";
import { getCount } from "../../utils";
import LazyLoad from "react-lazyload";
import musicPng from "./music.png";
import { useNavigate } from "react-router-dom";

const RecommendList = (props) => {
  const navigate = useNavigate();
  return (
    <ListWrapper>
      <h1 className="title">推荐歌单</h1>
      <List>
        {props.recommendList.map((item, index) => {
          return (
            <ListItem
              key={item.id + index}
              onClick={() => navigate(`/recommend/${item.id}`)}
            >
              <div className="img_wrapper">
                <div className="decorate"></div>
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
                    src={item.picUrl + "?param=300*300"}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
                <div className="play_count">
                  <i className="iconfont play">&#xe885;</i>
                  <span className="count">{getCount(item.playCount)}</span>
                </div>
                <div className="desc">{item.name}</div>
              </div>
            </ListItem>
          );
        })}
      </List>
    </ListWrapper>
  );
};

export default memo(RecommendList);
