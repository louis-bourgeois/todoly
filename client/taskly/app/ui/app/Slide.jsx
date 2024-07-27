export default function Slide({ children, index }) {
  return (
    <div className="5xl:h-[100vh] 4xl:h-[95vh] h-[90vh]">
      <div key={index} className="h-[82.5%]">
        <div
          key={index}
          className="shadow-2xl rounded-[32px] w-[95%] h-full flex flex-col items-center"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
