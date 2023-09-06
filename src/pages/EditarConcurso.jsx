import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { actualizarConcurso, cambiarEstado, eliminarConcurso, importarRubricaJSON, obtenerConcursoPorId } from "../api";
import { useForm } from "react-hook-form";
import { actualizarCriterio, crearCriterio, duplicarCriterio, eliminarCriterio } from "../api/criterios";
import { actualizarPonderacion, crearPonderacion, eliminarPonderacion } from "../api/ponderacion";
import { useClickAway } from "@uidotdev/usehooks";
import { useSession } from "../hooks/useSession";
import Skeleton from "../components/Skeleton";
import Loader from "../components/Loader";

const EditarConcurso = () => {
  const [concurso, setConcurso] = useState({});
  const [agregarCriterioActivo, setAgregarCriterioActivo] = useState(false);
  const [jsonFormVisible, setJsonFormVisible] = useState(false);

  const [loadingClick, setLoadingClick] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);


  const { usuario } = useSession();

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    obtenerConcurso();
  }, []);

  const cambiarEstadoClick = async () => {
    try {
      setLoadingClick(true);
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
    finally {
      setLoadingClick(false);
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
      setLoadingClick(true);

      await eliminarConcurso(id);
      navigate(`/${usuario.rol}`);
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoadingClick(false);
    }
  };

  const importJSONSubmit = async ({ json }) => {
    try {
      setLoadingImport(true);
      await importarRubricaJSON(id, JSON.parse(json));
      await obtenerConcurso();
      setJsonFormVisible(false);
      alert("Importado !");
      resetJSON()
    } catch (error) {
      console.log(error)
      alert("Error en el formato del json !")
    }
    finally{
      setLoadingImport(false);
    }
  }

  const exportJSONClick = async () => {
    let datos = [...concurso.criterios]
    datos.map(
      criterio => {
        delete criterio.id_concurso
        delete criterio.id
        delete criterio.createdAt

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
    await obtenerConcurso();

    alert("Criterios Copiados al portapapel")
  }

  const { handleSubmit, register, formState: { isSubmitting } } = useForm();
  const { handleSubmit: handlerSubmitJSON, register: registerJSON, reset: resetJSON } = useForm();

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
            min={new Date("2023-09-07").toLocaleDateString("sv", { hour: 'numeric', minute: 'numeric' })}
            defaultValue={new Date(concurso.fecha).toLocaleDateString("sv", { hour: 'numeric', minute: 'numeric' })}
            register={register("fecha", { required: true, valueAsDate: true })}
          />
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-blue-500 flex justify-center items-center text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            <Skeleton loading={isSubmitting} fallback={<Loader />}>
              Editar
            </Skeleton>
          </button>
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
                disabled={loadingClick}
                onClick={cambiarEstadoClick}
                className="bg-slate-500 text-white py-2 px-4 rounded-lg"
              >
                <Skeleton loading={loadingClick}>
                  {
                    concurso.estado == 'inscripcion'
                      ? 'Pasar a evaluacion'
                      : concurso.estado == "evaluacion"
                        ? 'Finalizar concurso'
                        : ''
                  }
                </Skeleton>
              </button>
              : ''
          }
          <button
            disabled={loadingClick}
            onClick={eliminarConcursoClick}
            className="bg-red-500 text-white py-2 px-4 rounded-lg"
          >
            <Skeleton loading={loadingClick}>
              Eliminar Concurso
            </Skeleton>
          </button>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Criterios</h2>
        <div className="flex flex-col md:flex-row gap-4">

          {concurso.criterios.length ?
            <button
              onClick={exportJSONClick}
              className="bg-green-500 text-white py-2 px-4 rounded-lg"
            >
              Exportar Rubrica
            </button>
            : <button
              onClick={() => {
                setJsonFormVisible(!jsonFormVisible)
                setAgregarCriterioActivo(false)

              }}
              className="bg-red-500 text-white py-2 px-4 rounded-lg"
            >
              {jsonFormVisible ? 'Cerrar' : 'Importar Rubrica'}
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
                placeholder="Pega la rubrica aquí"
                rows={4}
                className="border rounded-lg p-2"
              />
              <button
                disabled={loadingImport}
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded-lg mt-2"
              >
                <Skeleton loading={loadingImport} fallback={<Loader />}>
                  Importar Rubrica
                </Skeleton>
              </button>
            </form>
          ) : ''
        }
      </div>
    </main>
  );
};

const AgregarCriterioForm = ({ idConcurso, obtenerConcurso }) => {
  const { handleSubmit, register, reset, formState: { isSubmitting } } = useForm();

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
      <button
        disabled={isSubmitting}
        type="submit"
        className="w-full bg-blue-500 flex justify-center items-center text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
      >
        <Skeleton loading={isSubmitting} fallback={<Loader />}>
          Crear
        </Skeleton>
      </button>
    </form>
  );
};

const Criterio = ({ criterio, obtenerConcurso }) => {
  const [mostarMas, setMostrarMas] = useState(false);
  const [formPonderacionActivo, setFormPonderacion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const editar = () => {
    setEditMode(!editMode);
  };

  const eliminar = async () => {
    try {
      setLoading(true)
      await eliminarCriterio(criterio.id);
      await obtenerConcurso();
    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false)
    }
  }

  const duplicar = async()=>{
    try {
      setLoading(true)
      await duplicarCriterio(criterio.id)
      await obtenerConcurso();
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)
    }
  }

  return (
    <div className={"border rounded-lg p-4 " + (loading ? 'opacity-30 select-none cursor-wait' : '')}>
      <div className="flex justify-between items-center">
        {editMode ? (
          <EditCriterioForm
            criterio={criterio}
            obtenerConcurso={obtenerConcurso}
            onCancel={() => setEditMode(false)}
          />
        ) : (
          <div className="flex flex-col md:flex-row md:justify-between w-full text-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800">{criterio.nombre}</h3>
            <div className="flex flex-col md:flex-row items-center gap-4 space-x-2">
              <button disabled={loading} onClick={() => setMostrarMas(!mostarMas)} className="text-blue-500 hover:underline">
                {mostarMas ? "Ocultar" : "Mostrar"}
              </button>
              <button disabled={loading} onClick={editar} className="text-green-500 hover:underline">
                Editar
              </button>
              <button disabled={loading} onClick={duplicar} className="text-gray-500 hover:underline">
                Duplicar
              </button>
              <button disabled={loading} onClick={eliminar} className="text-red-500 hover:underline">
                Eliminar
              </button>
            </div>
          </div>
        )}
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

const DateTimeInput = ({ label, min, defaultValue, register, max = new Date("2023-09-11").toLocaleDateString("sv", { hour: 'numeric', minute: 'numeric' }) }) => (
  <div>
    <label className="block text-gray-600 font-semibold mb-1">{label}</label>
    <input
      {...register}
      type="datetime-local"
      min={min}
      max={max}
      defaultValue={defaultValue}
      className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
    />
  </div>
);

const PuntosAEvaluarForm = ({
  criterioId,
  obtenerConcurso,
  formPonderacionActivo,
  setFormPonderacion,
}) => {
  const { handleSubmit, register, reset, formState: { isSubmitting } } = useForm();

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
          <TextInput label="Puntos" placeholder="puntos" register={register("valor", { required: true, valueAsNumber: true, value: 0, min: 0 })} />
          <TextareaInput label="Descripción" placeholder="descripcion" register={register("descripcion", { required: true })} />
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-blue-500 flex justify-center items-center text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            <Skeleton loading={isSubmitting} fallback={<Loader />}>
              Agregar Ponderacion
            </Skeleton>
          </button>
        </form>
      )}
    </div>
  );
};

const Ponderacion = ({ ponderacion, obtenerConcurso }) => {
  const [editarForm, setEditarForm] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [loading, setLoading] = useState();
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
      await obtenerConcurso();
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarPonderacionClick = async () => {
    try {
      setLoading(true)
      await eliminarPonderacion(ponderacion.id);
      await obtenerConcurso();
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  };


  return (
    <div className="border rounded-lg p-4 mt-4">
      {editarForm ? (
        <form ref={outside} onSubmit={handleSubmit(editarPonderacionSubmit)} className="space-y-6">
          <TextInput label="Nivel" placeholder="Nivel" register={register("nombre", { value: ponderacion.nombre, required: true })} />
          <TextInput label="Puntos" placeholder="puntos" register={register("valor", { valueAsNumber: true, value: ponderacion.valor ?? 0, min: 0, required: true })} />
          <TextareaInput label="Descripción" placeholder="descripcion" register={register("descripcion", { value: ponderacion.descripcion, required: true })} />
          <div className="flex flex-col gap-2">
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-blue-500 flex justify-center items-center text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              <Skeleton loading={isSubmitting} fallback={<Loader />}>
                Editar
              </Skeleton>
            </button>
            <button
              onClick={() => setEditarForm(false)}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
              type="button"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className={loading ? 'opacity-30	 select-none' : ''}>
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

const EditCriterioForm = ({ criterio, onCancel, obtenerConcurso }) => {

  const { register, handleSubmit, formState: { isSubmitting } } = useForm()
  const onSubmit = async data => {
    try {
      await actualizarCriterio(criterio.id, data);
      await obtenerConcurso();
      onCancel();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
      <div className="mb-4 flex flex-col w-full">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="nombre">
          Nombre del Criterio:
        </label>
        <input
          type="text"
          id="nombre"
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          {...register("nombre", { required: true, value: criterio.nombre })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="descripcion">
          Descripción:
        </label>
        <textarea
          id="descripcion"
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
          {...register("descripcion", { required: true, value: criterio.descripcion })}
        />
      </div>


      <div className="flex flex-col md:flex-row gap-4 justify-end">
        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full bg-blue-500 flex justify-center items-center text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          <Skeleton loading={isSubmitting} fallback={<Loader />}>
            Editar
          </Skeleton>
        </button>
        <button type="button" onClick={onCancel} className="ml-2 bg-red-500 text-white px-4 py-2 rounded-full">
          Cancelar
        </button>
      </div>
    </form>
  );
};
export default EditarConcurso;
