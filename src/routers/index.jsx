import { Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const Rank = lazy(() => import("../pages/Rank"));
const Recommend = lazy(() => import("../pages/Recommend"));
const Singers = lazy(() => import("../pages/Singers"));
const Album = lazy(() => import("../pages/Album"));
const Singer = lazy(() => import("../pages/Singer"));
const Search = lazy(() => import("../pages/Search"));

const SuspenseComponent = (Component) => {
  return (
    <Suspense fallback={null}>
      <Component></Component>
    </Suspense>
  );
};

const routers = [
  {
    path: "/",
    element: SuspenseComponent(Home),
    children: [
      {
        path: "recommend",
        element: SuspenseComponent(Recommend),
        children: [
          {
            path: ":id",
            element: SuspenseComponent(Album),
          },
        ],
      },
      {
        path: "singers",
        element: SuspenseComponent(Singers),
        children: [
          {
            path: ":id",
            element: SuspenseComponent(Singer),
          },
        ],
      },
      {
        path: "rank",
        element: SuspenseComponent(Rank),
        children: [
          {
            path: ":id",
            element: SuspenseComponent(Album),
          },
        ],
      },
      {
        path: "album/:id",
        element: SuspenseComponent(Album),
      },
      {
        path: "search",
        element: SuspenseComponent(Search),
      },
      {
        path: "",
        element: <Navigate to="recommend" replace></Navigate>,
      },
    ],
  },
];

export default routers;
