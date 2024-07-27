import { overusedGrotesk } from "@/font";
import AppProviders from "./contextProvider";
import "./globals.css";
import NotificationWrapper from "./ui/app/NotificationWrapper/NotificationWrapper";

export const darkMode = false; // À gérer de manière plus appropriée dans le futur

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${
        overusedGrotesk.className
      } m-0 p-0 overflow-hidden h-[100vh] ${darkMode ? "dark" : ""}`}
    >
      <body>
        <AppProviders>
          {children}
          <NotificationWrapper></NotificationWrapper>
        </AppProviders>
      </body>
    </html>
  );
}
