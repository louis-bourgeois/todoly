import dynamic from "next/dynamic";
import { memo } from "react";

const Navbar = dynamic(() => import("./ui/landing_page/Navbar"), {
  loading: () => (
    <div
      className="h-16 bg-gray-100 animate-pulse"
      aria-label="Loading navigation"
    ></div>
  ),
});

const Hero = dynamic(() => import("./ui/landing_page/Heroe"), {
  loading: () => (
    <div
      className="h-96 bg-gray-100 animate-pulse"
      aria-label="Loading hero section"
    ></div>
  ),
});

export const metadata = {
  title: "Discover Todoly, The Modern Productivity App",
  description:
    "Boost your productivity with Todoly, the modern app designed for efficient task management. Organize today, simplify tomorrow. Discover more now!",
};

const IconSvg = memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="34"
    height="27"
    viewBox="0 0 34 27"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M9.04526 19.0036C9.64703 18.2363 10.2278 17.4863 10.8186 16.7442C14.8099 11.7317 19.2529 7.19591 24.6715 3.70099C27.1281 2.11656 29.7333 0.842855 32.5727 0.0914798C33.3715 -0.119914 33.9377 0.258188 33.9079 0.954946C33.8933 1.29734 33.6741 1.50643 33.4256 1.68852C29.464 4.59179 25.8339 7.86958 22.4099 11.385C19.7341 14.1321 17.2709 17.0604 14.9025 20.0714C13.3348 22.0644 11.7804 24.068 10.2133 26.0616C9.89937 26.461 9.4561 26.6624 9.03491 26.6303"
      fill="currentColor"
    />
    <path
      d="M9.03496 26.6303C8.96903 26.6253 8.87729 26.6127 8.77345 26.5787C8.77345 26.5787 8.51811 26.5013 8.30517 26.2849C4.98711 22.9121 2.22103 19.1693 0.642912 14.6498C0.341467 13.7865 0.17667 12.891 0.0983648 11.9796C0.0628985 11.5669 0.144617 11.1957 0.512318 10.9586C0.868192 10.7291 1.23148 10.7975 1.58089 10.9998C3.11081 11.8853 4.34798 13.1074 5.50673 14.4184C6.85116 15.9396 7.93167 17.5045 8.91931 18.8337C9.00017 18.9426 9.0406 18.997 9.04531 19.0036C9.95251 20.2748 10.3902 22.5025 9.03496 26.6303Z"
      fill="#007AFF"
    />   
  </svg>
));

IconSvg.displayName = "IconSvg";

const Page = () => {
  return (
    <>
      <header className="w-full">
        <Navbar logo={IconSvg} />
      </header>
      <main className="w-full">
        <Hero />
      </main>
    </>
  );
};

export default memo(Page);
