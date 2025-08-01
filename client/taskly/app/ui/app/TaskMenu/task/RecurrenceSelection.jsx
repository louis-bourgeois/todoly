import TaskMenuSectionContainer from "../TaskMenuSectionContainer";
import { useTranslation } from "../../../../i18n/client";

export function RecurrenceSelection({
  handleRecurrenceChange,
  menuOpen,
  setMenuOpen,
}) {
  const { t } = useTranslation();
  return (
    <TaskMenuSectionContainer
      othersStyles="group rounded-full justify-between items-center h-[17.5%] relative cursor-pointer"
    >
      <div
        className={`absolute inset-0 bg-black/70 flex justify-center items-center rounded-full 
                   transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100`}
      >
        <p className="text-white font-bold text-lg select-none">
          {t('recurrence.notAvailable')}
        </p>
      </div>
      <h2 className="pl-[4%] font-bold text-xl text-text">{t('recurrence.onlyThisTime')}</h2>
      
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0"
        y="0"
        className={`cursor-pointer ${
          menuOpen ? "rotate-180" : ""
        } transition-transform duration-500 text-text`}
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
        className={`absolute top-full mt-2 left-0 right-0 bg-primary shadow-lg rounded-lg 
                   transition-opacity duration-300 z-50 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="opacity-100 rounded-xl m-1 p-4 cursor-pointer font-bold hover:text-dominant transition-color transition-transform hover:scale-95 text-text gradient-border">
          {t('recurrence.addSection')}
        </div>
      </div>
    </TaskMenuSectionContainer>
  );
}