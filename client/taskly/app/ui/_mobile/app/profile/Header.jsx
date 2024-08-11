import ProfilePhoto from "@/ui/app/MainMenu/settings/Account/ProfilePhoto";
import { useMemo } from "react";
import { useUser } from "../../../../../context/UserContext";

const Header = () => {
  const { user } = useUser();
  const name = useMemo(() => {
    return user ? `${user.first_name} ${user.last_name}` : "guest";
  }, [user]);
  return (
    <div className="flex justify-between items-center w-full h-[7.8vh] px-[15px]">
      <ProfilePhoto size={90} />

      <div className="flex flex-col items-end justify-center">
        <h1 className="font-bold text-2xl text-text">{name}</h1>
        <span className="font-light cursor-pointer text-text">
          Free Plan
        </span>
      </div>
    </div>
  );
};

export default Header;
