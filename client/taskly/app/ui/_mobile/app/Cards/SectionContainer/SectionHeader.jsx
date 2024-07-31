import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSection } from "../../../../../../context/SectionContext";
import AutoResizeInput from "../../AutoResizeInput";

const SectionHeader = React.memo(
  ({
    section,
    onSectionNameChange,
    editIcon: EditIcon,
    editIconSize = 16,
    showEditIcon = true,
    allowEditing = true,
    placeholderText = "Enter section name",
    index,
  }) => {
    const { deleteSection } = useSection();
    const [isEditing, setIsEditing] = useState(false);
    const [localName, setLocalName] = useState(section.name);
    const [error, setError] = useState(null);
    const [isErrorVisible, setIsErrorVisible] = useState(false);
    const [width, setWidth] = useState("auto");
    const measureRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
      setLocalName(section.name);
      updateWidth(section.name);
    }, [section.name]);

    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditing]);

    useEffect(() => {
      if (error) {
        setIsErrorVisible(true);
        const timer = setTimeout(() => {
          setIsErrorVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [error]);

    useEffect(() => {
      if (!isErrorVisible && error) {
        const timer = setTimeout(() => {
          setError(null);
        }, 300); // Durée de la transition
        return () => clearTimeout(timer);
      }
    }, [isErrorVisible, error]);

    const updateWidth = (text) => {
      if (measureRef.current) {
        measureRef.current.textContent = text;
        setWidth(`${measureRef.current.offsetWidth + 10}px`);
      }
    };

    const handleDeleteSection = async (id) => {
      try {
        await deleteSection(id);
      } catch (error) {
        console.error("Failed to delete section", error);
        setError(error.response?.data?.subtitle || "Failed to delete section");
      }
    };

    const handleInputChange = useCallback((e) => {
      const newValue = e.target.value;
      setLocalName(newValue);
      updateWidth(newValue);
      setError(null);
    }, []);

    const handleEdit = useCallback(async () => {
      if (localName !== section.name && localName.trim() !== "") {
        try {
          await onSectionNameChange(localName, section.id);
          setIsEditing(false);
        } catch (error) {
          console.error("Failed to update section: ", error);
          setError("Failed to update. Please try again.");
        }
      } else if (localName.trim() === "") {
        setError("Section name cannot be empty.");
        setLocalName(section.name);
        updateWidth(section.name);
      } else {
        setIsEditing(false);
      }
    }, [localName, section.id, section.name, onSectionNameChange]);

    const handleBlur = useCallback(() => {
      handleEdit();
    }, [handleEdit]);

    const toggleEditing = useCallback(() => {
      if (allowEditing) {
        setIsEditing((prev) => !prev);
        setError(null);
      }
    }, [allowEditing]);

    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleEdit();
        } else if (e.key === "Escape") {
          setLocalName(section.name);
          updateWidth(section.name);
          setIsEditing(false);
        }
      },
      [handleEdit, section.name]
    );

    return (
      <div
        className={`flex items-center gap-2 px-4 py-2 ${
          index === 0 && "mt-[15px]"
        }`}
      >
        <div
          style={{
            position: "relative",
            display: "inline-block",
            minWidth: "50px",
          }}
        >
          {isEditing ? (
            <AutoResizeInput
              ref={inputRef}
              className="font-bold text-m bg-transparent focus:outline-none"
              value={localName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={placeholderText}
              style={{ width }}
            />
          ) : (
            <span
              className="font-bold text-m"
              style={{ display: "inline-block", width }}
            >
              {section.name}
            </span>
          )}
          <span
            ref={measureRef}
            className="font-bold text-m"
            style={{
              visibility: "hidden",
              position: "absolute",
              top: 0,
              left: 0,
              whiteSpace: "pre",
            }}
          >
            {localName}
          </span>
        </div>
        {showEditIcon &&
          allowEditing &&
          (EditIcon ? (
            <EditIcon onClick={toggleEditing} size={editIconSize} />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={editIconSize}
              height={editIconSize}
              viewBox="0 0 12 12"
              fill="none"
              onClick={toggleEditing}
              className="cursor-pointer flex-shrink-0 group transition-colors duration-300 ease-in-out"
            >
              <g clipPath="url(#clip0_1050_205)">
                <path
                  d="M10.64 3.20003L5.86995 7.97C5.39495 8.445 3.98494 8.665 3.66994 8.35C3.35494 8.035 3.56994 6.625 4.04494 6.15L8.81995 1.37501C8.9377 1.24654 9.08025 1.14327 9.23905 1.07142C9.3978 0.99957 9.5695 0.96062 9.74375 0.95695C9.91795 0.953285 10.0912 0.984955 10.2528 1.05006C10.4145 1.11517 10.5613 1.21237 10.6843 1.33577C10.8074 1.45917 10.9042 1.60622 10.9688 1.76805C11.0335 1.92988 11.0647 2.10313 11.0606 2.27736C11.0564 2.45158 11.017 2.62318 10.9447 2.78175C10.8724 2.94033 10.7688 3.08262 10.64 3.20003Z"
                  className="stroke-black group-hover:stroke-dominant  transition-colors duration-300 ease-in-out"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.5 2H3C2.46956 2 1.96089 2.21071 1.58581 2.58578C1.21074 2.96086 1 3.46956 1 4V9C1 9.53045 1.21074 10.0391 1.58581 10.4142C1.96089 10.7893 2.46956 11 3 11H8.5C9.605 11 10 10.1 10 9V6.5"
                  className="stroke-black group-hover:stroke-dominant "
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1050_205">
                  <rect width="12" height="12" fill="white" />
                </clipPath>
              </defs>
            </svg>
          ))}
        {section.name !== "Other" && (
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="cursor-pointer"
            onClick={() => handleDeleteSection(section.id)}
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0" />
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
              <path
                d="M3 6.98996C8.81444 4.87965 15.1856 4.87965 21 6.98996"
                stroke="#FA3766"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.00977 5.71997C8.00977 4.6591 8.43119 3.64175 9.18134 2.8916C9.93148 2.14146 10.9489 1.71997 12.0098 1.71997C13.0706 1.71997 14.0881 2.14146 14.8382 2.8916C15.5883 3.64175 16.0098 4.6591 16.0098 5.71997"
                stroke="#FA3766"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 13V18"
                stroke="#FA3766"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 9.98999L18.33 17.99C18.2225 19.071 17.7225 20.0751 16.9246 20.8123C16.1266 21.5494 15.0861 21.9684 14 21.99H10C8.91389 21.9684 7.87336 21.5494 7.07541 20.8123C6.27745 20.0751 5.77745 19.071 5.67001 17.99L5 9.98999"
                stroke="#FA3766"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        )}
        {error && (
          <p
            className={`text-important text-2xs transition-opacity duration-300 ease-in-out ${
              isErrorVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
