import { memo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { Container, HotKey, ShortcutWrapper } from "./style";
import SearchBox from "../../baseUI/search-box";
import Scroll from "../../baseUI/scroll";
import useStore from "../../store";

const Search = () => {
  const { searchHotList, searchSetHotList } = useStore();

  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    setShow(true);
    // 获取热门列表信息
    if (!searchHotList.length) {
      searchSetHotList();
    }
  }, []);

  const searchBack = useCallback(() => {
    setShow(false);
  }, []);

  const handleQuery = (q) => {
    setQuery(q);
  };

  // 编写热门搜索列表

  const renderHotKey = () => {
    let list = searchHotList || [];
    return (
      <ul>
        {list.map((item) => {
          return (
            <li
              className="item"
              key={item.first}
              onClick={() => setQuery(item.first)}
            >
              <span>{item.first}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <CSSTransition
      in={show}
      timeout={300}
      appear={true}
      classNames="fly"
      onExit={() => goBack()}
    >
      <Container>
        <ShortcutWrapper show={!query}>
          <Scroll>
            <div>
              <HotKey>
                <h1 className="title"> 热门搜索 </h1>
                {renderHotKey()}
              </HotKey>
            </div>
          </Scroll>
        </ShortcutWrapper>
        <div className="search_box_wrapper">
          <SearchBox
            back={searchBack}
            newQuery={query}
            handleQuery={handleQuery}
          ></SearchBox>
        </div>
      </Container>
    </CSSTransition>
  );
};

export default memo(Search);
