export default function Slide({ children, index }) {
  return (
    <div className="5xl:h-[97.5vh] 4xl:h-[92.5vh] h-[90vh]">
      <div key={index} className="h-[82.5%]">
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
