import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/constants';

const CrearTrabajo = () => {
  const [carreras, setCarreras] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [cotutores, setCotutores] = useState([]);
  const [isLoadingTutores, setIsLoadingTutores] = useState(false);
  const [isLoadingCotutores, setIsLoadingCotutores] = useState(false);

  const [selectedCarrera, setSelectedCarrera] = useState('');
  const [selectedModalidad, setSelectedModalidad] = useState('');
  const [selectedTutor, setSelectedTutor] = useState('');
  const [selectedCotutor, setSelectedCotutor] = useState('');
  const [titulo, setTitulo] = useState('');
  const [linkArchivo, setLinkArchivo] = useState('');

  const [tutorSearch, setTutorSearch] = useState('');
  const [cotutorSearch, setCotutorSearch] = useState('');

  const [highlightedIndexTutor, setHighlightedIndexTutor] = useState(-1); // Índice resaltado para tutores
  const [highlightedIndexCotutor, setHighlightedIndexCotutor] = useState(-1); // Índice resaltado para cotutores

  // Fetch carreras
  useEffect(() => {
    axios.get(API_URL + '/carrera/listar')
      .then(response => setCarreras(response.data.datos))
      .catch(error => console.error('Error al cargar carreras:', error));

  }, []);

  // Fetch modalidades cuando cambia la carrera seleccionada
  useEffect(() => {
    if (selectedCarrera) {
      axios.get(`${API_URL}/modalidad-titulacion/listarPorCarrera/${selectedCarrera}`)
        .then(response => setModalidades(response.data))
        .catch(error => console.error('Error al cargar modalidades:', error));
    }
  }, [selectedCarrera]);

  // Fetch usuarios
  const buscarUsuarios = (query, setResults, setLoading) => {
    setLoading(true);
    axios.get(`${API_URL}/usuarios`, { params: { nombre: query, rol: 3 } })
      .then(response => setResults(response.data))
      .catch(error => console.error('Error al buscar usuarios:', error))
      .finally(() => setLoading(false));
  };

  const handleCrearTrabajo = () => {
    const trabajoData = {
      carrera_id: selectedCarrera,
      modalidad_id: selectedModalidad,
      tutor_id: selectedTutor,
      cotutor_id: selectedCotutor,
      titulo,
      link_archivo: linkArchivo,
    };

    axios.post(API_URL + '/trabajo-titulacion/crear', trabajoData)
      .then(response => {
        alert('Trabajo creado con éxito: ' + response.data.datos.id);
      })
      .catch(error => console.error('Error al crear trabajo:', error));
  };

  const handleKeyDown = (e, type) => {
    // Lógica para la navegación de las teclas de dirección y selección en función del tipo (tutor o cotutor)
    const setHighlightedIndex = type === 'tutor' ? setHighlightedIndexTutor : setHighlightedIndexCotutor;
    const highlightedIndex = type === 'tutor' ? highlightedIndexTutor : highlightedIndexCotutor;
    const results = type === 'tutor' ? tutores : cotutores;
    
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && highlightedIndexTutor >= 0) {
      e.preventDefault();
      const selected = results[highlightedIndex];
      if (type === 'tutor') {
        setSelectedTutor(selected);
      } else {
        setSelectedCotutor(selected);
      }
      setTutorSearch(""); // Limpiar búsqueda
      setHighlightedIndex(-1);
    }
  };

  const handleChipRemove = (type) => {
    if (type === 'tutor') {
      setSelectedTutor(null);
    } else {
      setSelectedCotutor(null);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Crear Trabajo de Titulación</h1>

      {/* Seleccionar carrera */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Carrera</label>
        <select
          value={selectedCarrera}
          onChange={(e) => setSelectedCarrera(e.target.value)}
          className="w-full border rounded px-3 py-2">
          <option value="">Seleccione una carrera</option>
          {carreras.map(carrera => (
            <option key={carrera.id} value={carrera.id}>{carrera.nombre}</option>
          ))}
        </select>
      </div>

      {/* Seleccionar modalidad */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Modalidad</label>
        <select
          value={selectedModalidad}
          onChange={(e) => setSelectedModalidad(e.target.value)}
          className="w-full border rounded px-3 py-2">
          <option value="">Seleccione una modalidad</option>
          {modalidades.map(modalidad => (
            <option key={modalidad.id} value={modalidad.id}>{modalidad.nombre}</option>
          ))}
        </select>
      </div>

      {/* Buscar Tutor */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Buscar Tutor</label>
        <div className="relative">
          <input
            type="text"
            value={tutorSearch}
            onChange={(e) => {
              setTutorSearch(e.target.value);
              buscarUsuarios(e.target.value, setTutores, setIsLoadingTutores);
            }}
            onKeyDown={(e) => handleKeyDown(e, 'tutor')}
            placeholder="Ingrese el nombre del tutor"
            className="w-full border rounded px-3 py-2 mb-2"
          />
          {isLoadingTutores && <p className="text-gray-500">Cargando tutores...</p>}
          {tutores.length > 0 && (
            <ul className="absolute border rounded bg-white w-full max-h-40 overflow-auto z-10">
              {tutores.map((tutor, index) => (
                <li
                  key={tutor.id}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${highlightedIndexTutor === index ? "bg-gray-100" : ""}`}
                  onMouseEnter={() => setHighlightedIndexTutor(index)}
                  onClick={() => {
                    setSelectedTutor(tutor);
                    setTutorSearch("");
                    setTutores([]);
                    setHighlightedIndexTutor(-1);
                  }}
                >
                  {tutor.nombre} {tutor.apellido}
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedTutor && (
          <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full mt-2">
            <span className="mr-2">{selectedTutor.nombre} {selectedTutor.apellido}</span>
            <button
              onClick={() => handleChipRemove('tutor')}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Buscar Cotutor */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar Cotutor <span className="text-gray-500 text-sm">(Opcional)</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={cotutorSearch}
            onChange={(e) => {
              setCotutorSearch(e.target.value);
              buscarUsuarios(e.target.value, setCotutores, setIsLoadingCotutores);
            }}
            onKeyDown={(e) => handleKeyDown(e, 'cotutor')}
            placeholder="Ingrese el nombre del cotutor"
            className="w-full border rounded px-3 py-2 mb-2"
          />
          {isLoadingCotutores && <p className="text-gray-500">Cargando cotutores...</p>}
          {cotutores.length > 0 && (
            <ul className="absolute border rounded bg-white w-full max-h-40 overflow-auto z-10">
              {cotutores.map((cotutor, index) => (
                <li
                  key={cotutor.id}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${highlightedIndexCotutor === index ? "bg-gray-100" : ""}`}
                  onMouseEnter={() => setHighlightedIndexCotutor(index)}
                  onClick={() => {
                    setSelectedCotutor(cotutor);
                    setCotutorSearch("");
                    setCotutores([]);
                    setHighlightedIndexCotutor(-1);
                  }}
                >
                  {cotutor.nombre} {cotutor.apellido}
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedCotutor && (
          <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full mt-2">
            <span className="mr-2">{selectedCotutor.nombre} {selectedCotutor.apellido}</span>
            <button
              onClick={() => handleChipRemove('cotutor')}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Título */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ingrese el título del trabajo"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Link del archivo */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Link del Archivo</label>
        <input
          type="text"
          value={linkArchivo}
          onChange={(e) => setLinkArchivo(e.target.value)}
          placeholder="Ingrese el link del archivo"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Botón de creación */}
      <button
        onClick={handleCrearTrabajo}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Crear Trabajo
      </button>
    </div>
  );
};

export default CrearTrabajo;
