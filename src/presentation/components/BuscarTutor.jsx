import PropTypes from 'prop-types';

const BuscarUsuario = ({
  label,
  placeholder,
  searchValue,
  setSearchValue,
  searchResults,
  setSearchResults,
  isLoading,
  setIsLoading,
  selectedUser,
  setSelectedUser,
  handleKeyDown,
  handleChipRemove,
  type, // para distinguir entre tutor y cotutor
  setHighlightedIndex,
  highlightedIndex,
  buscarUsuarios,
}) => {
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    setIsLoading(true);
    buscarUsuarios(e.target.value, setSearchResults, setIsLoading);
    // Aquí se hace la búsqueda de usuarios
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-gray-500 text-sm">(Opcional)</span>
      </label>
      <div className="relative">
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          onKeyDown={(e) => handleKeyDown(e, type)}
          placeholder={placeholder}
          className="w-full border rounded px-3 py-2 mb-2"
        />
        {isLoading && <p className="text-gray-500">Cargando...</p>}
        {searchResults.length > 0 && (
          <ul className="absolute border rounded bg-white w-full max-h-40 overflow-auto z-10">
            {searchResults.map((user, index) => (
              <li
                key={user.id}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${highlightedIndex === index ? "bg-gray-100" : ""}`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => {
                  setSelectedUser(user);
                  setSearchValue("");
                  setSearchResults([]);
                  setHighlightedIndex(-1);
                }}
              >
                {user.nombre} {user.apellido}
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedUser && (
        <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full mt-2">
          <span className="mr-2">{selectedUser.nombre} {selectedUser.apellido}</span>
          <button
            onClick={() => handleChipRemove(type)}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

BuscarUsuario.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  searchValue: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
  setSearchResults: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
  setSelectedUser: PropTypes.func.isRequired,
  handleKeyDown: PropTypes.func.isRequired,
  handleChipRemove: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  setHighlightedIndex: PropTypes.func.isRequired,
  highlightedIndex: PropTypes.number.isRequired,
  buscarUsuarios: PropTypes.func.isRequired,
};

export default BuscarUsuario;
