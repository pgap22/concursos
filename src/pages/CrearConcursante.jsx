import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { crearConcursante } from '../api/concursantes';
import { useSession } from '../hooks/useSession';
import Skeleton from '../components/Skeleton';
import Loader from '../components/Loader';

const CrearConcursante = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const { usuario } = useSession();

  const crearConcursanteSubmit = async (data) => {
    try {
      await crearConcursante(data);
      navigate(`/${usuario.rol}`);
    } catch (error) {
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
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">Crear Concursante</h1>

          <form onSubmit={handleSubmit(crearConcursanteSubmit)} className="space-y-6">
            <div>
              <label htmlFor="nombres" className="block text-gray-600 font-semibold">
                Nombres
              </label>
              <input
                {...register('nombres', { required: 'Los nombres son requeridos' })}
                type="text"
                id="nombres"
                placeholder="Nombres"
                className="w-full p-3 rounded-md border focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>

              <label htmlFor="apellidos" className="block text-gray-600 font-semibold">
                Apellidos
              </label>
              <input
                {...register('apellidos', { required: 'Los apellidos son requeridos' })}
                type="text"
                id="apellidos"
                placeholder="Apellidos"
                className="w-full p-3 rounded-md border focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="grado" className="block text-gray-600 font-semibold">
                Grado
              </label>
              <select className="w-full p-3 rounded-md border focus:outline-none focus:border-blue-500"
                {...register('grado', { required: 'El grado es requerido' })}
              >
                <option value="Segundo Ciclo">Segundo Ciclo</option>
                <option value="Tercer Ciclo">Tercer Ciclo</option>
                <option value="Bachillerato">Bachillerato</option>
              </select>
            </div>

            <div>

              <label htmlFor="institucion" className="block text-gray-600 font-semibold">
                Institucion Educativa
              </label>
              <input
                {...register('institucion', { required: 'Los institucion son requeridos' })}
                type="text"
                id="institucion"
                placeholder="Ej. Colegio Don Bosco"
                className="w-full p-3 rounded-md border focus:outline-none focus:border-blue-500"
              />
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

export default CrearConcursante;
