import { memo } from "react";

function Recommend() {
  const bannerList = [1, 2, 3, 4].map((item) => {
    return {
      imgUrl: `http://p1.music.126.net/ZYLJ2oZn74yUz5x8NBGkVA==/109951164331219056.jpg`,
    };
  });
  return <div></div>;
}

export default memo(Recommend);
