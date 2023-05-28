import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { Container } from "./style";

const Search = () => {
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <CSSTransition
      in={show}
      timeout={300}
      appear={true}
      classNames="fly"
      onExit={() => goBack()}
    >
      <Container>
        <div onClick={() => setShow(false)}>返回</div>
      </Container>
    </CSSTransition>
  );
};

export default memo(Search);
