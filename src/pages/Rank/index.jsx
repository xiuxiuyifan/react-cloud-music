import { Container, List, ListItem, SongList } from "./style";
import Scroll from "../../baseUI/scroll";
import useStore from "../../store";
import { filterIndex } from "../../utils";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Loading from "../../baseUI/loading";

function Rank() {
  const { rankLoading, rankList, rankSetRankList, playerPlayList } = useStore();

  const navigate = useNavigate();

  const enterDetail = (id) => {
    navigate(`/rank/${id}`);
  };

  const renderSongList = (list) => {
    return list.length ? (
      <SongList>
        {list.map((item, index) => {
          return (
            <li key={index}>
              {index + 1}. {item.first} - {item.second}
            </li>
          );
        })}
      </SongList>
    ) : null;
  };
  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>
        {list.map((item, index) => {
          return (
            <ListItem
              key={`${item.coverImagId}${index}`}
              tracks={item.tracks}
              onClick={() => enterDetail(item.id)}
            >
              <div className="img_wrapper">
                <img src={item.coverImgUrl} alt="" />
                <div className="decorate"></div>
                <span className="update_frequecy">{item.updateFrequecy}</span>
              </div>
              {renderSongList(item.tracks)}
            </ListItem>
          );
        })}
      </List>
    );
  };

  let displayStyle = rankLoading ? { display: "none" } : { display: "" };

  let globalStartIndex = filterIndex(rankList);
  let officialList = rankList.slice(0, globalStartIndex);
  let globalList = rankList.slice(globalStartIndex);

  useEffect(() => {
    rankSetRankList();
  }, []);

  return (
    <Container play={playerPlayList.length}>
      <Scroll>
        <div>
          <h1 className="offical" style={displayStyle}>
            官方榜
          </h1>
          {renderRankList(officialList)}
          <h1 className="global" style={displayStyle}>
            全球榜
          </h1>
          {renderRankList(globalList, true)}
        </div>
      </Scroll>
      {rankLoading ? <Loading></Loading> : null}
      {/* 子路由进入详情 */}
      <Outlet></Outlet>
    </Container>
  );
}

export default Rank;
