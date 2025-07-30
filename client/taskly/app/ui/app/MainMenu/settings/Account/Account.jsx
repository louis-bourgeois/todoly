import { useState } from "react"; // 1. Importer useState
import CTA from "@/app/ui/landing_page/CTA";
import { useAuth } from "../../../../../../context/AuthContext";
import { useUser } from "../../../../../../context/UserContext";
import ProfilePhoto from "./ProfilePhoto";

export default function Account({ transitionStyles, setLayout }) {
  const { user } = useUser();
  const { logout } = useAuth();

  // 2. Créer un état pour suivre le survol du bouton "premium"
  const [isPremiumHovered, setIsPremiumHovered] = useState(false);

  // Une fonction pour le bouton premium (au lieu de `logout`)
  const handlePremiumClick = () => {
    alert("La fonctionnalité Premium arrive bientôt !");
  };

  return (
    <div className={`flex justify-between w-full ${transitionStyles}`}>
      <div className="flex flex-col justify-center items-center w-1/2 gap-[2.5vh]">
        {/* Le composant ProfilePhoto n'est pas modifié */}
        <ProfilePhoto /> 
        <div className="mr-5 flex flex-col items-center  gap-[1vh] w-full">
          <CTA onClick={logout} type="secondary" title="Sign out"></CTA>
        </div>
      </div>
      <div className=" text-text flex flex-col gap-[2%] justify-center items-center w-1/2">
        <div className="flex justify-around items-center gap-[1vw]">
          <h2 className="font-extrabold text-2xl">{`${user.first_name} ${user.last_name}`}</h2>
          <svg
            width="25"
            height="25"
            className="mt-[1%] cursor-pointer hover:scale-110 active:scale-100 transition-transform ease-out"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => setLayout("Data")}
          >
            {/* ... le contenu de votre SVG reste identique ... */}
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                stroke="#007AFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
              <path
                d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                stroke="#007AFF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
            </g>
          </svg>
        </div>

        <div className="mr-5 mt-[20%] flex flex-col items-center gap-[1vh] w-full">
          {/* 3. Envelopper le CTA dans un div pour capturer les événements de la souris */}
          <div
            onMouseEnter={() => setIsPremiumHovered(true)}
            onMouseLeave={() => setIsPremiumHovered(false)}
            className="w-full flex flex-col items-center" // Assurez-vous que le div prend toute la largeur
          >
            <CTA
              onClick={handlePremiumClick} // J'ai changé ceci pour ne pas déconnecter l'utilisateur
              type="primary"
              // 4. Changer le titre et ajouter les classes de style dynamiquement
              title={isPremiumHovered ? "It is free !" : "Go premium"}
              className="p-3 transition-all duration-300 hover:brightness-90"
              disabled={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}