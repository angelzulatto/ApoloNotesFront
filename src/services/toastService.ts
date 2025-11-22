export type ToastType = "success" | "error" | "info";

type ToastHandler = (message: string, type?: ToastType) => void;

let handler: ToastHandler | null = null;

export const registerToastHandler = (fn: ToastHandler) => {
  handler = fn;
};

export const unregisterToastHandler = () => {
  handler = null;
};

export const showToast = (message: string, type: ToastType = "info") => {
  if (handler) {
    handler(message, type);
    return;
  }
  // Fallback: log so developers notice when no UI is mounted
  // eslint-disable-next-line no-console
  console.warn("[toastService] no handler registered, message:", message);
};

export default {
  registerToastHandler,
  unregisterToastHandler,
  showToast,
};
