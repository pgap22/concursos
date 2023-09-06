import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { crearConcurso } from "../api";
import { useSession } from "../hooks/useSession";
import Skeleton from "../components/Skeleton";
import Loader from "../components/Loader";

const CrearConcurso = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { usuario } = useSession();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError("");
    setSuccessMessage("");

    try {
      await crearConcurso(data);
      setSuccessMessage("¡El concurso se creó exitosamente!");
      navigate(`/${usuario.rol}`, { state: { successMessage: "¡El concurso se creó exitosamente!" } });
    } catch (error) {
      if (error.response) {
        setServerError("Error del servidor. Inténtelo de nuevo más tarde.");
      } else {
        setServerError("Hubo un problema al comunicarse con el servidor.");
      }
    }

    setIsLoading(false);
  };

  return (
    <main className="px-4 py-8 bg-gray-100 min-h-screen">
      <div className="max-w-screen-md mx-auto bg-white rounded-lg overflow-hidden shadow-md">
        <div className="p-6 md:p-8">
          <Link to={`/${usuario.rol}`}>
            <button className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-lg">
              Regresar
            </button>
          </Link>
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">Crear Concurso</h1>
          <p className="text-gray-500 mb-6">Complete el formulario para crear un nuevo concurso.</p>

          {serverError && <div className="bg-red-200 text-red-800 p-3 rounded-lg mb-4">{serverError}</div>}

          {successMessage && <div className="bg-green-200 text-green-800 p-3 rounded-lg mb-4">{successMessage}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="nombre" className="block text-gray-600 font-semibold mb-1">
                Nombre
              </label>
              <input
                {...register("nombre", { required: "El nombre es requerido" })}
                type="text"
                id="nombre"
                placeholder="Nombre"
                className={`w-full p-3 rounded-md border ${errors.nombre ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500`}
              />
              {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-gray-600 font-semibold mb-1">
                Descripción
              </label>
              <textarea
                {...register("descripcion", { required: true })}
                id="descripcion"
                placeholder="Descripción"
                className={`w-full p-3 rounded-md border ${errors.descripcion ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500`}
              />
              {errors.descripcion && <p className="text-red-500">La descripción es requerida</p>}

            </div>
            <div>
              <label htmlFor="fecha" className="block text-gray-600 font-semibold mb-1">
                Fecha
              </label>
              <input
                {...register("fecha", { required: true, valueAsDate: true })}
                type="datetime-local"
                id="fecha"
                min={new Date("2023-09-07").toLocaleDateString("sv", { hour: 'numeric', minute: 'numeric' })}
                max={new Date("2023-09-11").toLocaleDateString("sv", { hour: 'numeric', minute: 'numeric' })}
                className={`w-full p-3 rounded-md border ${errors.fecha ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-blue-500`}
              />
              {errors.fecha && <p className="text-red-500">La fecha es requerida</p>}

            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-blue-500 flex justify-center items-center text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              <Skeleton loading={isLoading} fallback={<Loader />}>
                Crear
              </Skeleton>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default CrearConcurso;
