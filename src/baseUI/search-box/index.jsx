import { memo, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "../../assets/global-style";
import styled from "styled-components";
import { debounce } from "../../utils";

const SearchBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  padding-right: 20px;
  height: 40px;
  background: ${style["theme-color"]};
  .icon-back {
    font-size: 24px;
    color: ${style["font-color-light"]};
  }
  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: ${style["theme-color"]};
    color: ${style["highlight-background-color"]};
    font-size: ${style["font-size-m"]};
    outline: none;
    border: none;
    border-bottom: 1px solid ${style["border-color"]};
    &::placeholder {
      color: ${style["font-color-light"]};
    }
  }
  .icon-delete {
    font-size: 16px;
    color: ${style["background-color"]};
  }
`;

const SearchBox = (props) => {
  const [query, setQuery] = useState("");

  const queryRef = useRef();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  // 父组件热门搜索拿到的新关键词
  const { newQuery } = props;

  // 触发搜索事件后的处理逻辑，从外部传入
  const { handleQuery } = props;

  const handleChange = (e) => {
    let value = e.target.value;
    // 调用父组件的回调方法
    setQuery(value);
    debounce(handleQuery)(value);
  };

  const clearQuery = () => {
    setQuery("");
    queryRef.current.focus();
  };

  const displayStyle = query ? { display: "block" } : { display: "none" };

  // 进场的时候光标选中
  useEffect(() => {
    queryRef.current.focus();
  }, []);

  return (
    <SearchBoxWrapper>
      <i className="iconfont icon-back" onClick={() => goBack()}>
        &#xe655;
      </i>
      <input
        ref={queryRef}
        className="box"
        placeholder="搜索歌曲、歌手、专辑"
        value={query}
        onChange={handleChange}
      />
      <i
        className="iconfont icon-delete"
        onClick={clearQuery}
        style={displayStyle}
      >
        &#xe600;
      </i>
    </SearchBoxWrapper>
  );
};

export default memo(SearchBox);
