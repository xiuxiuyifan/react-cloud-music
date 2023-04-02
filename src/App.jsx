import { GlobalStyle } from "./style";
import { useRoutes } from "react-router-dom";
import routers from "./routers";
import { IconStyle } from "./assets/iconfont/iconfont";

function App() {
  return (
    <>
      <GlobalStyle></GlobalStyle>
      <IconStyle></IconStyle>
      {useRoutes(routers)}
    </>
  );
}

export default App;
