import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import AddRecipe from "./Addrecipe";
import EditRecipe from "./Editrecipe";
import ViewRecipe from "./Viewrecipe";

const router = createBrowserRouter([
  { path: "", element: <App /> },
  { path: "login", element: <Login /> },
  { path: "signup", element: <Signup /> },
  { path: "userdashboard", element: <Dashboard /> },
  { path: "addrecipe", element: <AddRecipe /> },
  { path: "profile", element: <Profile /> },
  { path: "editrecipe/:id", element: <EditRecipe /> },
  { path: "viewrecipe/:id", element: <ViewRecipe /> },
]);

export default router;
