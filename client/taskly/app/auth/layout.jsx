"use client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
export default function AuthLayout({ children }) {
  const { user, loading } = useUser();
  const [isChecking, setIsChecking] = useState(true);
  useEffect(() => {
    if (user && !loading) {
      redirect("/app");
    } else {
      setIsChecking(false);
    }
  }, [user, loading]);
  if (isChecking) {
    return null;
  }
  return <>{children}</>;
}
