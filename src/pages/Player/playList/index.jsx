import { memo } from "react";
import { PlayListWrapper, ScrollWrapper } from "./style";
import { useState } from "react";

function PlayList(props) {
  const isShow = useState(false);
  return (
    <PlayListWrapper
      style={isShow === true ? { display: "block" } : { display: "none" }}
    >
      <div className="list_wrapper">
        <ScrollWrapper></ScrollWrapper>
      </div>
    </PlayListWrapper>
  );
}

export default memo(PlayList);
