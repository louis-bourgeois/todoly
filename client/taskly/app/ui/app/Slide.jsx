export default function Slide({ children, index }) {
  return (
    <div className="h-[100vh]">
      <div key={index} className="h-[82%] mb-[clamp(1vh,2vh,3vh)]">
        <div
          key={index}
          className="shadow-2xl p-2 rounded-[66px] w-[92.5%] h-full flex flex-col items-center"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
