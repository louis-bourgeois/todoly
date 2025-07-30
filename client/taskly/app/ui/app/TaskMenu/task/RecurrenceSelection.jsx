import { useState } from "react";
// CORRECTION : Suppression des imports inutilisés (useRef, useEffect, useError, etc.)
// Le code est plus propre et ne charge que ce qui est nécessaire.
import { useSection } from "../../../../../context/SectionContext";
import { useWorkspace } from "../../../../../context/WorkspaceContext";
import TaskMenuSectionContainer from "../TaskMenuSectionContainer";

// NOTE : Le nom du composant est "RecurrenceSelection", mais sa logique interne
// et son affichage sont liés aux "Sections". Il serait peut-être plus clair
// de le renommer (ex: SectionSelection) si son but est de choisir une section.
export function RecurrenceSelection({
  handleRecurrenceChange, // NOTE : Ce prop n'est actuellement pas utilisé.
  menuOpen,
  // setMenuOpen n'est pas utilisé non plus. Le menu est entièrement contrôlé par le parent.
  setMenuOpen,
}) {
  // CORRECTION : Suppression de tous les états inutilisés (editingSectionId, editingName, etc.)
  // Cela allège considérablement le composant.
  const { sections } = useSection();
  const { currentWorkspace } = useWorkspace();

  // Cette logique est correcte, on la conserve.
  const filteredSections = sections.filter(
    (section) => section.workspace_id === currentWorkspace
  );

  return (
    // CORRECTION : Remplacement de l'état `isHovered` par les classes `group` et `group-hover` de Tailwind.
    // C'est plus simple et plus performant car cela ne déclenche pas de re-render.
    <TaskMenuSectionContainer
      othersStyles="group rounded-full justify-between items-center h-[17.5%] relative cursor-pointer"
    >
      {/* L'overlay s'affiche maintenant au survol grâce à `group-hover` */}
      <div
        className={`absolute inset-0 bg-black/70 flex justify-center items-center rounded-full 
                   transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100`}
      >
        <p className="text-white font-bold text-lg">
          Pas encore disponible, en dev
        </p>
      </div>

      {/* Le titre semble lié à la récurrence, ce qui est en contradiction avec le reste. */}
      <h2 className="pl-[4%] font-bold text-xl text-text">Seulement cette fois</h2>
      
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
      
      {/* Menu déroulant */}
      <div
        className={`absolute top-full mt-2 left-0 right-0 bg-primary shadow-lg rounded-lg 
                   transition-opacity duration-300 z-50 ${ // z-55 est une valeur inhabituelle, z-50 est standard
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="opacity-100 rounded-xl m-1 p-4 cursor-pointer font-bold hover:text-dominant transition-color transition-transform hover:scale-95 text-text gradient-border">
          {/* TODO: Implémenter la logique pour ajouter une section */}
          Ajouter une section
        </div>
        
        <div
          className={`${
            filteredSections.length > 4 ? "max-h-60 overflow-y-auto" : ""
          }`}
        >
          {/* CORRECTION MAJEURE : Utilisation de `filteredSections` au lieu d'un tableau vide `[]`. */}
          {filteredSections.map((section) => (
            <div
              key={section.id}
              className="flex items-center p-4 hover:bg-secondary/20"
              // TODO: Appeler une fonction ici, par exemple handleRecurrenceChange(section)
              onClick={(e) => {
                console.log("Section sélectionnée :", section);
              }}
            >
              {/* Il manque le contenu à afficher, par exemple le nom de la section */}
              <span className="text-text">{section.name}</span>
            </div>
          ))}
        </div>
      </div>
    </TaskMenuSectionContainer>
  );
}