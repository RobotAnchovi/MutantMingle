import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import Navigation from "./components/Navigation/Navigation-bonus";
import * as sessionActions from "./store/session";
import Home from "./components/Home";
import {
  CreateGroup,
  EditGroup,
  GroupDetails,
  GroupList,
  ManageGroup,
} from "./components/Group";
import {
  CreateEvent,
  EditEvent,
  EventDetails,
  EventList,
  ManageEvent,
} from "./components/Event";
import { Modal } from "./context/Modal";
import NotFound from "./components/NotFound";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <Modal />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "groups",
        element: <Outlet />,
        children: [
          {
            path: "/",
            element: <GroupList />,
          },
          {
            path: "create",
            element: <CreateGroup />,
          },
          {
            path: ":groupId",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <GroupDetails />,
              },
              {
                path: "edit",
                element: <EditGroup />,
              },
            ],
          },
          {
            path: "current",
            element: <ManageGroup />,
          },
        ],
      },
      {
        path: "events",
        element: <Outlet />,
        children: [
          {
            path: "/",
            element: <EventList />,
          },
          {
            path: "create",
            element: <CreateEvent />,
          },
          {
            path: ":eventId",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <EventDetails />,
              },
              {
                path: "edit",
                element: <EditEvent />,
              },
            ],
          },
          {
            path: "current",
            element: <ManageEvent />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
