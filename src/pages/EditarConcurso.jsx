import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { actualizarConcurso, cambiarEstado, eliminarConcurso, importarRubricaJSON, obtenerConcursoPorId } from "../api";
import { useForm } from "react-hook-form";
import { crearCriterio, eliminarCriterio } from "../api/criterios";
import { actualizarPonderacion, crearPonderacion, eliminarPonderacion } from "../api/ponderacion";
import { useClickAway } from "@uidotdev/usehooks";
import { useSession } from "../hooks/useSession";

const EditarConcurso = () => {
  const [concurso, setConcurso] = useState({});
  const [agregarCriterioActivo, setAgregarCriterioActivo] = useState(false);
  const [jsonFormVisible, setJsonFormVisible] = useState(false);
  const {usuario} = useSession();

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    obtenerConcurso();
  }, []);

  const cambiarEstadoClick = async () => {
    try {
      let estado = 'inscripcion';

      if (concurso.estado == "inscripcion") {
        estado = "evaluacion"
      }
      if (concurso.estado == "evaluacion") {
        estado = "finalizado"
      }

      await cambiarEstado(id, estado);
      await obtenerConcurso();
    } catch (error) {
      console.log(error)
    }
  }

  const obtenerConcurso = async () => {
    try {
      const data = await obtenerConcursoPorId(id);
      setConcurso(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    try {
      await actualizarConcurso(id, data);
      navigate(`/${usuario.rol}`);
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarConcursoClick = async () => {
    try {
      await eliminarConcurso(id);
      navigate(`/${usuario.rol}`);
    } catch (error) {
      console.log(error);
    }
  };

  const importJSONSubmit = async ({json}) => {
    try {
      await importarRubricaJSON(id, JSON.parse(json));
      await obtenerConcurso();
      setJsonFormVisible(false);
      alert("Importado !");

    } catch (error) {
      console.log(error)
      alert("Error en el formato del json !")
    }
  }

  const exportJSONClick = async ()=>{
    let datos = [...concurso.criterios]
    datos.map(
      criterio => {
        delete criterio.id_concurso
        delete criterio.id
        
        let ponderaciones = [...criterio.ponderaciones]
        criterio.ponderaciones = ponderaciones.map(
          ponderacion => {
           delete ponderacion.id
           delete ponderacion.id_criterio
           return ponderacion
          }
        )

        return criterio;
      }
    )
    await navigator.clipboard.writeText(JSON.stringify(datos));
    alert("Criterios Copiados al portapapel")
  }

  const { handleSubmit, register } = useForm();
  const { handleSubmit: handlerSubmitJSON, register: registerJSON } = useForm();

  if (!concurso.id) return <p>Cargando...</p>

  return (
    <main className="px-4 py-8 bg-gray-100 min-h-screen">
      <div className="max-w-screen-md mx-auto bg-white rounded-lg overflow-hidden shadow-md p-6 md:p-8 space-y-6">
        <Link to={`/${usuario.rol}`}>
          <button className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-lg">
            Volver
          </button>
        </Link>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <TextInput
            label="Nombre"
            placeholder="Nombre"
            register={register("nombre", { required: true, value: concurso.nombre })}
          />
          <TextareaInput
            label="Descripción"
            placeholder="Descripción"
            defaultValue={concurso.descripcion}
            register={register("descripcion", { required: true, value: concurso.descripcion })}
          />
          <DateTimeInput
            label="Fecha"
            min={new Date().toISOString().split("T")[0] + "T00:00"}
            defaultValue={new Date(concurso.fecha).toLocaleDateString("sv", { hour: 'numeric', minute: 'numeric' })}
            register={register("fecha", { required: true, valueAsDate: true })}
          />
          <SubmitButton isLoading={false} label="Enviar" />
        </form>
        <div className="flex-col md:flex-row flex gap-4">
          {
            concurso.estado == "inscripcion"
              ? <>
                <Link state={{ concurso }} to={`/${usuario.rol}/concurso/agregar-concursante/${id}`}>
                  <button
                    className="bg-yellow-500 w-full text-white py-2 px-4 rounded-lg"
                  >
                    Agregar Concursantes
                  </button>
                </Link>
                <Link state={{ concurso }} to={`/${usuario.rol}/concurso/agregar-jurado/` + id}>
                  <button
                    className="bg-green-500 w-full text-white py-2 px-4 rounded-lg"
                  >
                    Agregar Jurados
                  </button>
                </Link>
              </>
              : ''
          }
          {
            concurso.estado != "finalizado"
              ?
              <button
                onClick={cambiarEstadoClick}
                className="bg-slate-500 text-white py-2 px-4 rounded-lg"
              >
                {
                  concurso.estado == 'inscripcion'
                    ? 'Pasar a evaluacion'
                    : concurso.estado == "evaluacion"
                      ? 'Finalizar concurso'
                      : ''
                }
              </button>
              : ''
          }
          <button
            onClick={eliminarConcursoClick}
            className="bg-red-500 text-white py-2 px-4 rounded-lg"
          >
            Eliminar Concurso
          </button>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Criterios</h2>
        <div className="flex flex-col md:flex-row gap-4">

          {concurso.criterios.length ?
            <button
              onClick={exportJSONClick}
              className="bg-green-500 text-white py-2 px-4 rounded-lg"
            >
              Exportar JSON
            </button>
            : <button
              onClick={() => {
                setJsonFormVisible(!jsonFormVisible)
                setAgregarCriterioActivo(false)

              }}
              className="bg-red-500 text-white py-2 px-4 rounded-lg"
            >
              {jsonFormVisible ? 'Cerrar' : 'Importar JSON'}
            </button>}


          <button
            onClick={() => {
              setAgregarCriterioActivo(!agregarCriterioActivo)
              setJsonFormVisible(false)
            }}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            {agregarCriterioActivo ? "Cancelar" : "Nuevo Criterio"}
          </button>

        </div>
        {agregarCriterioActivo && (
          <AgregarCriterioForm idConcurso={id} obtenerConcurso={obtenerConcurso} />
        )}
        {concurso.criterios.map((criterio) => (
          <Criterio key={criterio.id} criterio={criterio} obtenerConcurso={obtenerConcurso} />
        ))}
        {
          jsonFormVisible ? (
            <form className="flex flex-col" onSubmit={handlerSubmitJSON(importJSONSubmit)}>
              <textarea
                {...registerJSON("json")}
                placeholder="Introduce el JSON aquí"
                rows={4}
                className="border rounded-lg p-2"
              />
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded-lg mt-2"
              >
                Importar JSON
              </button>
            </form>
          ) : ''
        }
      </div>
    </main>
  );
};

const AgregarCriterioForm = ({ idConcurso, obtenerConcurso }) => {
  const { handleSubmit, register, reset } = useForm();

  const agregarCriterioSubmit = async (data) => {
    try {
      const criterio = {
        ...data,
        id_concurso: idConcurso,
      };

      await crearCriterio(criterio);
      await obtenerConcurso();
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(agregarCriterioSubmit)} className="space-y-6">
      <TextInput label="Nombre Criterio" placeholder="nombre Criterio" register={register("nombre", { required: true })} />
      <TextInput label="Descripción Criterio" placeholder="descripcion Criterio" register={register("descripcion", { required: true })} />
      <SubmitButton isLoading={false} label="CREAR" />
    </form>
  );
};

const Criterio = ({ criterio, obtenerConcurso }) => {
  const [mostarMas, setMostrarMas] = useState(false);
  const [formPonderacionActivo, setFormPonderacion] = useState(false);

  const eliminar = async () => {
    try {
      await eliminarCriterio(criterio.id);
      await obtenerConcurso();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">{criterio.nombre}</h3>
        <div className="space-x-2">
          <button onClick={() => setMostrarMas(!mostarMas)} className="text-blue-500 hover:underline">
            {mostarMas ? "Ocultar" : "Mostrar"}
          </button>
          <button onClick={eliminar} className="text-red-500 hover:underline">
            Eliminar
          </button>
        </div>
      </div>
      {mostarMas && (
        <div className="mt-4">
          <PuntosAEvaluarForm
            criterioId={criterio.id}
            obtenerConcurso={obtenerConcurso}
            formPonderacionActivo={formPonderacionActivo}
            setFormPonderacion={setFormPonderacion}
          />
          <div className="mt-4">
            {criterio.ponderaciones.map((ponderacion) => (
              <Ponderacion
                key={ponderacion.id}
                ponderacion={ponderacion}
                obtenerConcurso={obtenerConcurso}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Componentes de entrada de datos reutilizables
const TextInput = ({ label, placeholder, register }) => (
  <div>
    <label className="block text-gray-600 font-semibold mb-1">{label}</label>
    <input
      {...register}
      type="text"
      placeholder={placeholder}
      className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
    />
  </div>
);

const TextareaInput = ({ label, placeholder, register }) => (
  <div>
    <label className="block text-gray-600 font-semibold mb-1">{label}</label>
    <textarea
      {...register}
      placeholder={placeholder}
      className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
    />
  </div>
);

const DateTimeInput = ({ label, min, defaultValue, register }) => (
  <div>
    <label className="block text-gray-600 font-semibold mb-1">{label}</label>
    <input
      {...register}
      type="datetime-local"
      min={min}
      defaultValue={defaultValue}
      className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
    />
  </div>
);

const SubmitButton = ({ isLoading, label }) => (
  <button
    type="submit"
    disabled={isLoading}
    className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
      } focus:outline-none`}
  >
    {isLoading ? "Enviando..." : label}
  </button>
);
const PuntosAEvaluarForm = ({
  criterioId,
  obtenerConcurso,
  formPonderacionActivo,
  setFormPonderacion,
}) => {
  const { handleSubmit, register, reset } = useForm();

  const agregarPonderacionSubmit = async (data) => {
    try {
      data = {
        ...data,
        id_criterio: criterioId,
      };
      await crearPonderacion(data);
      await obtenerConcurso();
      setFormPonderacion(false);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setFormPonderacion(!formPonderacionActivo)}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg"
      >
        {formPonderacionActivo ? "Cancelar" : "Agregar Nivel de ponderacion"}
      </button>
      {formPonderacionActivo && (
        <form onSubmit={handleSubmit(agregarPonderacionSubmit)} className="space-y-6">
          <TextInput label="Nivel" placeholder="Nivel" register={register("nombre", { required: true })} />
          <TextInput label="Puntos" placeholder="puntos" register={register("valor", { required: true, valueAsNumber: true, value: 0, min: 1 })} />
          <TextareaInput label="Descripción" placeholder="descripcion" register={register("descripcion", { required: true })} />
          <SubmitButton isLoading={false} label="Agregar Ponderacion" />
        </form>
      )}
    </div>
  );
};

const Ponderacion = ({ ponderacion, obtenerConcurso }) => {
  const [editarForm, setEditarForm] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const outside = useClickAway(() => {
    setEditarForm(false);
    reset();
  });

  const editarFormClick = () => {
    setEditarForm(!editarForm);
  };

  const editarPonderacionSubmit = async (data) => {
    try {
      await actualizarPonderacion(ponderacion.id, {
        ...data,
        id_criterio: ponderacion.id_criterio,
      });
      setEditarForm(false);
      obtenerConcurso();
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarPonderacionClick = async () => {
    try {
      await eliminarPonderacion(ponderacion.id);
      obtenerConcurso();
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="border rounded-lg p-4 mt-4">
      {editarForm ? (
        <form ref={outside} onSubmit={handleSubmit(editarPonderacionSubmit)} className="space-y-6">
          <TextInput label="Nivel" placeholder="Nivel" register={register("nombre", { value: ponderacion.nombre, required: true })} />
          <TextInput label="Puntos" placeholder="puntos" register={register("valor", { valueAsNumber: true, value: ponderacion.valor ?? 0, min: 1,required: true })} />
          <TextareaInput label="Descripción" placeholder="descripcion" register={register("descripcion", { value: ponderacion.descripcion,required: true })} />
          <div className="space-x-2">
            <button
              onClick={() => setEditarForm(false)}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
              type="button"
            >
              Cancelar
            </button>
            <SubmitButton isLoading={false} label="Editar" />
          </div>
        </form>
      ) : (
        <div>
          <p className="text-lg font-semibold text-gray-800">{ponderacion.nombre}</p>
          <p className="text-gray-600">
            <b>Puntaje: </b>
            {ponderacion.valor}
          </p>
          <p className="text-gray-600">{ponderacion.descripcion}</p>
          <div className="mt-2 space-x-2">
            <button
              onClick={editarFormClick}
              className="bg-blue-500 text-white py-1 px-3 rounded-lg"
            >
              Editar
            </button>
            <button
              onClick={eliminarPonderacionClick}
              className="bg-red-500 text-white py-1 px-3 rounded-lg"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarConcurso;
