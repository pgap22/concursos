import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { obtenerConcursoPorId, obtenerRanking } from "../api";
import { FiArrowLeft } from 'react-icons/fi';

const Ranking = () => {
    const [ranking, setRanking] = useState([])
    const [concurso, setConcurso] = useState({})
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    const obtenerRankingConcurso = async () => {
        try {
            const [data, concurso] = await Promise.all([obtenerRanking(id), obtenerConcursoPorId(id)])
            setRanking(data);
            setConcurso(concurso);
            setLoading(false);
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        obtenerRankingConcurso();
    }, [])

    if (loading) return <p>Cargando...</p>

    return (
        <>
        <div className="max-w-screen-lg mx-auto p-4">
            <Link
                to={"/jurado/concurso/" + id}
                className="flex items-center px-4 py-2 text-gray-500 hover:text-gray-600 transition-colors duration-300"
            >
                <FiArrowLeft className="w-4 h-4 mr-1" />
                Volver
            </Link>
            <h1 className="text-4xl font-bold mt-8 mb-6 text-gray-800">
                Ranking de {concurso.nombre}
            </h1>
            {ranking.map((concursante, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between px-6 py-4 bg-white shadow-md rounded-md mb-4"
                >
                    <p className="text-xl font-semibold text-gray-800">
                        {i + 1}° {concursante.nombres}  {concursante.apellidos}
                    </p>
                    <p className="text-gray-600">
                        Puntaje: <b>{concursante.puntajeFinal}</b>
                    </p>
                </div>
            ))}
        </div>
    </>
    )
}

export default Ranking