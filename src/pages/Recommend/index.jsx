import { memo, useEffect } from "react";
import Slider from "../../components/slider";
import RecommendList from "../../components/recommend-list";
import { Content } from "./style";
import Scroll from "../../baseUI/scroll";
import useRecommendStore from "./store";

function Recommend() {
  const bannerList = useRecommendStore((store) => store.bannerList);
  const initBannerList = useRecommendStore((store) => store.initBannerList);

  const recommendList = useRecommendStore((store) => store.recommendList);
  const initRecommendList = useRecommendStore(
    (store) => store.initRecommendList
  );

  // 页面初始化
  useEffect(() => {
    initBannerList();
    initRecommendList();
  }, []);

  return (
    <Content className="list">
      <Scroll>
        <div>
          <Slider bannerList={bannerList}></Slider>
          <RecommendList recommendList={recommendList}></RecommendList>
        </div>
      </Scroll>
    </Content>
  );
}

export default memo(Recommend);
