import { useMemo } from "react";
import { useUser } from "../../../../../context/UserContext";

const Header = ({ pictDim, pictSrc }) => {
  const { user } = useUser();
  const name = useMemo(() => {
    return user ? `${user.first_name} ${user.last_name}` : "guest";
  }, [user]);
  return (
    <div className="flex justify-between items-center w-full h-[7.8vh] px-[15px]">
      {/* <Image
        width={pictDim}
        height={pictDim}
        priority={true}
        className="rounded-full object-cover"
        src={pictSrc}
        alt="Profile picture"
        onError={(e) => {
          e.target.onerror = null; // Empêche les boucles infinies
          e.target.src = "/default-profile-picture.jpg"; // Assurez-vous d'avoir une image par défaut
        }}
      /> */}

      <div className="flex flex-col items-end justify-center">
        <h1 className="font-bold text-2xl">{name}</h1>
        <span className="font-light cursor-pointer">Free Plan</span>
      </div>
    </div>
  );
};

export default Header;
