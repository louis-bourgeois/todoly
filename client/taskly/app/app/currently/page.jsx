"use client";
import DateHeader from "@/ui/app/currently/DateHeader";
import SectionContainer from "@/ui/app/currently/SectionContainer";
import SlideNav from "@/ui/app/currently/SlideNav";
import SlickCarousel from "@/ui/app/SlickCarousel";
import Slide from "@/ui/app/Slide";
import { useMemo, useState } from "react";
import { useWorkspace } from "../../../context/WorkspaceContext";

export default function Page() {
  const { workspaces } = useWorkspace();

  const [dates, setDates] = useState([]);
  const { currentWorkspace } = useWorkspace();

  const currentWorkspaceName = useMemo(() => {
    console.log("====================================");
    console.log(workspaces);
    console.log("====================================");
    const workspace = workspaces.find(
      (workspace) => workspace.id === currentWorkspace
    );
    return workspace ? workspace.name : "";
  }, [workspaces, currentWorkspace]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    centerMode: true,
    centerPadding: "150px",
    slidesToScroll: 0.5,
    arrows: false,
    draggable: true,
  };

  let slideNumber = 14;

  const handleDateChange = (index, date) => {
    setDates((prevDates) => {
      const newDates = [...prevDates];
      newDates[index] = date;
      return newDates;
    });
  };

  return (
    <>
      <SlickCarousel settings={settings} slideNb={slideNumber}>
        {[...Array(slideNumber).keys()].map((index) => (
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
    </>
  );
}
