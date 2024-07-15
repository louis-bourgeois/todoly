"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../AuthContext";

const AuthGuard = ({ children }) => {
  const { user, loading, authChecked } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authChecked && !user && !loading) {
      router.push(`/login?returnUrl=${pathname}`);
    }
  }, [user, loading, authChecked, router, pathname]);

  if (loading || !authChecked) {
    return <div>Loading...</div>; // Ou un composant de chargement plus élaboré
  }

  return user ? children : null;
};

export default AuthGuard;
