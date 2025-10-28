import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { auth } from "../services/firebase";

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isAuthenticated } = useAuthStore();

  console.log("Current user from Firebase auth:", auth.currentUser);
  if (!auth.currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
export const AuthGuard = () => {
  return (
    <RequireAuth>
      <Outlet />
    </RequireAuth>
  );
};
