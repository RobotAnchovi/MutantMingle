import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import Navigation from "./components/Navigation/Navigation";
import * as sessionActions from "./store/session";
import LandingPage from "./components/Home";
import GroupsList from "./components/Groups/GroupsList";
import ManageEvents from "./components/Events/ManageEvents";
import GroupDetails from "./components/Groups/GroupDetails";
import EventDetails from "./components/Events/EventDetails";
import CreateGroupForm from "./components/Groups/CreateGroupForm";
import CreateEventForm from "./components/Events/CreateEventForm";
import EditGroupPage from "./components/Groups/EditGroupPage/EditGroupPage";

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
        element: <LandingPage />,
      },
      {
        path: "/groups",
        element: <GroupsList />,
      },
      {
        path: "/events",
        element: <ManageEvents />,
      },
      {
        path: "groups/:id",
        element: <GroupDetails />,
      },
      {
        path: "events/:id",
        element: <EventDetails />,
      },
      {
        path: "groups/new",
        element: <CreateGroupForm />,
      },
      {
        path: "create-event",
        element: <CreateEventForm />,
      },
      {
        path: "edit-group",
        element: <EditGroupPage />,
      },
      // {
      //   path: 'login',
      //   element: <LoginFormPage />
      // },
      // {
      //   path: 'signup',
      //   element: <SignupFormPage />
      // }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
