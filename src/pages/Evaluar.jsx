import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { enviarResultadosConcurso, obtenerConcursoPorId, obtenerResultadosConcurso } from '../api';
import { obtenerConcursantePorId } from '../api/concursantes';
import { useForm } from 'react-hook-form';
import { Button } from '../components/Button';
import Skeleton from '../components/Skeleton';
import Loader from '../components/Loader';

const Evaluar = () => {
    const { id_concursante, id_concurso } = useParams();

    const [concursante, setConcursante] = useState({});
    const [concurso, setConcurso] = useState({})

    const [loading, setLoading] = useState(true);
    const [evaluacion, setEvaluacion] = useState({});

    const navigate = useNavigate();

    const { register, handleSubmit, formState: {isSubmitting} } = useForm();

    const enviarResultado = async (data) => {
        try {
            const puntajeConcursante = Object.entries(data).map(datos => ({ id_criterio: datos[0], valor: +datos[1] }))

            const payload = {
                puntajes: puntajeConcursante,
                id_concursante
            }

            await enviarResultadosConcurso(id_concurso, payload);
            navigate("/jurado/concurso/" + id_concurso);
            // alert("jesus obro");
        } catch (error) {
            console.log(error)
        }
    }
    const obtenerConcurso = async () => {
        try {
            const data = await obtenerConcursoPorId(id_concurso);
            setConcurso(data)
        } catch (error) {
            console.log(error)
        }
    }
    const obtenerConcursante = async () => {
        try {
            const data = await obtenerConcursantePorId(id_concursante, 0);
            setConcursante(data)
        } catch (error) {
            console.log(error)
        }
    }
    const obtenerEvaluacion = async () => {
        try {
            const data = await obtenerResultadosConcurso(id_concurso, { id_concursante });
            console.log(data);
            setEvaluacion(data);
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        (async () => {
            setLoading(true)
            await Promise.all([obtenerConcursante(), obtenerConcurso(), obtenerEvaluacion()])
            setLoading(false)
        })()
    }, [])

    useEffect(()=>{
        if(concurso.id){
            if(concurso.estado !== 'evaluacion'){
                navigate('/jurado')
            }
        }
    },[concurso])

    if (loading) return <p>Cargando...</p>


    return (
        <main className="bg-white p-4 min-h-screen">
            <div className='flex flex-col '>
                <h2 className="text-2xl font-bold mb-4">Evaluando a <span className="font-bold">{concursante.nombres} {concursante.apellidos}</span> en {concurso.nombre}</h2>
                <Link className='md:w-fit my-2' to={"/jurado/concurso/concursantes/" + id_concurso}>
                    <Button text={"Volver"} />
                </Link>
            </div>
            {
                evaluacion && evaluacion.id ? (
                    <div className="flex flex-col md:flex-row md:justify-between">
                        {evaluacion.puntajesConcursante.map(({ ponderacionCriterio, valor }) => (
                            <div className="bg-gray-100 shadow-md rounded-md p-4 mb-4 md:w-1/2 md:mr-2">
                                <p className="text-lg font-bold mb-2">{ponderacionCriterio.nombre}</p>
                                <p className="text-gray-500 text-sm mb-2">{ponderacionCriterio.descripcion}</p>
                                <p className="text-lg font-bold"><b>Puntaje: </b>{valor}</p>
                            </div>
                        ))}
                    </div>
                ) : (concurso.id && concurso.criterios.length) ? (
                    <form onSubmit={handleSubmit(enviarResultado)}>
                        {concurso.criterios.map(criterio => (
                            criterio.ponderaciones.length ? (
                                <div className="mb-4">
                                    <p className="text-lg font-bold mb-2">{criterio.nombre}</p>
                                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                                        {criterio.ponderaciones.map(ponderacion => (
                                            <label id='ponderacion-item' className="bg-gray-100 shadow-md rounded-md p-4 flex-1 text-center cursor-pointer">
                                                <p className="text-lg font-bold mb-2">{ponderacion.nombre}</p>
                                                <p className="text-gray-500 text-sm mb-2">{ponderacion.descripcion}</p>
                                                <p className="text-lg font-bold"><b>Puntaje: </b>{ponderacion.valor}</p>
                                                <input {...register(criterio.id, { required: true })} value={ponderacion.valor} type="radio" className="hidden" />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ) : ''
                        ))}
                        <button disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full md:w-fit">
                            <Skeleton loading={isSubmitting} fallback={<Loader />}>
                                Enviar
                            </Skeleton>
                        </button>
                    </form>
                ) : (
                    <p className="text-lg font-bold">No hay rubrica</p>
                )
            }
        </main>
    )
}

export default Evaluar