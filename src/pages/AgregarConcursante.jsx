import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { obtenerConcursantes, removerDeConcurso, unirloAConcurso } from '../api/concursantes';
import { obtenerConcursantesConcursoDisponible, obtenerConcursoConcursantes, obtenerConcursoPorId } from '../api';
import { useSession } from '../hooks/useSession';

const AgregarConcursante = () => {
  const { concurso: dataConcurso } = useLocation().state;
  const { id } = useParams();
  const [concurso, setConcurso] = useState();
  const [concursantesConcurso, setConcursantesConcurso] = useState([])
  const [concursantes, setConcursantes] = useState([])
  const [loading, setLoading] = useState(true)
  const {usuario} = useSession();

  const { register, handleSubmit, reset } = useForm()

  const eliminarConcursanteClick = async (id_concursante) => {
    try {
      await removerDeConcurso(id_concursante, id);
      await obtenerConcursantesPage();
    } catch (error) {
      console.log(error)
    }
  }

  const agregarConcursante = async (data) => {
    try {
      await unirloAConcurso(data.id_concursante, id);
      await obtenerConcursantesPage();
    } catch (error) {
      console.log(error)
    }
  }

  const obtenerConcursoPage = async () => {
    try {
      if (!dataConcurso) {
        const data = await obtenerConcursoPorId(id);
        setConcurso(data);
        return
      }
      setConcurso(dataConcurso);
    } catch (error) {
      console.log(error)
    }
  }

  const obtenerConcursantesPage = async () => {
    try {
      const [concursantesConcursosData, concursatensData] = await Promise.all([
        obtenerConcursoConcursantes(id),
        obtenerConcursantesConcursoDisponible(id)
      ])

      setConcursantesConcurso(concursantesConcursosData.map(({concursante})=> concursante));
      setConcursantes(concursatensData)
      reset()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([
          obtenerConcursoPage(),
          obtenerConcursantesPage(),
        ])
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  if (loading) return <p>Cargando...</p>

  return (
    <main className="px-4 py-8 bg-gray-100 min-h-screen">
      <div className="max-w-screen-lg mx-auto bg-white rounded-lg overflow-hidden shadow-md">
        <div className="p-6 md:p-8">
          <Link to={`/${usuario.rol}/concurso/` + id} className="block mb-4">
            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
              Regresar
            </button>
          </Link>
          <h1 className='text-2xl mb-2 font-bold'>{concurso.nombre}</h1>
          <form onSubmit={handleSubmit(agregarConcursante)} className='mt-4'>
            <label className="font-semibold  text-gray-800 capitalize">Agregar Concursante</label>
            {
              concursantes.length
                ? <select {...register('id_concursante', { required: true })} className="cursor-pointer w-full p-3 mt-2 rounded-md border focus:outline-none focus:border-blue-500">
                  {concursantes.map((concursante) => (
                    <option key={concursante.id} value={concursante.id}>
                     {concursante.nombres} {concursante.apellidos}
                    </option>
                  ))}
                </select>
                : <p className='my-2'>No hay concursantes disponibles</p>
            }
            <button className='p-2 w-full text-white bg-blue-500 rounded-md mt-4 hover:bg-blue-700 transition-all'>Agregar Concursante</button>
          </form>

          <h2 className="text-2xl font-bold my-4">Concursantes</h2>
          <div className="space-y-6">
            {concursantesConcurso.map((concursante) => (
              <div key={concursante.id} className="flex border items-center justify-between bg-white rounded-md p-4 shadow">
                <p className="text-lg font-medium">{concursante.nombres} {concursante.apellidos}</p>
                <button
                  onClick={() => eliminarConcursanteClick(concursante.id)}
                  className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-700 transition-colors"
                >
                  Eliminar del concurso
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default AgregarConcursante