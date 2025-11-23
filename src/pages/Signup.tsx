import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { firebaseSignUp } from "../services/auth";
import { useState } from "react";

const signUpSchema = yup.object({
    email: yup.string().email().required("Email is required"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(16, "Password must be at most 16 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,16}$/,
            "Password must contain at least one lowercase letter, one uppercase letter, and one number"
        ),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
});

type SignUpRequest = { email: string; password: string; confirmPassword: string };

export const Signup = () => {
    const [signUpLoading, setSignUpLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register: registerSignUp,
        handleSubmit: handleSubmitSignUp,
        formState: { errors: signUpErrors },
    } = useForm<SignUpRequest>({
        resolver: yupResolver(signUpSchema),
    });

    const onSubmitSignUp = async (data: SignUpRequest) => {
        setSignUpLoading(true);
        try {
            await firebaseSignUp(data.email, data.password);
            navigate("/");
        } catch (error) {
            console.error(error);
            setSignUpLoading(false);
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

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                    Crear cuenta
                </h2>

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

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Confirmar Contraseña
                        </label>
                        <input
                            {...registerSignUp("confirmPassword")}
                            type="password"
                            id="confirmPassword"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Confirma tu contraseña"
                        />
                        {signUpErrors.confirmPassword && (
                            <p className="text-red-600 text-sm mt-1">
                                {signUpErrors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={signUpLoading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {signUpLoading ? "Creando cuenta..." : "Crear cuenta"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Iniciar sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
