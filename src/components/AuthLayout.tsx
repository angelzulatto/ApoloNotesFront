import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { LoaderIcon } from "lucide-react";

export default function AuthorizationLayout() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderIcon />
      </div>
    );

  return user ? <Outlet /> : <Navigate to="/login" />;
}
