import { memo } from "react";
import { Outlet, NavLink, useMatch } from "react-router-dom";
import { Tab, TabItem, Top } from "./style";
import Player from "../Player";

function Home() {
  const matchRecommend = useMatch({ path: "/recommend" });
  const matchSingers = useMatch({ path: "/singers" });
  const matchRank = useMatch({ path: "/rank" });

  return (
    <div>
      <Top>
        <span className="iconfont menu">&#xe65c;</span>
        <span className="title">WebApp</span>
        <span className="iconfont search">&#xe62b;</span>
      </Top>
      <Tab>
        <NavLink to="/recommend" className={matchRecommend ? "selected" : ""}>
          <TabItem>
            <span>推荐</span>
          </TabItem>
        </NavLink>
        <NavLink to="/singers" className={matchSingers ? "selected" : ""}>
          <TabItem>
            <span>歌手</span>
          </TabItem>
        </NavLink>
        <NavLink to="/rank" className={matchRank ? "selected" : ""}>
          <TabItem>
            <span>排行榜</span>
          </TabItem>
        </NavLink>
      </Tab>
      <Outlet></Outlet>
      <Player></Player>
    </div>
  );
}

export default memo(Home);
