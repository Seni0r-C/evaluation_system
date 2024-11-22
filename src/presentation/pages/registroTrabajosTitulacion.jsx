import { useState } from "react";
import ModalBusqueda from "../components/ModalBusqueda";

const RegistroTrabajosTitulacion = () => {
    const [newTrabajo, setNewTrabajo] = useState({
        titulo: "",
        modalidad: "",
        carrera: "",
        tutor: null,
        cotutor: null,
        integrantes: [],
    });

    const [isModalOpen, setIsModalOpen] = useState({ tipo: "", abierto: false });

    const handleOpenModal = (tipo) => {
        setIsModalOpen({ tipo, abierto: true });
    };

    const handleCloseModal = () => {
        setIsModalOpen({ tipo: "", abierto: false });
    };

    const handleSelect = (dato) => {
        if (isModalOpen.tipo === "tutor") {
            setNewTrabajo({ ...newTrabajo, tutor: dato });
        } else if (isModalOpen.tipo === "cotutor") {
            setNewTrabajo({ ...newTrabajo, cotutor: dato });
        } else if (isModalOpen.tipo === "estudiante") {
            const nuevoIntegrante = dato;
            const existe = newTrabajo.integrantes.some(
                (integrante) => integrante.id === nuevoIntegrante.id
            );
        
            if (existe) {
                alert("Este integrante ya ha sido añadido.");
                return;
            }
        
            setNewTrabajo((prevState) => ({
                ...prevState,
                integrantes: [...prevState.integrantes, nuevoIntegrante],
            }));
        }
    };

    const handleRemoveIntegrante = (id) => {
        setNewTrabajo((prevState) => ({
            ...prevState,
            integrantes: prevState.integrantes.filter(
                (integrante) => integrante.id !== id
            ),
        }));
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Gestión de Trabajos de Titulación</h1>

            {/* Formulario */}
            <div className="bg-white p-4 shadow rounded mb-6">
                <h2 className="text-xl font-semibold mb-4">Registrar Trabajo</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Otros campos */}
                    <div>
                        <label className="block mb-2 font-medium">Tutor</label>
                        <input
                            type="text"
                            readOnly
                            value={newTrabajo.tutor?.name || ""}
                            placeholder="Seleccionar tutor"
                            className="w-full p-2 border rounded cursor-pointer"
                            onClick={() => handleOpenModal("tutor")}
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Cotutor</label>
                        <input
                            type="text"
                            readOnly
                            value={newTrabajo.cotutor?.name || ""}
                            placeholder="Seleccionar cotutor"
                            className="w-full p-2 border rounded cursor-pointer"
                            onClick={() => handleOpenModal("cotutor")}
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Integrantes</label>
                        <button
                            onClick={() => handleOpenModal("estudiante")}
                            className="px-4 py-2 bg-green-500 text-white rounded"
                        >
                            Agregar integrante
                        </button>

                        {/* Tabla de integrantes */}
                        <table className="mt-4 w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 p-2">Cédula</th>
                                    <th className="border border-gray-300 p-2">Nombre</th>
                                    <th className="border border-gray-300 p-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newTrabajo.integrantes.length > 0 ? (
                                    newTrabajo.integrantes.map((integrante) => (
                                        <tr key={integrante.id}>
                                            <td className="border border-gray-300 p-2">{integrante.cedula}</td>
                                            <td className="border border-gray-300 p-2">{integrante.name}</td>
                                            <td className="border border-gray-300 p-2 text-center">
                                                <button
                                                    onClick={() => handleRemoveIntegrante(integrante.id)}
                                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="border border-gray-300 p-2 text-center">
                                            No hay integrantes añadidos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>

            <ModalBusqueda
                tipo={isModalOpen.tipo}
                isOpen={isModalOpen.abierto}
                onClose={handleCloseModal}
                onSelect={handleSelect}
            />
        </div>
    );
};

export default RegistroTrabajosTitulacion;
