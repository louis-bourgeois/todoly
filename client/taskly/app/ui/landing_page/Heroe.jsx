import dynamic from "next/dynamic";
import Link from "next/link";
import { memo } from "react";

const CTA = dynamic(() => import("./CTA"), {
  loading: () => (
    <div
      className="py-4 px-6 bg-gray-200 text-center rounded-full animate-pulse"
      aria-busy="true"
      aria-live="polite"
    >
      Loading...
    </div>
  ),
  ssr: false,
});

const HeroTitle = memo(() => (
  <h1
    id="hero-heading"
    className="font-bold text-3xl sm:text-4xl text-text leading-tight"
  >
    Clarify <span className="text-dominant">Today</span>, Simplify{" "}
    <span className="text-dominant">Tomorrow</span>.
  </h1>
));
HeroTitle.displayName = "HeroTitle";

const HeroDescription = memo(() => (
  <p className="text-sm sm:text-base text-grey max-w-2xl">
    Manage your tasks, workspaces, and goals in one intuitive platform, designed
    to boost your productivity.
  </p>
));
HeroDescription.displayName = "HeroDescription";

const HeroCTA = memo(() => (
  <Link href="/auth/signup">
    <CTA
      title="Simplify Tomorrow"
      type="primary"
      className="py-4 px-6 text-base sm:text-lg font-semibold rounded-full hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      aria-label="Sign up to simplify your workflow"
    />
  </Link>
));
HeroCTA.displayName = "HeroCTA";

const Hero = () => {
  return (
    <section
      className="flex flex-col justify-center items-center gap-8 w-full mx-auto px-4 py-12"
      aria-labelledby="hero-heading"
    >
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <HeroTitle />
        <HeroDescription />
      </div>
      <HeroCTA />
    </section>
  );
};

export default memo(Hero);
