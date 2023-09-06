import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerConcursoConcursantes } from '../api';
import { Button } from '../components/Button'; // Imagina que tienes un componente reutilizable para el botón estilo Apple
import { useSession } from '../hooks/useSession';

const JuradoConcursantes = () => {
  const { id } = useParams();

  const [concursantes, setConcursantes] = useState([]);

  const {usuario} = useSession();

  const obtenerConcursantes = async () => {
    try {
      const data = await obtenerConcursoConcursantes(id);
      setConcursantes(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerConcursantes();
  }, []);

  return (
    <main className="bg-gray-100 min-h-screen p-6 md:p-8">
      <div className="max-w-screen-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Selecciona al concursante a evaluar</h2>
            <Link className='w-full md:w-[auto] my-2' to={"/jurado/concurso/"+id}>
              <Button text="Volver" />
            </Link>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            {concursantes.filter(({concursante})=> !concursante.evaluaciones.length).map(({ concursante }) => (
              <Link key={concursante.id} to={`/jurado/evaluar/${concursante.id}/${id}`}>
                <button className="bg-blue-500 text-white py-3 px-6 rounded-md font-bold w-full hover:bg-blue-600 transition duration-300 ease-in-out border border-blue-600 focus:outline-none focus:border-blue-800">
                  {concursante.nombres} {concursante.apellidos}
                </button>
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-4">
            <h2 className='font-bold text-2xl'>Participantes Ya Evaluados</h2>
            {concursantes.filter(({concursante})=> concursante.evaluaciones.length).map(({ concursante }) => (
              <Link key={concursante.id} to={`/jurado/evaluar/${concursante.id}/${id}`}>
                <button className="bg-yellow-500 text-white py-3 px-6 rounded-md font-bold w-full hover:bg-yellow-600 transition duration-300 ease-in-out border border-yellow-600 focus:outline-none focus:border-yellow-800">
                  {concursante.nombres} {concursante.apellidos}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default JuradoConcursantes;
