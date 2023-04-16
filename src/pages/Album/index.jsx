import { memo } from "react";
import { Container } from "./style";
import { useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import Header from "../../baseUI/header";

// 专辑
function Album() {
  const [visible, setVisible] = useState(true);

  const navigate = useNavigate();

  const onExit = () => {
    navigate(-1);
  };

  const handleClick = () => {
    setVisible(false);
  };

  return (
    <CSSTransition
      in={visible}
      timeout={300}
      classNames="fly"
      unmountOnExit
      onExited={onExit}
      appear
    >
      <Container>
        <Header title="返回" handleClick={handleClick}></Header>
      </Container>
    </CSSTransition>
  );
}

export default memo(Album);
