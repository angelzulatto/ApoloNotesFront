import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes";
import { useEffect } from "react";
import { useToast, ToastType } from "./hooks/useToast";
import { ToastContainer } from "./components/Toast";
import {
  registerToastHandler,
  unregisterToastHandler,
} from "./services/toastService";

export default function RootApp() {
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    registerToastHandler((message: string, type: ToastType = "info") => {
      showToast(message, type);
    });
    return () => unregisterToastHandler();
  }, [showToast]);

  return (
    <>
      <RouterProvider router={routes} />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}
