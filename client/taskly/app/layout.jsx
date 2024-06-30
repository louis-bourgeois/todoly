import { poppins } from "@/font";
import AppProviders from "./contextProvider";
import "./globals.css";

export const darkMode = false; // voir comment faire cela proprement mdrr
export default function RootLayout({ children }) {
  return (
    <AppProviders>
      <html lang="en" className={poppins.className}>
        <body className={`${darkMode ? "bg-[#0D0C0C]" : ""} text-shadow-01`}>
          {children}
        </body>
      </html>
    </AppProviders>
  );
}
