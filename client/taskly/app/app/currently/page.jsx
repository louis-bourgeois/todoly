"use client";
import Card from "@/ui/_mobile/app/Cards/Card";
import MobileCardHeader from "@/ui/_mobile/app/Cards/Card_header/MobileCardHeader";
import MobileSectionContainer from "@/ui/_mobile/app/Cards/SectionContainer/MobileSectionContainer";
import NoteLayout from "@/ui/_mobile/app/MenuLayouts/Note/NoteLayout";
import TaskLayout from "@/ui/_mobile/app/MenuLayouts/Task/TaskLayout";
import WorkspaceLayout from "@/ui/_mobile/app/MenuLayouts/Workspace/WorkspaceLayout";
import DateHeader from "@/ui/app/currently/DateHeader";
import SectionContainer from "@/ui/app/currently/SectionContainer";
import SlideNav from "@/ui/app/currently/SlideNav";
import SlickCarousel from "@/ui/app/SlickCarousel";
import Slide from "@/ui/app/Slide";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { useMenu } from "../../../context/MenuContext";
import { useScreen } from "../../../context/ScreenContext";

const SLIDE_NUMBER = 14;
const ELEMENTS = ["Task", "Workspace", "Note"];

export default function Page() {
  const { isMobile } = useScreen();
  const { cardType } = useMenu();
  const [dates, setDates] = useState([]);
  const swiperRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState(
    Array(SLIDE_NUMBER).fill(true)
  );

  const handleDateChange = (index, date) => {
    setDates((prevDates) => {
      const newDates = [...prevDates];
      newDates[index] = date;
      return newDates;
    });
  };

  const renderMenu = (el) => {
    switch (el) {
      case "Task":
        return <TaskLayout />;
      case "Workspace":
        return <WorkspaceLayout />;
      case "Note":
        return <NoteLayout />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (isMobile && swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.on("slideChange", (swiper) => {
        const newVisibleCards = visibleCards.map(
          (_, index) => Math.abs(index - swiper.activeIndex) <= 1
        );
        setVisibleCards(newVisibleCards);
      });
    }
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="w-full overflow-visible">
        <Swiper
          ref={swiperRef}
          slidesPerView={1}
          centeredSlides={true}
          spaceBetween={0}
          mousewheel={false}
          className="mySwiper h-full"
        >
          {cardType === "default" ? (
            [...Array(SLIDE_NUMBER)].map((_, index) => (
              <SwiperSlide key={index}>
                <CardWrapper>
                  <Card cardType={cardType} isVisible={visibleCards[index]}>
                    <CardContent>
                      <MobileCardHeader index={index} />
                      <ScrollableContent>
                        <MobileSectionContainer date={dates[index]} />
                      </ScrollableContent>
                    </CardContent>
                  </Card>
                </CardWrapper>
              </SwiperSlide>
            ))
          ) : cardType === "Add" ? (
            ELEMENTS.map((el, index) => (
              <SwiperSlide key={index}>
                <CardWrapper>
                  <Card
                    cardType={cardType}
                    el={el}
                    isVisible={visibleCards[index]}
                  >
                    <CardContent el={el}>{renderMenu(el)}</CardContent>
                  </Card>
                </CardWrapper>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide></SwiperSlide>
          )}
        </Swiper>
      </div>
    );
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
    <main className="h-[100vh]">
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

const CardWrapper = ({ children }) => (
  <div className="flex items-center justify-center h-full">{children}</div>
);

const CardContent = ({ children, el }) => (
  <div
    className={`relative w-full h-full flex flex-col ${
      el === "Task" && "justify-between pb-[8px]"
    }`}
  >
    {children}
  </div>
);

const ScrollableContent = ({ children }) => (
  <div className="flex-1 overflow-hidden relative">
    <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white via-white to-transparent pointer-events-none z-10"></div>
    <div className="h-full overflow-y-auto">{children}</div>
  </div>
);
