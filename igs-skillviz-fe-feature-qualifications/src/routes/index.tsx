import { RouteObject, redirect } from "react-router-dom";
import App from "../App";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import MySkills from "../pages/myskills";
import UpdateSkills from "../pages/myskills/update";
import localforage from "localforage";
import MyExperience from "../pages/myexperience";
import UpdateExperience from "../pages/myexperience/update";
import MyEducation from "../pages/myeducation";
import MyCertification from "../pages/mycertification";
import UpdateEducation from "../pages/myeducation/update";
import UpdateCertification from "../pages/mycertification/update";
import { NotFound } from "../pages/not-found";
import ky from "ky";

export const routes: Array<RouteObject> = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        loader: async () => {
          const loggedIn = await localforage.getItem("logged_in");
          if (loggedIn) {
            const response = await ky(
              `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_ENDPOINT}${import.meta.env.VITE_USERS}/1234ABC`,
            ).json();
            if (response) {
              await localforage.setItem("userData", response);
              return redirect("/dashboard");
            }
          }
          return redirect("/login");
        },
        shouldRevalidate: () => true,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "my-skills",
        element: <MySkills />,
      },
      {
        path: "my-skills/update",
        element: <UpdateSkills />,
      },
      {
        path: "my-experience",
        element: <MyExperience />,
      },
      {
        path: "my-experience/update/:type",
        element: <UpdateExperience />,
      },
      {
        path: "my-education",
        element: <MyEducation />,
      },
      {
        path: "my-education/update/:type",
        element: <UpdateEducation />,
      },
      {
        path: "my-certification",
        element: <MyCertification />,
      },
      {
        path: "my-certification/update/:type",
        element: <UpdateCertification />,
      },
    ],
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];
