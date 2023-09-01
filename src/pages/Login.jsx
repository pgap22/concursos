import { useForm } from "react-hook-form"
import { login } from "../api";
import { useSession } from "../hooks/useSession";
import { useNavigate } from "react-router-dom";
import { RiEyeCloseLine, RiEyeLine } from 'react-icons/ri';
import { useState } from "react";
import Alert from "../components/Alert";
import { AxiosError } from "axios";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const [error, setError] = useState('')

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { login: loginUsuario } = useSession();
  
  const loginSubmit = async (data) => {
    try {
      const usuario = await login(data);
      loginUsuario(usuario);
      navigate("/admin");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response.status == 401) {
          setError("Credenciales Incorrectas")
          return;
        }
      }

      setError("Error del servidor")
    }
  }

  return (
    <div className="flex md:items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full md:w-96">
        <h2 className="text-2xl font-semibold mb-4">Iniciar sesión</h2>
        {
          error && <Alert message={error} type={"error"} />

        }
        <form onSubmit={handleSubmit(loginSubmit)} className="space-y-4">
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium">
              Usuario
            </label>
            <input
              {...register("usuario", { required: true })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Usuario"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium">
              Contraseña
            </label>
            <div className="relative flex ">
              <input
                {...register("password", { required: true })}
                type={showPassword ? 'text' : 'password'}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contraseña"
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-400"
                onClick={handleTogglePassword}
              >
                {showPassword ? <RiEyeCloseLine size={28} /> : <RiEyeLine size={28} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  )
}




export default Login
