import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { obtenerConcursoPorId } from '../api';

const JuradoConcursos = () => {
  const { id } = useParams();

  const stateLocation = useLocation().state;
  const [concurso, setConcurso] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        if (!stateLocation) {
          const concursoData = await obtenerConcursoPorId(id);
          setConcurso(concursoData);
          return
        }
        setConcurso(stateLocation.concurso);
      } catch (error) {
        navigate("/jurado")
      }
    })();
  }, [])

  return (
    <main className="bg-gray-100 min-h-screen p-6 md:p-8">
      <div className="max-w-screen-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 space-y-6">
          <Link to="/jurado" className="block text-center">
            <button className="bg-gray-200 text-gray-700 py-3 px-6 rounded-md w-full hover:bg-gray-300 transition duration-300 ease-in-out border border-gray-300">
              Volver
            </button>
          </Link>
          <div className="grid grid-cols-1 gap-4 md:gap-6 md:flex">
            {
              concurso.estado == "finalizado"
                ? <Link to={'/jurado/ranking/' + id}>
                  <button className="bg-green-500 text-white py-3 px-6 rounded-md w-full hover:bg-green-600 transition duration-300 ease-in-out border border-green-600">
                    Mostrar Ranking
                  </button>
                </Link>
                : ''
            }
            {
              concurso.estado == "evaluacion"
                ? <Link className='w-full' to={'/jurado/concurso/concursantes/' + id}>
                  <button className="bg-blue-500 text-white py-3 px-6 rounded-md w-full hover:bg-blue-600 transition duration-300 ease-in-out border border-blue-600">
                    Calificar Concursante
                  </button>
                </Link>
                : ''
            }
          </div>
        </div>
      </div>
    </main>
  );
};

export default JuradoConcursos;
