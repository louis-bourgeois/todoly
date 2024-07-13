"use client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
export default function AuthLayout({ children }) {
  const {loading} = useAuth();

  const { user} = useUser();

  const {

    preferences,

  } = useUserPreferences();

  
  const { handleError } = useError();

  const [isChecking, setIsChecking] = useState(true);
  useEffect(() => {
    if (user && !loading) {
      if (preferences.Default_Main_Page) {
        redirect("/app/" + preferences.Default_Main_Page.toLowerCase());
      }
    } else {
      setIsChecking(false);
    }
  }, [user, loading]);
  if (isChecking) {
    return null;
  }
  return <>{children}</>;
}
