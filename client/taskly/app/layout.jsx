import { overusedGrotesk } from "@/font";
import dynamic from "next/dynamic";
import CanonicalTag from "./CanonicalTag";
import AppProviders from "./contextProvider";
import "./globals.css";

const NotificationWrapper = dynamic(
  () => import("./ui/app/NotificationWrapper/NotificationWrapper"),
  {
    ssr: false,
  }
);

export const metadata = {
  title: "Todoly",
  description:
    "Manage your tasks, workspaces, and goals in one intuitive platform, designed to boost your productivity.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Todoly",
  },
  icons: {
    icon: "/taskly/logo.svg",
    apple: "/taskly/logo.svg",
  },
};

export const viewport = {
  themeColor: "#f7f4ed",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${overusedGrotesk.variable} font-sans m-0 p-0 overflow-hidden h-screen bg-bg `}
    >
      <head>
        <CanonicalTag />
      </head>
      <body>
        <AppProviders>
          {children}
          <NotificationWrapper />
        </AppProviders>
      </body>
    </html>
  );
}
