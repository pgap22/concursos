import { headers } from "../helpers";
import { clienteAxios } from "./axios";

// Crear un concursante
export const crearConcursante = async (data) => {
    try {
        const { data: concursante } = await clienteAxios.post("/concursantes", data, headers());
        return concursante;
    } catch (error) {
        throw error;
    }
}

// Obtener todos los concursantes
export const obtenerConcursantes = async () => {
    try {
        const { data: concursantes } = await clienteAxios.get("/concursantes", headers());
        return concursantes;
    } catch (error) {
        throw error;
    }
}

// Obtener un concursante por ID
export const obtenerConcursantePorId = async (id,concursos = 1) => {
    try {
        const { data: concursante } = await clienteAxios.get(`/concursantes/${id}?concurso=${concursos}`, headers());
        return concursante;
    } catch (error) {
        throw error;
    }
}

// Actualizar un concursante por ID
export const actualizarConcursante = async (id, data) => {
    try {
        const { data: concursante } = await clienteAxios.put(`/concursantes/${id}`, data, headers());
        return concursante;
    } catch (error) {
        throw error;
    }
}

// Eliminar un concursante por ID
export const eliminarConcursante = async (id) => {
    try {
        const { data } = await clienteAxios.delete(`/concursantes/${id}`, headers());
        return data;
    } catch (error) {
        throw error;
    }
}


export const unirloAConcurso = async(id,id_concurso)=>{
    try {
        const {data} = await clienteAxios.post("/concursantes/unir/"+id, {id_concurso}, headers())
        return data;
    } catch (error) {
        throw error
    }
}
export const removerDeConcurso = async(id,id_concurso)=>{
    try {
        const {data} = await clienteAxios.post("/concursantes/salir/"+id, {id_concurso}, headers())
        return data;
    } catch (error) {
        throw error
    }
}

export const obtenerConcursosDisponibles = async id =>{
    try {
        const {data} = await clienteAxios.get("/concursantes/concursos-disponibles/"+id, headers())
        return data;
    } catch (error) {
        throw error
    } 
}