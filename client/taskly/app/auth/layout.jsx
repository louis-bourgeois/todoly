"use client";
import { useTranslation } from "../i18n/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUserPreferences } from "../../context/UserPreferencesContext";

export default function AuthLayout({ children, params: { lng } }) {
  const router = useRouter();
  const { loading, isAuthenticated, checkAuth } = useAuth();
  const { preferences } = useUserPreferences();
  const [isChecking, setIsChecking] = useState(true);
  const { t } = useTranslation(lng, "auth");

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
  }, [isAuthenticated, preferences, checkAuth, router, loading, lng]);

  return <>{children}</>;
}
