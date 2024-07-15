import AppProviders from "./contextProvider";
import "./globals.css";

export const darkMode = false; // voir comment faire cela proprement mdrr
export default function RootLayout({ children }) {
  return <AppProviders>{children}</AppProviders>;
}
