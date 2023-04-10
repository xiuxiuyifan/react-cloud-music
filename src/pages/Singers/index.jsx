import { useState } from "react";
import Horizon from "../../baseUI/horizon-item";
import { NavContainer } from "./style";
import { alphaTypes, categoryTypes } from "../../api/static";

function Singers() {
  // 分类
  const [category, setCategory] = useState("");
  const handleUpdateCategory = (val) => {
    setCategory(val);
  };

  const [alpha, setAlpha] = useState("");
  const handleUpdateAlpha = (val) => {
    setAlpha(val);
  };
  return (
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
  );
}

export default Singers;
