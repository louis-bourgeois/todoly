import Fuse from "fuse.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../../Cards/assets/Button";

const fuseOptions = { keys: ["name"], threshold: 0.3 };

const SuggestionsList = ({
  suggestions,
  onItemClick,
  isOpen,
  inputRect,
  maxVisibleSuggestions = 5,
}) => {
  const listRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRect && listRef.current) {
      const updatePosition = () => {
        const { bottom, left, width } = inputRect;
        const { innerHeight, innerWidth } = window;
        const listRect = listRef.current.getBoundingClientRect();

        let top = bottom;
        let leftPos = left;

        // Check if list would go off-screen vertically
        if (top + listRect.height > innerHeight) {
          top = bottom - listRect.height - inputRect.height;
        }

        // Check if list would go off-screen horizontally
        if (left + listRect.width > innerWidth) {
          leftPos = innerWidth - listRect.width;
        }

        listRef.current.style.top = `${top}px`;
        listRef.current.style.left = `${leftPos}px`;
        listRef.current.style.width = `${width}px`;
      };

      updatePosition();
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen, inputRect]);

  if (!inputRect) return null;

  return createPortal(
    <ul
      ref={listRef}
      className="z-50 bg-white rounded-md shadow-lg overflow-auto transition-all duration-300 ease-in-out fixed"
      style={{
        maxHeight: `${maxVisibleSuggestions * 40}px`,
        opacity: isOpen ? 1 : 0,
        transform: `scale(${isOpen ? 1 : 0.95})`,
        visibility: isOpen ? "visible" : "hidden",
      }}
    >
      {suggestions.map((item) => (
        <li
          key={item.id}
          onClick={() => onItemClick(item)}
          className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
        >
          {item.name}
        </li>
      ))}
    </ul>,
    document.body
  );
};

export default function WorkspaceLayoutSection({
  label,
  link = null,
  searchLabel,
  items = [],
  onItemSelect,
  search = false,
  isCollaborator = false,
}) {
  const [copyStatus, setCopyStatus] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [inputRect, setInputRect] = useState(null);
  const inputRef = useRef(null);

  const fuse = useMemo(
    () => (search ? new Fuse(items, fuseOptions) : null),
    [items, search]
  );

  useEffect(() => {
    if (search && inputValue !== "" && fuse) {
      const results = fuse.search(inputValue);
      setSuggestions(results.map((result) => result.item));
      setIsOpen(results.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [search, inputValue, fuse]);

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
    if (inputRef.current) {
      setInputRect(inputRef.current.getBoundingClientRect());
    }
  }, []);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && inputValue.trim() !== "") {
        if (isCollaborator) {
          onItemSelect({ name: inputValue.trim() });
        } else if (suggestions.length > 0) {
          onItemSelect(suggestions[0]);
        }
        setInputValue("");
        setIsOpen(false);
      }
    },
    [inputValue, onItemSelect, isCollaborator, suggestions]
  );

  const handleCopyLink = useCallback(async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopyStatus("Link copied!");
      setTimeout(() => setCopyStatus(""), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setCopyStatus("Copy failed");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  }, [link]);

  const handleItemClick = useCallback(
    (item) => {
      onItemSelect(item);
      setInputValue("");
      setIsOpen(false);
    },
    [onItemSelect]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col w-full gap-[10px] px-4">
      <h2 className="text-lg font-bold text-black mb-2">{label}</h2>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={searchLabel}
            className="p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 w-9/12"
          />
          {link && (
            <div className="relative ml-2">
              <Button
                label={copyStatus || "Copy Link"}
                light={true}
                onClick={handleCopyLink}
                className={copyStatus ? "opacity-50 cursor-default" : ""}
              />
              {copyStatus && (
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow transition-opacity duration-200 opacity-100">
                  {copyStatus}
                </span>
              )}
            </div>
          )}
        </div>
        {search && (
          <SuggestionsList
            suggestions={suggestions}
            onItemClick={handleItemClick}
            isOpen={isOpen}
            inputRect={inputRect}
          />
        )}
      </div>
    </div>
  );
}
