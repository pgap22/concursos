import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";

const ProtectedRoute = ({children, needLogged=true}) => {
  const navigate = useNavigate();
  const { usuario } = useSession();

  useEffect(()=> {
    if(!usuario.id && needLogged) return navigate("/");

    if(usuario.id && !needLogged) return navigate("/redirect")
    
  },[])

  return <>{children}</>
}

export default ProtectedRoute