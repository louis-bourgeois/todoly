"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUserPreferences } from "../../context/UserPreferencesContext";

export default function AuthLayout({ children }) {
  const router = useRouter();
  const { loading, isAuthenticated, checkAuth } = useAuth();
  const { preferences, loading: preferencesLoading } = useUserPreferences();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (loading) {
        await checkAuth();
      }

      if (isAuthenticated && preferencesLoading) {
        router.push(`/app/${preferences.Default_Home_Page.toLowerCase()}`);
      } else {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [isAuthenticated, loading, preferences, checkAuth, router]);

  if (isChecking || loading) {
    return <div>Loading...</div>; // ou un composant de chargement plus élaboré
  }

  return <>{children}</>;
}
