import Link from "next/link";
import CTA from "./CTA";

const Heroe = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-[32px] w-full">
      <div className="flex flex-col items-center justify-center gap-[16px]">
        <h1 className="font-bold text-5xl">
          Clarify <span className="text-dominant">Today</span>, Simplify{" "}
          <span className="text-dominant">Tomorrow</span>.
        </h1>
        <p className="text-m text-grey text-center">
          Manage your tasks, workspaces, and goals in one intuitive platform,
          designed to boost your productivity.
        </p>
      </div>

      <Link href="/auth/signup" passHref legacyBehavior>
        <CTA title="Simplify Tomorrow" className="py-4 px-6" />
      </Link>
    </div>
  );
};

export default Heroe;
