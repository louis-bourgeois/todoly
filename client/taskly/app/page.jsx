import dynamic from "next/dynamic";
import Head from "next/head";
import { memo } from "react";

const ScrollAnimation = dynamic(
  () => import("./ui/ScrollAnimation/ScrollAnimation"),
  {
    loading: () => <div className="h-screen bg-gray-100 animate-pulse"></div>,
  }
);

export const metadata = {
  title: "Discover Todoly, The Modern Productivity App",
  description:
    "Boost your productivity with Todoly, the modern app designed for efficient task management. Organize today, simplify tomorrow. Discover more now!",
};

const Page = () => {
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/animation-frames/0001.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
      </Head>
      <ScrollAnimation />
    </>
  );
};

export default memo(Page);