import Downshift from "downshift";
import Fuse from "fuse.js";
import { useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { useUser } from "../../../../../context/UserContext";

const fuseOptions = { keys: ["name"], threshold: 0.3 };

export default function SectionSelectContainer({
  workspaceSections,
  setWorkspaceSections,
}) {
  const { sections } = useUser();
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const fuse = new Fuse(sections, fuseOptions);

  useEffect(() => {
    if (inputValue === "") {
      setSuggestions([]);
    } else {
      const results = fuse.search(inputValue);
      setSuggestions(results.map((result) => result.item));
    }
  }, [inputValue, sections]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault();
      setInputValue(suggestions[0].name);
    }
  };

  const executeCommand = (selection) => {
    if (selection && !workspaceSections.some((s) => s.id === selection.id)) {
      setWorkspaceSections((prev) => [...prev, selection]);
      setInputValue("");
    }
  };

  return (
    <div className="h-[95%] rounded-[20px] w-[55%] addMenuElement glass-morphism flex flex-col justify-start gap-[7.5%] items-center">
      <h1 className="text-4xl font-extrabold">Sections</h1>
      <Downshift
        inputValue={inputValue}
        onInputValueChange={handleInputChange}
        onSelect={(selection) => executeCommand(selection)}
        itemToString={(item) => (item ? item.name : "")}
      >
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          isOpen,
          highlightedIndex,
          selectedItem,
        }) => (
          <div className="w-[80%] flex flex-col items-center">
            <div className="glass-morphism addMenuElement rounded-full w-full flex justify-around mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="39"
                height="40"
                viewBox="0 0 29 30"
                fill="none"
                className="pl-[1%] cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <g filter="url(#filter0_d_336_5534)">
                  <path
                    d="M18.0974 16.8815C15.2072 19.2232 10.8854 19.961 7.24978 18.5817C2.86603 16.9186 0.0735771 12.2407 0.91226 7.88831C1.75144 3.5329 6.11578 0.00992846 10.9961 -0.0904905C11.0859 -0.0918756 11.1757 -0.0923372 11.2658 -0.0921064C16.0623 -0.0498612 20.5841 3.38447 21.4726 7.82875C22.0682 10.8076 21.0411 14.0259 18.8132 16.2392L27.468 24.0465C27.6536 24.2284 27.6215 24.2889 27.6185 24.3903C27.608 24.7423 27.0935 24.9736 26.7741 24.7086L18.0974 16.8815ZM11.1372 0.831286C6.85594 0.868914 2.83867 3.87225 1.94824 7.78235C1.29291 10.6608 2.32516 13.8227 4.59515 15.8789C7.20201 18.24 11.3282 19.0327 14.7701 17.7268C18.7515 16.2166 21.284 11.9478 20.494 7.99704C19.7111 4.08024 15.8018 0.923856 11.3815 0.832671C11.3001 0.831518 11.2186 0.831056 11.1372 0.831286Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_336_5534"
                    x="-0.236328"
                    y="-0.0921631"
                    width="28.8586"
                    height="29.9154"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="0.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_336_5534"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_336_5534"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
              <input
                {...getInputProps({
                  ref: inputRef,
                  onKeyDown: handleKeyDown,
                  placeholder: "What sections do you want to link ?",
                  className:
                    "placeholder:text-gray w-full text-center focus:outline-none text-black bg-transparent",
                })}
              />
            </div>
            <ul
              {...getMenuProps()}
              className="w-full px-[3%] mt-[2%] max-h-[20vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            >
              <TransitionGroup component={null}>
                {isOpen &&
                  suggestions
                    .filter((section) => !workspaceSections.includes(section))
                    .map((section, index) => (
                      <CSSTransition
                        key={section.id}
                        timeout={300}
                        classNames="fade"
                      >
                        <li
                          {...getItemProps({
                            key: section.id,
                            index,
                            item: section,
                            className: `bg-white p-2 my-1 rounded cursor-pointer hover:bg-gray-200 transition duration-300 ${
                              highlightedIndex === index ? "bg-gray-200" : ""
                            } ${selectedItem === section ? "font-bold" : ""}`,
                          })}
                        >
                          {section.name}
                        </li>
                      </CSSTransition>
                    ))}
              </TransitionGroup>
            </ul>
          </div>
        )}
      </Downshift>
      <div className="w-full flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-5">
        {workspaceSections.map((section, index) => (
          <div key={section.id || index} className="mb-3">
            <div className="p-2 addMenuElement rounded-full flex justify-between items-center">
              <span className="text-center block">{section.name}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="cursor-pointer"
                onClick={() =>
                  setWorkspaceSections((prev) =>
                    prev.filter((s) => s.id !== section.id)
                  )
                }
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
