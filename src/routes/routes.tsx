import { createBrowserRouter } from "react-router-dom";
import { Login } from "../pages/Login";
import { Signup } from "../pages/Signup";
import { AuthGuard } from "../components/RequireAuth";
import PrivateRoutes from "./privateRoutes";
import AuthorizationLayout from "../components/AuthLayout";
import ErrorPage from "../pages/ErrorPage";

export const routes = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <ErrorPage />,
  },
  {
    element: <AuthorizationLayout />,
    children: [...PrivateRoutes()],
    errorElement: <ErrorPage />,
  },

]);

export default routes;
