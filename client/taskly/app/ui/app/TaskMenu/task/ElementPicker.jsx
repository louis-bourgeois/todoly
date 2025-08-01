import { useState } from "react";
import TaskMenuSectionContainer from "../TaskMenuSectionContainer";
import { useTranslation } from "../../../../i18n/client";

export default function ElementPicker({
  elementType,
  handleElementTypeChange,
  menuOpen,
  setMenuOpen,
}) {
  const [isFading, setIsFading] = useState(false);
  const { t } = useTranslation();
  const [elements] = useState([t('elementPicker.task'), t('elementPicker.workspace')]);

  const handleElementTypeChangeWithFade = (newType) => {
    setMenuOpen(false);
    setIsFading(true);
    setTimeout(() => {
      handleElementTypeChange(newType);
      setIsFading(false);
    }, 500);
  };

  const toggleMenu = (e) => {
    console.log("e", e);
    setMenuOpen((prev) => !prev);
  };

  return (
    <TaskMenuSectionContainer
      othersStyles="rounded-full justify-between items-center h-[80%] z-[200] relative cursor-pointer"
      onClick={toggleMenu}
    >
      <h2 className="pl-[4%] font-bold text-2xl text-text select-none">{elementType}</h2>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0"
        y="0"
        className={`cursor-pointer z-[220] transition-transform duration-500 text-text ${
          menuOpen ? "transform rotate-180" : ""
        }`}
        viewBox="0 0 29 29"
        width="62.5"
        height="62.5"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="2.5"
          d="m20.5 11.5-6 6-6-6"
        ></path>
      </svg>
      <div
        className={`absolute top-full border rounded-[12px] mt-2 left-0 right-0 bg-primary
           shadow-lg rounPded-lg transition-all duration-300 z-[255] ${
             menuOpen
               ? "opacity-100 max-h-[200px]"
               : "opacity-0 max-h-0 overflow-hidden pointer-events-none"
           }`}
      >
        {elements.map((el) => (
          <div
            key={el}
            className=" p-4 cursor-pointer hover:text-dominant transition-colors select-none duration-300 text-text"
            onClick={() => handleElementTypeChangeWithFade(el)}
          >
            {el.charAt(0).toUpperCase() + el.slice(1)}
          </div>
        ))}
      </div>
    </TaskMenuSectionContainer>
  );
}