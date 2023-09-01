import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { actualizarConcursante, eliminarConcursante, obtenerConcursantePorId, obtenerConcursosDisponibles, removerDeConcurso, unirloAConcurso } from '../api/concursantes';
import { useSession } from '../hooks/useSession';

const EditarConcursante = () => {
    const [concursos, setConcursos] = useState([]);
    const [concursante, setConcursante] = useState({});
    const { id } = useParams();
    const {usuario} = useSession();

    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const { register: registerConcurso, handleSubmit: submitConcurso } = useForm();


    const editarConcursanteSubmit = async (data) => {
        try {
            await actualizarConcursante(id, data);
            navigate(`/${usuario.rol}`);
        } catch (error) {
            console.log(error);
        }
    };

    const eliminarConcursanteClick = async () => {
        try {
            await eliminarConcursante(id);
            navigate(`/${usuario.rol}`);
        } catch (error) {
            console.log(error);
        }
    };

    const obtenerConcursosPage = async () => {
        try {
            const data = await obtenerConcursosDisponibles(id);
            setConcursos(data);
        } catch (error) {
            console.log(error);
        }
    };

    const obtenerConcursante = async () => {
        try {
            const data = await obtenerConcursantePorId(id);
            setConcursante(data);
        } catch (error) {
            console.log(error);
        }
    };

    const unirConcursoSubmit = async ({ id_concurso }) => {
        try {
            await unirloAConcurso(id, id_concurso);
            await obtenerConcursante();
        } catch (error) {
            console.log(error);
        }
    };

    const sacarDelConcursoClick = async (id_concurso) => {
        try {
            await removerDeConcurso(id, id_concurso);
            await obtenerConcursante();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        obtenerConcursante();
        obtenerConcursosPage();
    }, [concursante]);

    if (!concursante.id) return <p>Cargando...</p>;

    return (
        <main className="px-4 py-8 bg-gray-100 min-h-screen">
            <div className="max-w-screen-lg mx-auto bg-white rounded-lg overflow-hidden shadow-md">
                <div className="p-6 md:p-8">
                    <Link to={`/${usuario.rol}`} className="block mb-4">
                        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                            Regresar
                        </button>
                    </Link>
                    <form onSubmit={handleSubmit(editarConcursanteSubmit)} className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800">Editar Datos</h2>
                        <label htmlFor="nombres" className="block text-gray-600 font-semibold">
                            Nombres
                        </label>
                        <input
                            {...register('nombres', { required: true, value: concursante.nombres })}
                            type="text"
                            id="nombres"
                            placeholder="Nombres"
                            className="w-full p-3 rounded-md border focus:outline-none focus:border-blue-500"
                        />

                        <label htmlFor="apellidos" className="block text-gray-600 font-semibold">
                            Apellidos
                        </label>
                        <input
                            {...register('apellidos', { required: true, value: concursante.apellidos })}
                            type="text"
                            id="apellidos"
                            placeholder="Apellidos"
                            className="w-full p-3 rounded-md border focus:outline-none focus:border-blue-500"
                        />

                        <label htmlFor="grado" className="block text-gray-600 font-semibold">
                            Grado
                        </label>
                        <input
                            {...register('grado', { required: true, value: concursante.grado })}
                            type="text"
                            id="grado"
                            placeholder="Grado"
                            className="w-full p-3 rounded-md border focus:outline-none focus:border-blue-500"
                        />

                        <div className='flex flex-col gap-4'>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
                            >
                                Editar
                            </button>
                            <button
                                onClick={eliminarConcursanteClick}
                                type='button'
                                className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none"
                            >
                                Eliminar
                            </button>
                        </div>
                    </form>
                    <form onSubmit={submitConcurso(unirConcursoSubmit)} className="mt-6 space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800">Agregar a concurso</h2>
                        {concursos.length ? (
                            <>
                                <select {...registerConcurso('id_concurso', { required: true })} className="w-full p-3 rounded-md border focus:outline-none focus:border-blue-500">
                                    {concursos.map((concurso) => (
                                        <option key={concurso.id} value={concurso.id}>
                                            {concurso.nombre}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
                                >
                                    Unirlo a concurso
                                </button>
                            </>
                        ) : (
                            <p>No hay concursos disponibles</p>
                        )}
                    </form>
                    <div className="mt-6 space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">Concursos Inscritos</h2>
                        {concursante.concursos.map(({ concurso }) => (
                            <div key={concurso.id} className="flex items-center justify-between">
                                <p>{concurso.nombre}</p>
                                <button
                                    onClick={() => sacarDelConcursoClick(concurso.id)}
                                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 focus:outline-none"
                                >
                                    Sacar del concurso
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default EditarConcursante;
