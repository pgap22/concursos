import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { actualizarJurado, eliminarJurado, obtenerJuradoPorId } from '../api';
import { useForm } from 'react-hook-form';
import { RiEyeCloseLine, RiEyeLine } from 'react-icons/ri';
import Skeleton from '../components/Skeleton';
import Loader from '../components/Loader';

const EditarJurado = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const [jurado, setJurado] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const editarJuradoSubmit = async (data) => {
    try {
      await actualizarJurado(id, data);
      navigate('/admin');
    } catch (error) {
      alert("Puede ser que el usuario esté repetido o un error en el servidor")
      console.log(error);
    }
  };

  const eliminarJuradoClick = async () => {
    try {
      setLoading(true)
      await eliminarJurado(id);
      navigate('/admin');
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  };

  const obtenerJurado = async () => {
    try {
      const data = await obtenerJuradoPorId(id);
      setJurado(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerJurado();
  }, []);

  if (!jurado.id) return <p>Cargando...</p>;

  return (
    <main className="px-4 py-8 bg-gray-100 min-h-screen">
      <div className="max-w-screen-lg mx-auto bg-white rounded-lg overflow-hidden shadow-md">
        <div className="p-6 md:p-8">
          <Link to="/admin" className="block mb-4">
            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
              Regresar
            </button>
          </Link>
          <form onSubmit={handleSubmit(editarJuradoSubmit)} className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">Editar {jurado.rol}</h2>
            <div>
              <label htmlFor="nombre" className="block text-gray-600 font-semibold">
                Nombre
              </label>
              <input
                {...register('nombre', { required: true, value: jurado.nombre })}
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
                {...register('usuario', { required: true, value: jurado.usuario })}
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
                    {...register("password", { value: jurado.password, required: true })}
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


            <button
              disabled={isSubmitting || loading}
              type="submit"
              className="w-full mt-4 bg-blue-500 flex justify-center items-center text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              <Skeleton loading={isSubmitting} fallback={<Loader />}>
                Editar
              </Skeleton>
            </button>
          </form>
          <button
            disabled={loading}
            onClick={eliminarJuradoClick}
            className={"mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none "+(loading ? 'opacity-40' : '')}
          >
            Eliminar
          </button>
        </div>
      </div>
    </main>
  );
};

export default EditarJurado;
