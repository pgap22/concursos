import { headers } from "../helpers";
import { clienteAxios } from "./axios"

export const obtenerPerfil = async(token)=>{
    try {
        const {data} = await clienteAxios("/perfil", {
            headers: {
                Authorization: 'Bearer '+token
            }
        })
        return data;
    } catch (error) {
        return {}
    }
}

export const login = async (user) => {
    try {
        const {data} = await clienteAxios.post("/login", user)
        return data
    } catch (error) {
        throw error
    }
}

export const crearJurado = async (data, rol) => {
    try {
        const { data: jurado } = await clienteAxios.post("/jurados?rol="+rol, data, headers());
        return jurado;
    } catch (error) {
        throw error;
    }
}
export const obtenerJurados = async (rol) => {
    try {
        const { data: jurado } = await clienteAxios.get("/jurados"+ (rol ? "?rol="+rol : ''), headers());
        return jurado;
    } catch (error) {
        throw error;
    }
}
export const obtenerJuradoPorId = async (id) => {
    try {
        const { data: jurado } = await clienteAxios.get(`/jurados/${id}`, headers());
        return jurado;
    } catch (error) {
        throw error;
    }
}
export const actualizarJurado = async (id, data) => {
    try {
        const { data: jurado } = await clienteAxios.patch(`/jurados/${id}`, data, headers());
        return jurado;
    } catch (error) {
        throw error;
    }
}
export const eliminarJurado = async (id) => {
    try {
        const { jurado} = await clienteAxios.delete(`/jurados/${id}`, headers());
        return jurado
    } catch (error) {
        throw error;
    }
}





// Crear un concurso
export const crearConcurso = async (data) => {
    try {
        const { data: concurso } = await clienteAxios.post("/concursos", data, headers());
        return concurso;
    } catch (error) {
        throw error;
    }
}

// Obtener todos los concursos
export const obtenerConcursos = async () => {
    try {
        const { data: concursos } = await clienteAxios.get("/concursos", headers());
        return concursos;
    } catch (error) {
        throw error;
    }
}

// Obtener un concurso por ID
export const obtenerConcursoPorId = async (id) => {
    try {
        const { data: concurso } = await clienteAxios.get(`/concursos/${id}`, headers());
        return concurso;
    } catch (error) {
        throw error;
    }
}

// Actualizar un concurso por ID
export const actualizarConcurso = async (id, data) => {
    try {
        const { data: concurso } = await clienteAxios.put(`/concursos/${id}`, data, headers());
        return concurso;
    } catch (error) {
        throw error;
    }
}

// Eliminar un concurso por ID
export const eliminarConcurso = async (id) => {
    try {
        const { data } = await clienteAxios.delete(`/concursos/${id}`, headers());
        return data;
    } catch (error) {
        throw error;
    }
}

// Obtener todos los concursos
export const obtenerConcursoConcursantes = async (id) => {
    try {
        const { data: concursos } = await clienteAxios.get("/concursos/concursantes/"+id, headers());
        return concursos;
    } catch (error) {
        throw error;
    }
}

export const enviarResultadosConcurso = async (id,data) =>{
    try {
        const { data: concurso } = await clienteAxios.post("/concursos/enviar-resultados/"+id, data, headers());
        return concurso;
    } catch (error) {
        throw error;
    }
}
export const obtenerResultadosConcurso = async (id,data) =>{
    try {
        const { data: concurso } = await clienteAxios.post("/concursos/resultados/"+id, data, headers());
        return concurso;
    } catch (error) {
        throw error;
    }
}
export const obtenerRanking = async (id)=>{
    try {
        const { data: concurso } = await clienteAxios.get("/concursos/ranking/"+id,headers());
        return concurso;
    } catch (error) {
        throw error;
    }
}
export const obtenerJuradosConcurso = async (id)=>{
    try {
        const { data: concurso } = await clienteAxios.get("/concursos/jurados/"+id,headers());
        return concurso;
    } catch (error) {
        throw error;
    }
}
export const obtenerJuradosConcursoDisponible = async (id)=>{
    try {
        const { data: concurso } = await clienteAxios.get("/concursos/jurados/disponible/"+id,headers());
        return concurso;
    } catch (error) {
        throw error;
    }
}
export const agregarJuradoConcurso = async (id,id_jurado) =>{
    try {
        const {data} = await clienteAxios.post("/concursos/jurados/"+id+"/"+id_jurado,{},headers())
        return data
    } catch (error) {
        
    }
}
export const eliminarJuradoConcurso = async (id,id_jurado) =>{
    try {
        const {data} = await clienteAxios.delete("/concursos/jurados/"+id+"/"+id_jurado,headers())
        return data
    } catch (error) {
        
    }
}
export const obtenerConcursantesConcursoDisponible = async(id)=>{
    try {
        const { data: concursos } = await clienteAxios.get("/concursos/concursantes/disponible/"+id, headers());
        return concursos;
    } catch (error) {
        throw error;
    }
}
export const cambiarEstado = async (id,estado) => { 
    try {
        const {data} = await clienteAxios.patch("/concursos/estado/"+id,{estado}, headers())
        return data;
    } catch (error) {
        throw error
    }
}
export const importarRubricaJSON = async(id,json)=>{
    try {
        const {data} = await clienteAxios.post("/concursos/importar-rubrica/"+id, json, headers())
        return data;
    } catch (error) {
        throw error
    }
}

export const resetearEvaluaciones = async (id)=>{
    try {
        const {data} =  await clienteAxios.delete("/concursos/resetear/"+id, headers())
        return data;
    } catch (error) {
        throw error;
    }
}