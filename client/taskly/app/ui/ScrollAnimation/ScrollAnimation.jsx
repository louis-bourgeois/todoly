"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Heroe from "../landing_page/Heroe";

const Navbar = dynamic(() => import("../landing_page/Navbar"), {
  loading: () => (
    <div
      className="h-16 bg-gray-100 animate-pulse"
      aria-label="Loading navigation"
    ></div>
  ),
});

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

const TOTAL_FRAMES = 180;
const BUFFER_SIZE = 45;
const THROTTLE_DELAY = 16; // ~60fps
const FRAME_SKIP_THRESHOLD = 5; // Skip frames if the difference is more than 5
const TEXT_APPEAR_FRAME = 150;

const ScrollAnimation = ({ children }) => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [loadedFrames, setLoadedFrames] = useState({});
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

  const preloadFrames = useCallback(
    (start, end) => {
      for (
        let i = Math.max(1, Math.floor(start));
        i <= Math.min(Math.ceil(end), TOTAL_FRAMES);
        i++
      ) {
        preloadImage(i);
      }
    },
    [preloadImage]
  );

  const handleScroll = useCallback(() => {
    const now = performance.now();
    if (now - lastExecutionRef.current < THROTTLE_DELAY) return;
    lastExecutionRef.current = now;

    if (containerRef.current && animationRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const animationRect = animationRef.current.getBoundingClientRect();

      const startPoint = containerRect.top + window.scrollY;
      const endPoint = startPoint + containerRect.height - animationRect.height;

      if (window.scrollY >= startPoint && window.scrollY < endPoint) {
        const progress =
          (window.scrollY - startPoint) / (endPoint - startPoint);
        const frameIndex = Math.floor(progress * (TOTAL_FRAMES - 1)) + 1;

        const frameDiff = Math.abs(frameIndex - lastFrameRef.current);
        if (frameDiff > FRAME_SKIP_THRESHOLD) {
          lastFrameRef.current = frameIndex;
        } else {
          lastFrameRef.current += Math.sign(frameIndex - lastFrameRef.current);
        }

        setCurrentFrame(lastFrameRef.current);
        preloadFrames(
          lastFrameRef.current - BUFFER_SIZE / 2,
          lastFrameRef.current + BUFFER_SIZE / 2
        );
      } else if (window.scrollY < startPoint) {
        setCurrentFrame(1);
      } else {
        setCurrentFrame(TOTAL_FRAMES);
      }
    }
  }, [preloadFrames]);

  useEffect(() => {
    window.addEventListener(
      "scroll",
      () => requestAnimationFrame(handleScroll),
      { passive: true }
    );
    preloadFrames(1, BUFFER_SIZE);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, preloadFrames]);

  const currentImageSrc = useMemo(
    () =>
      loadedFrames[currentFrame] ||
      `/animation-frames/${String(currentFrame).padStart(4, "0")}.webp`,
    [currentFrame, loadedFrames]
  );

  const textOpacity = useMemo(() => {
    if (currentFrame < TEXT_APPEAR_FRAME) return 0;
    return Math.min((currentFrame - TEXT_APPEAR_FRAME) / 15, 1);
  }, [currentFrame]);

  return (
    <>
      <div className="fixed left-[9vw] right-[9vw] flex flex-col items-center z-20">
        <Navbar logo={IconSvg} />
      </div>
      <div className="relative z-10 pt-[30vh]">
        <Heroe />
      </div>
      <div ref={containerRef} className="relative h-[250vh]">
        <div
          ref={animationRef}
          className="sticky top-[12.5vh] 5xl:top-[17.5vh] w-full"
        >
          <img
            src={currentImageSrc}
            alt={`Animation frame ${currentFrame}`}
            className="w-full h-full object-contain"
          />
          <div
            className="absolute right-8 top-1/2 transform -translate-y-1/2 transition-opacity duration-500 max-w-[40%]"
            style={{ opacity: textOpacity }}
          >
            <h2 className="text-2.5xl font-bold text-text mb-4 leading-tight">
              An intuitive and easy way to interact with your goals and
              projects.
            </h2>
            <p className="text-lg text-text">
              Streamline your workflow and boost productivity with our
              innovative solution.
            </p>
          </div>
        </div>
      </div>
      {children}
    </>
  );
};

export default ScrollAnimation;
