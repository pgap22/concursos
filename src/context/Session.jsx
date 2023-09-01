import { createContext, useEffect, useState } from "react";
import { obtenerPerfil } from "../api";
const SessionContext = createContext();

const SessionProvider = ({ children }) => {
  const [usuario, setUsuario] = useState({});
  const [loading, setLoading] = useState(true);

  const perfil = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const data = await obtenerPerfil(token ?? "");
      setUsuario(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const login = (usuario)=>{
    setUsuario(usuario);
    localStorage.setItem("token", usuario.token)
  }
  const logout = ()=>{
    setUsuario({})
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  useEffect(() => {
    perfil();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <SessionContext.Provider
      value={{
        usuario,
        login,
        logout
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export { SessionContext, SessionProvider };