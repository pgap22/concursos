import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { agregarJuradoConcurso, eliminarJuradoConcurso, obtenerConcursoPorId, obtenerJurados, obtenerJuradosConcurso, obtenerJuradosConcursoDisponible } from '../api';
import { useForm } from 'react-hook-form';
import { useSession } from '../hooks/useSession';
import Skeleton from '../components/Skeleton';
import Loader from '../components/Loader';

const AgregarJurado = () => {
  const { concurso: dataConcurso } = useLocation().state;
  const { id } = useParams();
  const [concurso, setConcurso] = useState();
  const [juradosConcurso, setJuradosConcuros] = useState([])
  const [jurados, setJurados] = useState([])
  const [loading, setLoading] = useState(true)
  const { usuario } = useSession();

  const { register, handleSubmit, reset, formState: {isSubmitting} } = useForm()
  const [loadingDelete, setLoadingDelete] = useState(false);

  const eliminarJurado = async (id_jurado) => {
    try {
      setLoadingDelete(true)
      await eliminarJuradoConcurso(id, id_jurado);
      await obtenerJuradosPage();
    } catch (error) {
      console.log(error)
    }
    finally {
      setLoadingDelete(false)
    }
  }

  const agregarJurado = async (data) => {
    try {
      const jurado = await agregarJuradoConcurso(id, data.id_jurado);
      await obtenerJuradosPage();
      console.log("ASdasd")
    } catch (error) {
      console.log(error)
    }
  }

  const obtenerConcursoPage = async () => {
    try {
      if (!dataConcurso) {
        const data = await obtenerConcursoPorId(id);
        setConcurso(dataConcurso);
        return
      }
      setConcurso(dataConcurso);
    } catch (error) {
      console.log(error)
    }
  }

  const obtenerJuradosPage = async () => {
    try {
      const [juradosConcursoData, juradosData] = await Promise.all([
        obtenerJuradosConcurso(id),
        obtenerJuradosConcursoDisponible(id)
      ])

      setJuradosConcuros(juradosConcursoData);
      setJurados(juradosData)
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
          obtenerJuradosPage(),
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
          <form onSubmit={handleSubmit(agregarJurado)} className='mt-4'>
            <label className="font-semibold  text-gray-800 capitalize">Agregar Jurado</label>
            {
              jurados.length
                ? <select {...register('id_jurado', { required: true })} className="cursor-pointer w-full p-3 mt-2 rounded-md border focus:outline-none focus:border-blue-500">
                  {jurados.map((jurado) => (
                    <option key={jurado.id} value={jurado.id}>
                      {jurado.nombre}
                    </option>
                  ))}
                </select>
                : <p className='my-2'>No hay jurados disponibles</p>
            }
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full mt-4 bg-blue-500 flex justify-center items-center text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              <Skeleton loading={isSubmitting} fallback={<Loader />}>
                Agregar a concurso
              </Skeleton>
            </button>          </form>

          <h2 className="text-2xl font-bold my-4">Jurados</h2>
          <div className="space-y-6">
            {juradosConcurso.map((jurado) => (
              <div key={jurado.id} className={"flex border items-center justify-between bg-white rounded-md p-4 shadow-lg " + (loadingDelete ? 'opacity-40 select-none' : '')}>
                <p className="text-lg font-medium">{jurado.nombre}</p>
                <button
                  disabled={loadingDelete}
                  onClick={() => eliminarJurado(jurado.id)}
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

export default AgregarJurado