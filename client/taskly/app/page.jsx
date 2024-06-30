import { darkMode } from "@/layout";
import Heroe from "ui/home/heroe/Heroe.jsx";
import Navbar from "ui/home/navbar/Navbar.jsx";
export const metadata = {
  title: "Discover Taskly, The Modern Productivity App",
  description: "Home page of Taskly",
};
export default function Page() {
  const navLinks = [
    { title: "Pricing", href: "/pricing" },
    { title: "Features", href: "/features" },
  ];
  const logoAriaLabel = "The logo of the taskly app";
  const imagePath = darkMode ? "/taskly/logo-2.png" : "/taskly/logo-1.png";
  const imageDimensions = {
    width: 210,
    height: 210,
  };
  const imageHREF = "http://localhost:3000";
  return (
    <>
      <Navbar
        links={navLinks}
        image={imagePath}
        imageAriaLabel={logoAriaLabel}
        imageDimensions={imageDimensions}
        imageHREF={imageHREF}
        darkMode={darkMode}
        connectButons="true"
      ></Navbar>
      <Heroe
        darkMode={darkMode}
        subtitle="Your Ultimate Workspace for Organised Thoughts and Actions."
      ></Heroe>
    </>
  );
}
