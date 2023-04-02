import { Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Rank from "../pages/Rank";
import Recommend from "../pages/Recommend";
import Singers from "../pages/Singers";

const routers = [
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "recommend",
        element: <Recommend />,
        index: true,
      },
      {
        path: "singers",
        element: <Singers />,
      },
      {
        path: "rank",
        element: <Rank />,
      },
    ],
  },
];

export default routers;
