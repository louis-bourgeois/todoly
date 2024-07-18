import CardTransition from "./CardTransition";

const Card = ({ children, cardType, el }) => {
  const getCardHeight = () => {
    switch (cardType) {
      case "default":
        return "2xs:h-[62.5vh] xs:h-[65vh]";
      case "Add":
        return el === "Task"
          ? "2xs:h-[62.5vh] xs:h-[65vh]"
          : el === "Workspace"
          ? "2xs:h-[62.5vh] xs:h-[65vh]"
          : "2xs:h-[62.5vh] xs:h-[65vh]";
      default:
        return "2xs:h-[70vh] xs:h-[75vh]";
    }
  };

  return (
    <div
      className={`transition-all duration-500 ease-[cubic-bezier(1,0,0,1)] relative w-[calc(100vw-35px)] my-5`}
    >
      <div
        className="absolute inset-0 rounded-[20px] shadow-shadow_card"
        style={{ transform: "translate(0, 0)" }}
      ></div>
      <CardTransition
        cardType={cardType}
        className={`relative ${getCardHeight()} rounded-[20px] bg-white overflow-hidden flex flex-col`}
      >
        {children}
      </CardTransition>
    </div>
  );
};

export default Card;
