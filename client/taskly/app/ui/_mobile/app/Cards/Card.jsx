import React, { useMemo } from "react";
import CardTransition from "./CardTransition";

const CARD_HEIGHTS = {
  default: "2xs:h-[72.5vh]",
  Add: {
    Task: "2xs:h-[65vh]",
    Workspace: "2xs:h-[40vh]",
    Note: "2xs:h-[65vh]",
  },
  Task: "2xs:h-[62.5vh]",
  Workspace: "2xs:h-[50vh]",
  Search: "2xs:h-[62.5vh]",
  other: "2xs:h-[72.5vh]",
};

const Card = ({ children, cardType, el, isTransitioning }) => {
  const cardHeight = useMemo(() => {
    if (cardType === "Add" && el) {
      return CARD_HEIGHTS.Add[el] || CARD_HEIGHTS.other;
    }
    return CARD_HEIGHTS[cardType] || CARD_HEIGHTS.other;
  }, [cardType, el]);

  return (
    <div
      className={`transition-all  bg-primary  duration-500 ease-[cubic-bezier(1,0,0,1)] relative w-[calc(100vw-35px)] my-5 border rounded-[20px] shadow-shadow_card`}
      role="region"
      aria-label={`${cardType} card`}
    >
      <CardTransition
        isTransitioning={isTransitioning}
        cardType={cardType}
        className={`relative ${cardHeight} rounded-[20px] overflow-hidden flex flex-col transition-[height] duration-300 ease-in-out`}
      >
        {children}
      </CardTransition>
    </div>
  );
};

export default React.memo(Card);
