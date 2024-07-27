import React, { useMemo } from "react";
import CardTransition from "./CardTransition";

const CARD_HEIGHTS = {
  default: "2xs:h-[62.5vh] xs:h-[65vh]",
  Add: {
    Task: "2xs:h-[62.5vh] xs:h-[65vh]",
    Workspace: "2xs:h-[35vh] xs:h-[40vh]",
    Note: "2xs:h-[62.5vh] xs:h-[65vh]",
  },
  Task: "2xs:h-[60vh] xs:h-[62.5vh]",
  Workspace: "2xs:h-[45vh] xs:h-[50vh]",
  Search: "2xs:h-[60vh] xs:h-[62.5vh]",
  other: "2xs:h-[62.5vh] xs:h-[70vh]",
};

const Card = ({ children, cardType, el }) => {
  const cardHeight = useMemo(() => {
    if (cardType === "Add" && el) {
      return CARD_HEIGHTS.Add[el] || CARD_HEIGHTS.other;
    }
    return CARD_HEIGHTS[cardType] || CARD_HEIGHTS.other;
  }, [cardType, el]);

  return (
    <div
      className={`transition-all duration-500 ease-[cubic-bezier(1,0,0,1)] relative w-[calc(100vw-35px)] my-5`}
      role="region"
      aria-label={`${cardType} card`}
    >
      <div
        className={`absolute inset-0 rounded-[20px] shadow-shadow_card`}
        style={{ transform: "translate(0, 0)" }}
        aria-hidden="true"
      ></div>
      <CardTransition
        cardType={cardType}
        className={`relative ${cardHeight} rounded-[20px] bg-white overflow-hidden flex flex-col transition-[height] duration-300 ease-in-out`}
      >
        {children}
      </CardTransition>
    </div>
  );
};

export default React.memo(Card);
