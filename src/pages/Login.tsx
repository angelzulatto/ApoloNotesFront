import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { LoginRequest } from "../types";
import { ChromeIcon, LucideChrome } from "lucide-react";
import {
  firebaseLogin,
  firebaseSignUp,
  firebaseSignUpWithGoogle,
} from "../services/auth";
import { useState } from "react";

const schema = yup.object({
  username: yup.string().email().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const signUpSchema = yup.object({
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
  });

  type SignUpRequest = { email: string; password: string };
  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    formState: { errors: signUpErrors },
  } = useForm<SignUpRequest>({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      console.log("Attempting Firebase login with:", data);
      await firebaseLogin(data.username, data.password);
      navigate("/");
    } catch (error) {
      console.error("Firebase login failed:", error);
      setLoading(false);
      return;
    }
    // const success = await login(data);
    // if (success) {
    //   navigate("/");
    // }
  };

  const onSubmitSignUp = async (data: SignUpRequest) => {
    try {
      await firebaseSignUp(data.email, data.password);
      navigate("/");
    } catch (error) {
      console.error("Firebase signup failed:", error);
      setSignUpLoading(false);
      return;
    }
  };
  const onSubmitSignUpWithGoogle = async () => {
    try {
      await firebaseSignUpWithGoogle();
      navigate("/");
    } catch (error) {
      console.error("Firebase signup with google failed:", error);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full">
            <img src="/logo.png" alt="Logo" className="h-28" />
          </div>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-2 rounded-lg overflow-hidden border border-gray-200">
            <button
              type="button"
              className={`py-2 text-sm font-medium transition-colors ${
                activeTab === "login"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("login")}
              aria-selected={activeTab === "login"}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              className={`py-2 text-sm font-medium transition-colors ${
                activeTab === "signup"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("signup")}
              aria-selected={activeTab === "signup"}
            >
              Crear cuenta
            </button>
          </div>
        </div>

        {activeTab === "login" ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                {...register("username")}
                type="email"
                id="username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Ingresa tu email"
              />
              {errors.username && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <input
                {...register("password")}
                type="password"
                id="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Ingresa tu contraseña"
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              onClick={() => {
                setLoading(true);
                handleSubmit(onSubmit)();
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>
            <button
              type="button"
              onClick={onSubmitSignUpWithGoogle}
              className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
            >
              <ChromeIcon className="w-5 h-5" />
              <span> Iniciar sesión con Google</span>
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleSubmitSignUp(onSubmitSignUp)}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                {...registerSignUp("email")}
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Ingresa tu email"
              />
              {signUpErrors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {signUpErrors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password_signup"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <input
                {...registerSignUp("password")}
                type="password"
                id="password_signup"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Crea una contraseña (mín. 6 caracteres)"
              />
              {signUpErrors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {signUpErrors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={signUpLoading}
              onClick={() => {
                setSignUpLoading(true);
                handleSubmitSignUp(onSubmitSignUp)();
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {signUpLoading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
