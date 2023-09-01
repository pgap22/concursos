import { headers } from "../helpers";
import { clienteAxios } from "./axios";

// Crear una ponderación
export const crearPonderacion = async (data) => {
    try {
        const { data: ponderacion } = await clienteAxios.post("/ponderaciones", data, headers());
        return ponderacion;
    } catch (error) {
        throw error;
    }
}

// Obtener todas las ponderaciones
export const obtenerPonderaciones = async () => {
    try {
        const { data: ponderaciones } = await clienteAxios.get("/ponderaciones", headers());
        return ponderaciones;
    } catch (error) {
        throw error;
    }
}

// Obtener una ponderación por ID
export const obtenerPonderacionPorId = async (id) => {
    try {
        const { data: ponderacion } = await clienteAxios.get(`/ponderaciones/${id}`, headers());
        return ponderacion;
    } catch (error) {
        throw error;
    }
}

// Actualizar una ponderación por ID
export const actualizarPonderacion = async (id, data) => {
    try {
        const { data: ponderacion } = await clienteAxios.put(`/ponderaciones/${id}`, data, headers());
        return ponderacion;
    } catch (error) {
        throw error;
    }
}

// Eliminar una ponderación por ID
export const eliminarPonderacion = async (id) => {
    try {
        const { data } = await clienteAxios.delete(`/ponderaciones/${id}`, headers());
        return data;
    } catch (error) {
        throw error;
    }
}
