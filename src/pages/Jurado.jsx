import React, { useEffect, useState } from 'react';
import { obtenerConcursos } from '../api';
import { useSession } from '../hooks/useSession';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

const Jurado = () => {
  const [concursos, setConcursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { logout, usuario } = useSession();


  const fetchConcursos = async () => {
    try {
      setLoading(true)
      const data = await obtenerConcursos();
      setConcursos(data);
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchConcursos();
  }, []);

  return (
    <main className="bg-gray-100 min-h-screen p-6 md:p-8">
      <div className="max-w-screen-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">¡Bienvenido, {usuario.nombre}!</h2>
            <Button text="Cerrar Sesión" onClick={logout} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? 'Cargando Concuros...' : concursos.map((concurso) => (
              <Concurso key={concurso.id} concurso={concurso} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

const Concurso = ({ concurso }) => {
  return <Link state={{concurso}} className={concurso.estado=='inscripcion' ? 'cursor-default' : 'cursor-pointer'} to={concurso.estado!="inscripcion" ? '/jurado/concurso/' + concurso.id : ''}  >
    <div className={`"bg-white rounded-lg shadow-md p-4 ${concurso.estado != 'inscripcion' ? 'hover:bg-blue-100 cursor-pointer' : ''} transition duration-300 ease-in-out transform"`}>
      <h3 className="text-lg font-semibold text-gray-800">{concurso.nombre}</h3>
      <p className="text-gray-600 mt-2">{concurso.descripcion}</p>
      {
        <div className={
          `
              p-2 text-sm uppercase mt-2 bg-opacity-40 rounded-md text-center font-bold
              ${concurso.estado == "inscripcion"
            ? 'bg-blue-600 text-blue-700'
            : concurso.estado == "evaluacion"
              ? "bg-yellow-600 text-yellow-700"
              : concurso.estado == "finalizado"
                ? "bg-gray-600 text-gray-700"
                : ''
          }
              `
        }>{concurso.estado}</div>

      }
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-gray-500">Fecha: {new Date(concurso.fecha).toLocaleDateString('es-ES', {weekday: 'long',day: 'numeric', hour: 'numeric', hour12: true, month: 'long'})}</span>
      </div>
    </div>
  </Link>
}

export default Jurado;
