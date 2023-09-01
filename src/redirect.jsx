import React, { useEffect } from "react";
import { useSession } from "./hooks/useSession";
import { useNavigate } from "react-router-dom";

const Redirect = () => {
  const { usuario } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (usuario.rol == "jurado") {
      navigate("/jurado");
      return
    }
    if (usuario.rol == "admin") {
      navigate("/admin");
      return
    }
    if (usuario.rol == "encargado") {
      navigate("/encargado");
      return
    }

    navigate("/")
  }, [usuario]);

  return <div>Redirect</div>;
};

export default Redirect;