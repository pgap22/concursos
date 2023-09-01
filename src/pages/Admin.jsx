import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUserPlus, FaPlus } from 'react-icons/fa';
import { useSession } from '../hooks/useSession';
import { obtenerConcursos, obtenerJurados } from '../api';
import { obtenerConcursantes } from '../api/concursantes';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-20">
    <div className="animate-spin rounded-full border-t-4 border-blue-500 h-12 w-12"></div>
  </div>
);

const IconButton = ({ to, text, icon }) => (
  <Link
    to={to}
    className="flex gap-2 items-center justify-center p-4 bg-white rounded-full shadow-md mb-2 transition duration-300 transform hover:scale-105"
  >
    <div className="text-blue-500 text-2xl">{icon}</div>
    <p className='font-bold text-gray-500'>{text}</p>
  </Link>
);

const Admin = () => {
  const [concursos, setConcursos] = useState([]);
  const [concursantes, setConcursantes] = useState([]);
  const [jurados, setJurados] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const { logout, usuario } = useSession();

  const location = useLocation();
  const successMessage = location.state?.successMessage;

  const clearSuccessMessage = () => {
    navigate("/admin", { state: { successMessage: null } });
  };

  useEffect(() => {
    (async () => {
      try {
        const [concursoData, juradosData, concursantesData] = await Promise.all([
          obtenerConcursos(),
          obtenerJurados(),
          obtenerConcursantes(),
        ]);
        setConcursos(concursoData);
        setJurados(juradosData);
        setConcursantes(concursantesData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
      <header className="bg-white py-4 px-8 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-blue-500 uppercase">{usuario.rol}</h1>
        <button onClick={logout} className="text-gray-500 hover:text-red-500">
          <FaSignOutAlt className="text-xl" />
        </button>
      </header>
      <main className="p-4 flex-grow">
        <div className='w-full flex justify-center'>
          <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-3 max-w-4xl">
            <IconButton text="Crear Concursante" to="/admin/crear-concursante" icon={<FaUserPlus />} />
            <IconButton text="Crear Jurado/Encargado" to="/admin/crear-jurado" icon={<FaUserPlus />} />
            <IconButton text="Crear Concurso" to="/admin/crear-concurso" icon={<FaPlus />} />
          </div>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {successMessage && (
              <div
                onClick={clearSuccessMessage}
                className="bg-green-200 text-green-800 p-3 rounded-lg mb-4 cursor-pointer transition duration-300 hover:bg-green-300"
              >
                {successMessage}
              </div>
            )}
            <Section title="Concurso" items={concursos} itemType="concurso" />
            {/* <Section title="Concursante" items={concursantes} itemType="concursante" /> */}
            <Section title="Jurado" items={jurados.filter(jurado => jurado.rol == "jurado")} itemType="jurado" />
            <Section title="Encargado" items={jurados.filter(jurado => jurado.rol == "encargado")} itemType="encargado" />
          </>
        )}
      </main>

    </div>
  );
};
const Section = ({ title, items, itemType }) => (
  <div className="mt-4">
    <h2 className="text-lg font-semibold mb-2 text-gray-800">{title}</h2>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ItemLink
          key={item.id}
          to={`/admin/${itemType}/${item.id}`}
          itemType={itemType}
        >
          {item.nombre || item.nombres}
          {
            item.estado
            ? <div className={
              `
              p-2 text-sm uppercase mt-2 bg-opacity-40 rounded-md text-center font-bold
              ${
                item.estado=="inscripcion"
                ? 'bg-blue-600 text-blue-700'
                  : item.estado=="evaluacion"
                    ? "bg-yellow-600 text-yellow-700"
                    : item.estado=="finalizado"
                      ? "bg-gray-600 text-gray-700"
                      : ''
              }
              `
            }>{item.estado}</div>
            : ''
          }
        </ItemLink>
      ))}
    </div>
  </div>
);
const ItemLink = ({ to, children, itemType }) => (
  <Link
    to={to}
    className={`flex items-center justify-between p-4 bg-white rounded-md shadow-md transition duration-300 hover:bg-gray-100 ${itemType === 'concurso'
      ? 'border-l-4 border-blue-500'
      : itemType === 'concursante'
        ? 'border-l-4 border-green-500'
        : itemType === 'jurado'
          ? 'border-l-4 border-yellow-500'
          : itemType === 'encargado'
            ? 'border-l-4 border-red-500'
            : ''
      }`}
  >
    <div className="text-gray-800 text-lg">{children}</div>
  </Link>
);

export default Admin;
