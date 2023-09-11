import axios from "axios"

export const clienteAxios = axios.create({
    baseURL: "http://eventos.cdb.edu.sv:4000"
})