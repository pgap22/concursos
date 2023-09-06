import { headers } from "../helpers";
import { clienteAxios } from "./axios";

// Crear un criterio
export const crearCriterio = async (data) => {
    try {
        const { data: criterio } = await clienteAxios.post("/criterios", data, headers());
        return criterio;
    } catch (error) {
        throw error;
    }
}

// Obtener todos los criterios
export const obtenerCriterios = async () => {
    try {
        const { data: criterios } = await clienteAxios.get("/criterios", headers());
        return criterios;
    } catch (error) {
        throw error;
    }
}

// Obtener un criterio por ID
export const obtenerCriterioPorId = async (id) => {
    try {
        const { data: criterio } = await clienteAxios.get(`/criterios/${id}`, headers());
        return criterio;
    } catch (error) {
        throw error;
    }
}

// Actualizar un criterio por ID
export const actualizarCriterio = async (id, data) => {
    try {
        const { data: criterio } = await clienteAxios.put(`/criterios/${id}`, data, headers());
        return criterio;
    } catch (error) {
        throw error;
    }
}

// Eliminar un criterio por ID
export const eliminarCriterio = async (id) => {
    try {
        const { data } = await clienteAxios.delete(`/criterios/${id}`, headers());
        return data;
    } catch (error) {
        throw error;
    }
}

export const duplicarCriterio = async (id) =>{
    try {
        const {data} = await clienteAxios.get(`/criterios/duplicar/${id}`, headers());
        return data;
    } catch (error) {
        throw error
    }
}