import { Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Rank from "../pages/Rank";
import Recommend from "../pages/Recommend";
import Singers from "../pages/Singers";
import Album from "../pages/Album";

const routers = [
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "recommend",
        element: <Recommend />,
      },
      {
        path: "singers",
        element: <Singers />,
      },
      {
        path: "rank",
        element: <Rank />,
        children: [
          {
            path: ":id",
            element: <Album />,
          },
        ],
      },
      {
        path: "",
        element: <Navigate to="recommend" replace></Navigate>,
      },
    ],
  },
];

export default routers;
