import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMenu } from "../../../../context/MenuContext";
const SearchInput = ({ query, onQueryChange, placeholder }) => {
  const [localQuery, setLocalQuery] = useState(query);
  const { toggleTaskMenu, isSearchMenuOpen } = useMenu();
  const inputRef = useRef();

  useEffect(() => {
    if (isSearchMenuOpen) inputRef.current.focus();
  }, [isSearchMenuOpen]);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const debouncedOnQueryChange = useCallback(
    debounce((value) => onQueryChange(value), 300),
    [onQueryChange]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    debouncedOnQueryChange(value);
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={localQuery}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full h-[7vh] min-h-[40px] px-[2vw] py-[1vw] text-[1.2vw] text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
      />
      <svg
        className="absolute right-[2vw] top-1/2 transform -translate-y-1/2 w-[1.5vw] h-[1.5vw] min-w-[20px] min-h-[20px] text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

export default SearchInput;
