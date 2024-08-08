export default function Slide({ children, index }) {
  return (
    <div className="h-[97.5vh]">
      <div
        key={index}
        className="5xl:h-[83.5%] 4.5xl:h-[84.5%] 4xl:h-[85.5%] 3xl:h-[86.5%] 2xl:h-[87.5%] xl:h-[88.5%] lg:h-[90%]"
      >
        <div
          key={index}
          className="shadow-shadow_card_desktop rounded-[48px] w-[95%] h-full flex flex-col items-center bg-primary mt-[2.5vh] mb-[3.5vh]"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
