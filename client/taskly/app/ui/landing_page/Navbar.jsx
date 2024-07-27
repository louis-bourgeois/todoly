import Link from "next/link";
import CTA from "./CTA";

const Navbar = ({ logo: Logo }) => {
  return (
    <nav className="flex justify-between py-[1vh] w-full">
      <div className="items-center flex gap-[11.33px] justify-center">
        <Logo></Logo>
        <span className="font-bold font-smooth antialiased text-m">
          Todo<span className="text-dominant">ly</span>
        </span>{" "}
      </div>
      <div className="flex items-center justify-center gap-[48px]">
        <Link href={"/features"}>
          <CTA title={"Feature"} type="ghost"></CTA>
        </Link>
        <Link href={"/pricing"}>
          <CTA title={"Pricing"} type="ghost"></CTA>
        </Link>
        <Link href={"/auth/login"}>
          <CTA title={"Login"} type="secondary"></CTA>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
