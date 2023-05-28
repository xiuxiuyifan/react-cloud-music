import { memo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { Container } from "./style";
import SearchBox from "../../baseUI/search-box";

const Search = () => {
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    setShow(true);
  }, []);

  const searchBack = useCallback(() => {
    setShow(false);
  }, []);

  const handleQuery = (q) => {
    setQuery(q);
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
