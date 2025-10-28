import { createBrowserRouter } from "react-router-dom";
import { Login } from "../pages/Login";
import { AuthGuard } from "../components/RequireAuth";
import PrivateRoutes from "./privateRoutes";
import AuthorizationLayout from "../components/AuthLayout";

export const routes = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <AuthorizationLayout />,
    children: [...PrivateRoutes()],
  },
]);

export default routes;
