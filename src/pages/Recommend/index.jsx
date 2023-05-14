import { memo, useEffect } from "react";
import Slider from "../../components/slider";
import RecommendList from "../../components/recommend-list";
import { Content } from "./style";
import Scroll from "../../baseUI/scroll";
import useStore from "../../store";
import { forceCheck } from "react-lazyload";
import Loading from "../../baseUI/loading";

function Recommend() {
  const {
    bannerList,
    initBannerList,
    recommendList,
    initRecommendList,
    recommendLoading,
    playerPlayList,
  } = useStore();

  // 页面初始化
  useEffect(() => {
    if (!bannerList.length) {
      initBannerList();
    }
    if (!recommendList.length) {
      initRecommendList();
    }
  }, []);

  return (
    <Content className="list" play={playerPlayList.length}>
      {recommendLoading ? <Loading></Loading> : null}
      <Scroll onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerList}></Slider>
          <RecommendList recommendList={recommendList}></RecommendList>
        </div>
      </Scroll>
    </Content>
  );
}

export default memo(Recommend);
