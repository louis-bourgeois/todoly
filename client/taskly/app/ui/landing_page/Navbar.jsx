import useSmoothScroll from "@/useSmoothScroll";
import Link from "next/link";
import CTA from "./CTA";

const Navbar = ({ logo: Logo }) => {
  const scrollToSection = useSmoothScroll();

  return (
    <nav className="flex justify-between items-center py-4 px-4 sm:px-[9vw] w-full">
      <div className="flex items-center gap-2">
        <div className="lg:w-10 lg:h-10 w-7 h-7 flex items-center justify-center">
          <Logo className="w-full h-full" />
        </div>
        <span className="font-bold font-smooth antialiased text-m lg:text-xl text-text">
          Todo<span className="text-dominant">ly</span>
        </span>
      </div>
      <div className="flex items-center sm:gap-6">
        <button onClick={() => scrollToSection("pricing")}>
          <CTA
            title="Pricing"
            type="ghost"
            className="py-3 px-6 text-base lg:text-lg"
          />
        </button>
        <Link href="/auth/login">
          <CTA
            title="Join the open beta"
            type="secondary"
            className="lg:py-3 lg:px-6 px-2 py-1 text-base lg:text-lg"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
