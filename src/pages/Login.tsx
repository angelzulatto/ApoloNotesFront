import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { LoginRequest } from "../types";
import { ChromeIcon } from "lucide-react";
import {
  firebaseLogin,
  firebaseSignUpWithGoogle,
} from "../services/auth";
import { useState } from "react";
import { showToast } from "../services/toastService";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const schema = yup.object({
  username: yup.string().email().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const navigate = useNavigate();

  // TEMPORARY: Trigger error for verification
  if (new URLSearchParams(window.location.search).get('error')) {
    throw new Error("This is a test error to verify the Error Page.");
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginRequest) => {
    setLoading(true);
    try {
      console.log("Attempting Firebase login with:", data);
      await firebaseLogin(data.username, data.password);
      navigate("/");
    } catch (error) {
      setLoading(false);
      return;
    }
  };

  const onSubmitSignUpWithGoogle = async () => {
    try {
      await firebaseSignUpWithGoogle();
      navigate("/");
    } catch (error) {
      showToast("Error al iniciar sesión con Google", "error");
      return;
    }
  };

  const handleVerificationSuccess = (token: string, ekey: string) => {
    console.log("Captcha verified", token);
    setCaptchaToken(token);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full">
            <img src="/logo.png" alt="Logo" className="h-28" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Iniciar sesión
        </h2>

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
          <div className="flex justify-center">
            <HCaptcha
              sitekey={import.meta.env.VITE_CAPTCHA_KEY}
              onVerify={handleVerificationSuccess}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !captchaToken}
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

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
