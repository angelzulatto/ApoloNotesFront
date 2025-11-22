import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    // error is type `ErrorResponse`
    errorMessage = error.statusText || error.data?.message || "Unknown error";
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = 'Unknown error';
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Ups! Algo salió mal
        </h1>
        
        <p className="text-gray-600 mb-8">
          Lo sentimos, ha ocurrido un error inesperado.
          <br />
          <span className="text-sm text-gray-500 mt-2 block font-mono bg-gray-100 p-2 rounded">
            {errorMessage}
          </span>
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <RefreshCcw className="w-5 h-5" />
            Recargar página
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <Home className="w-5 h-5" />
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
