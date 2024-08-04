"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUserPreferences } from "../../context/UserPreferencesContext";

export default function AuthLayout({ children }) {
  const router = useRouter();
  const { loading, isAuthenticated, checkAuth } = useAuth();
  const { preferences } = useUserPreferences();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (loading) {
        await checkAuth();
      }

      if (isAuthenticated && preferences) {
        router.push(`/app`);
      } else {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [isAuthenticated, preferences, checkAuth, router]);

  return <>{children}</>;
}
