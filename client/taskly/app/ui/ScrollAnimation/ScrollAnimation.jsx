"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useScreen } from "../../../context/ScreenContext";
import Heroe from "../landing_page/Heroe";
import MobileTextContent from "./MobileTextContent";
import PricingSection from "./PricingSection";

const Navbar = dynamic(() => import("../landing_page/Navbar"), {
  loading: () => (
    <div
      className="h-16 bg-gray-100 animate-pulse"
      aria-label="Loading navigation"
    ></div>
  ),
});

// Constants
const TOTAL_FRAMES = 180;
const THROTTLE_DELAY = 16;
const FRAME_SKIP_THRESHOLD = 5;
const TEXT_APPEAR_FRAME = 85;
const TEXT_END_FRAME = 178;

const AnimatedTextOpacity = ({ text, progress, className }) => {
  const words = text.split(" ");

  return (
    <div
      className={`flex flex-wrap ${className}`}
      style={{ wordSpacing: "0.5rem" }}
    >
      {words.map((word, wordIndex) => {
        const dominantWords = [
          "intuitive",
          "workspace",
          "easy",
          "way",
          "approach",
          "interact",
          "quickly",
        ];

        const delay = wordIndex * 5;
        const letterProgress = Math.max(
          0,
          Math.min(1, (progress * 100 - delay) / 10)
        );

        return (
          <span
            key={wordIndex}
            className={`mr-1 mb-1 ${
              dominantWords.includes(word.toLowerCase()) ? "text-dominant" : ""
            }`}
          >
            {word.split("").map((letter, letterIndex) => (
              <span
                key={letterIndex}
                className="inline-block transition-opacity duration-300 ease-out"
                style={{
                  opacity: letterProgress,
                }}
              >
                {letter}
              </span>
            ))}
          </span>
        );
      })}
    </div>
  );
};

const IconSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="34"
    height="27"
    viewBox="0 0 34 27"
    fill="none"
    aria-hidden="true"
    className="text-text"
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
);

const ScrollAnimation = ({ children }) => {
  const { isMobile } = useScreen();
  const [currentFrame, setCurrentFrame] = useState(1);
  const [loadedFrames, setLoadedFrames] = useState({});
  const [containerHeight, setContainerHeight] = useState("250vh");
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const lastExecutionRef = useRef(0);
  const lastFrameRef = useRef(1);

  const preloadImage = useCallback(
    (frameNumber) => {
      return new Promise((resolve) => {
        if (loadedFrames[frameNumber]) {
          resolve();
          return;
        }
        const img = new Image();
        img.onload = () => {
          setLoadedFrames((prev) => ({ ...prev, [frameNumber]: img.src }));
          resolve();
        };
        img.onerror = resolve;
        img.src = `/animation-frames/${String(frameNumber).padStart(
          4,
          "0"
        )}.webp`;
      });
    },
    [loadedFrames]
  );

  useEffect(() => {
    if (!isMobile) {
      setIsLoading(true);
      const preloadAllImages = async () => {
        const promises = [];
        for (let i = 1; i <= TOTAL_FRAMES; i++) {
          promises.push(preloadImage(i));
        }
        await Promise.all(promises);
        setIsLoading(false);
      };
      preloadAllImages();
    }
  }, [isMobile, preloadImage]);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current && animationRef.current) {
        const viewportHeight = window.innerHeight;
        const animationHeight = animationRef.current.offsetHeight;
        const newContainerHeight =
          viewportHeight + animationHeight + (isMobile ? 200 : 0);
        setContainerHeight(`${newContainerHeight}px`);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      const handleScroll = () => {
        const now = performance.now();
        if (now - lastExecutionRef.current < THROTTLE_DELAY) return;
        lastExecutionRef.current = now;

        if (containerRef.current && animationRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const animationRect = animationRef.current.getBoundingClientRect();

          const startPoint = containerRect.top + window.scrollY;
          const endPoint =
            startPoint + containerRect.height - animationRect.height;
          const scrollProgress =
            (window.scrollY - startPoint) / (endPoint - startPoint);

          if (scrollProgress >= 0 && scrollProgress <= 1) {
            const frameIndex =
              Math.floor(scrollProgress * (TOTAL_FRAMES - 1)) + 1;
            const frameDiff = Math.abs(frameIndex - lastFrameRef.current);

            if (frameDiff > FRAME_SKIP_THRESHOLD) {
              lastFrameRef.current = frameIndex;
            } else {
              lastFrameRef.current += Math.sign(
                frameIndex - lastFrameRef.current
              );
            }

            setCurrentFrame(Math.min(lastFrameRef.current, TOTAL_FRAMES));
          } else if (scrollProgress < 0) {
            setCurrentFrame(1);
          } else {
            setCurrentFrame(TOTAL_FRAMES);
          }
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isMobile]);

  const textProgress = useMemo(() => {
    if (currentFrame <= TEXT_APPEAR_FRAME) return 0;
    if (currentFrame >= TEXT_END_FRAME) return 1;
    return (
      (currentFrame - TEXT_APPEAR_FRAME) / (TEXT_END_FRAME - TEXT_APPEAR_FRAME)
    );
  }, [currentFrame]);

  const currentImageSrc = useMemo(
    () =>
      loadedFrames[currentFrame] ||
      `/animation-frames/${String(currentFrame).padStart(4, "0")}.webp`,
    [currentFrame, loadedFrames]
  );

  return (
    <>
      <div
        className={`${
          isMobile ? "left-0 right-0" : "left-[9vw] right-[9vw]"
        } flex flex-col items-center z-20 w-full sticky top-0 left-0 right-0`}
      >
        <Navbar logo={IconSvg} />
      </div>
      <div className="relative z-10 pt-[8vh] lg:pt-[5vh]">
        <Heroe />
      </div>
      <div
        ref={containerRef}
        className="relative"
        style={{ height: !isMobile ? containerHeight : "auto" }}
      >
        {isLoading && !isMobile ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div
            ref={animationRef}
            className={`${
              isMobile ? "" : "sticky top-0"
            } w-full h-screen flex items-center justify-center`}
          >
            <img
              src={isMobile ? "/0001_mobile.png" : currentImageSrc}
              alt={`Animation frame ${currentFrame}`}
              className={`w-full h-full object-contain ${isMobile ? "" : ""}`}
            />
            {!isMobile && (
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-full max-w-[50%] px-4">
                <AnimatedTextOpacity
                  text="An intuitive and easy way to get closer to your goals."
                  progress={textProgress}
                  className="text-xl 3xl:text-2xl 5xl:text-3xl font-bold text-text mb-4"
                />
                <AnimatedTextOpacity
                  text="A workspace based approach that allows you to switch quickly between different projects."
                  progress={textProgress}
                  className="text-base sm:text-lg md:text-xl text-text"
                />
              </div>
            )}
          </div>
        )}
      </div>
      {isMobile && <MobileTextContent />}
      <PricingSection />
      {children}
    </>
  );
};

export default ScrollAnimation;
