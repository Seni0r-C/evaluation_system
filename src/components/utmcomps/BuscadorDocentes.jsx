import BuscadorGenerico from '../common/BuscadorGenerico';
import { buscarUsuarios as buscarUsuariosService } from '../../services/usuarioService';
import { DOCENTE } from '../../utils/roles';
import PropTypes from 'prop-types';

const BuscadorDocentes = ({ setSelectedDocentes, initialSelectedItems = [], allowDuplicates = false, maxSelections = -1, required = false }) => {
    const handleBuscarNombre = (query, setResults, setShowSpinner) => {
        setShowSpinner(true);  // Mostrar el spinner
        setTimeout(() => {
            buscarUsuariosService(query, setResults, DOCENTE);
            setShowSpinner(false);  // Ocultar el spinner cuando se obtienen los resultados
        }, 500);  // Simulamos un retraso en la búsqueda
    };
    return (
        <div className="p-4">
            {/* Buscador de Docentes */}
            <BuscadorGenerico
                label="Buscar Docentes"
                placeholder="Ingrese el nombre del docente"
                handlerBuscar={handleBuscarNombre}
                onSelectionChange={(items) => setSelectedDocentes(items)}
                allowDuplicates={allowDuplicates}  // No permitir duplicados
                maxSelections={maxSelections}       // Selección múltiple ilimitada
                required={required}
                initialSelectedItems={initialSelectedItems}
            />
        </div>
    );
};

BuscadorDocentes.propTypes = {
    setSelectedDocentes: PropTypes.func.isRequired,
    initialSelectedItems: PropTypes.array,
    allowDuplicates: PropTypes.bool,
    maxSelections: PropTypes.number,
    required: PropTypes.bool,
};

export default BuscadorDocentes;
