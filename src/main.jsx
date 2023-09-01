import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { SessionProvider } from './context/Session'
import Redirect from './redirect'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import RolRoute from './components/RolRoute'
import Admin from './pages/Admin'
import CrearConcurso from './pages/CrearConcurso'
import EditarConconcurso from './pages/EditarConcurso'
import CrearJurado from './pages/CrearJurado'
import CrearConcursante from './pages/CrearConcursante'
import EditarJurado from './pages/EditarJurado'
import EditarConcursante from './pages/EditarConcursante'
import Jurado from './pages/Jurado'
import JuradoConcursos from './pages/JuradoConcursos'
import JuradoConcursantes from './pages/JuradoConcursantes'
import Evaluar from './pages/Evaluar'
import Ranking from './pages/Ranking'
import AgregarJurado from './pages/AgregarJurado'
import AgregarConcursante from './pages/AgregarConcursante'
import Encargado from './pages/Encargado'

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute needLogged={false}>
      <Login />
    </ProtectedRoute>
  },
  {
    path: "/jurado",
    element: <ProtectedRoute>
      <RolRoute rol={"jurado"} />
    </ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Jurado />
      },
      {
        path: "concurso/:id",
        element: <JuradoConcursos />
      },
      {
        path: "concurso/concursantes/:id",
        element: <JuradoConcursantes />
      },
      {
        path: "evaluar/:id_concursante/:id_concurso",
        element: <Evaluar />
      },
      {
        path: "ranking/:id",
        element: <Ranking />
      }

    ]
  },
  {
    path: '/redirect',
    element: <Redirect />
  },
  {
    path: '/admin',
    element: <ProtectedRoute>
      <RolRoute rol={"admin"} />
    </ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Admin />
      },
      {
        path: "crear-concurso",
        element: <CrearConcurso />
      },
      {
        path: "crear-jurado",
        element: <CrearJurado />
      },
      {
        path: "crear-concursante",
        element: <CrearConcursante />
      },
      {
        path: "concurso/:id",
        element: <EditarConconcurso />
      },
      {
        path: "concurso/agregar-jurado/:id",
        element: <AgregarJurado />
      },
      {
        path: "concurso/agregar-concursante/:id",
        element: <AgregarConcursante />
      },
      {
        path: "jurado/:id",
        element: <EditarJurado />
      },
      {
        path: "encargado/:id",
        element: <EditarJurado />
      },
      {
        path: "concursante/:id",
        element: <EditarConcursante />
      },
    ]
  },
  {
    path: "/encargado",
    element: <ProtectedRoute>
      <RolRoute rol={"encargado"} />
    </ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Encargado />
      },
      {
        path: "crear-concurso",
        element: <CrearConcurso />
      },
      {
        path: "concurso/agregar-concursante/:id",
        element: <AgregarConcursante />
      },
      {
        path: "concurso/agregar-jurado/:id",
        element: <AgregarJurado />
      },
      {
        path: "concurso/:id",
        element: <EditarConconcurso />
      },
      {
        path: "concursante/:id",
        element: <EditarConcursante />
      },
      {
        path: "crear-concursante",
        element: <CrearConcursante />
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SessionProvider>
      <RouterProvider router={router}></RouterProvider>
    </SessionProvider>
  </React.StrictMode>
)
