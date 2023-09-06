import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { crearJurado } from '../api';
import { RiEyeCloseLine, RiEyeLine } from 'react-icons/ri';
import Loader from '../components/Loader';
import Skeleton from '../components/Skeleton';

const CrearJurado = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const { register, handleSubmit, formState: {isSubmitting} } = useForm();

  const crearJuradoSubmit = async (data) => {
    try {
      const rol = data.rol;
      delete data.rol
      await crearJurado(data, rol);
      navigate('/admin');
    } catch (error) {
      alert("Puede ser que el usuario esté repetido o un error en el servidor")
      console.log(error);
    }
  };

  return (
    <main className="px-4 py-8 bg-gray-100 min-h-screen">
      <div className="max-w-screen-lg mx-auto bg-white rounded-lg overflow-hidden shadow-md">
        <div className="p-6 md:p-8">
          <Link to="/admin" className="block mb-4">
            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
              Regresar
            </button>
          </Link>
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">Crear Jurado/Encargado</h1>

          <form onSubmit={handleSubmit(crearJuradoSubmit)} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-gray-600 font-semibold">
                Nombre
              </label>
              <input
                {...register('nombre', { required: 'El nombre es requerido' })}
                type="text"
                id="nombre"
                placeholder="Nombre"
                className="w-full p-3 rounded-md border focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="usuario" className="block text-gray-600 font-semibold">
                Usuario
              </label>
              <input
                {...register('usuario', { required: 'El usuario es requerido' })}
                type="text"
                id="usuario"
                placeholder="Usuario"
                className="w-full p-3 rounded-md border focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Contraseña
              </label>
              <div className="relative">
                <div className="relative flex ">
                  <input
                    {...register("password", { required: true })}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full p-3 rounded-md border focus:outline-none focus:border-blue-500"
                    placeholder="Contraseña"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                    onClick={handleTogglePassword}
                  >
                    {showPassword ? <RiEyeCloseLine size={28} /> : <RiEyeLine size={28} />}
                  </button>
                </div>
              </div>
            </div>

            <div>

              <label htmlFor="Rol" className="block text-gray-600 font-semibold">
                Rol
              </label>

              <select {...register('rol', { required: true })} className="w-full p-3 rounded-md border focus:outline-none focus:border-blue-500">
                <option value="jurado">
                  Jurado
                </option>
                <option value="encargado">
                  Encargado
                </option>
              </select>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-blue-500 flex justify-center items-center text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              <Skeleton loading={isSubmitting} fallback={<Loader />}>
                Crear
              </Skeleton>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default CrearJurado;
