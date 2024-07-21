"use client";

import DateHeader from "@/ui/app/currently/DateHeader";
import SectionContainer from "@/ui/app/currently/SectionContainer";
import SlideNav from "@/ui/app/currently/SlideNav";
import SlickCarousel from "@/ui/app/SlickCarousel";
import Slide from "@/ui/app/Slide";
import { useCallback, useEffect, useState } from "react";
import { useMenu } from "../../../context/MenuContext";
import { useScreen } from "../../../context/ScreenContext";

const SLIDE_NUMBER = 14;

export default function Page() {
  const { isMobile } = useScreen();
  const { setCardType } = useMenu();
  const [dates, setDates] = useState([]);

  useEffect(() => {
    setCardType("Currently");
  }, [setCardType]);

  const handleDateChange = useCallback((index, date) => {
    setDates((prevDates) => {
      const newDates = [...prevDates];
      newDates[index] = date;
      return newDates;
    });
  }, []);

  if (isMobile) {
    return null; // The mobile view is now handled in layout.jsx
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    centerMode: true,
    centerPadding: "40px",
    slidesToScroll: 0.5,
    arrows: false,
    draggable: true,
    height: "100vh",
  };

  return (
    <main className="h-[100vh]" role="main" aria-label="Currently view">
      <SlickCarousel settings={settings} slideNb={SLIDE_NUMBER}>
        {[...Array(SLIDE_NUMBER)].map((_, index) => (
          <Slide index={index} key={index}>
            <SlideNav>
              <DateHeader
                index={index}
                onDateChange={(date) => handleDateChange(index, date)}
              />
            </SlideNav>
            <SectionContainer date={dates[index]} />
          </Slide>
        ))}
      </SlickCarousel>
    </main>
  );
}
