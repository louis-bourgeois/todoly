export default function Slide({ children, index }) {
  return (
    <div key={index} className="pb-[4vh] h-[80vh]">
      <div
        key={index}
        className="shadow-2xl p-2 rounded-[66px] w-[92.5%] h-full flex flex-col items-center"
      >
        {children}
      </div>
    </div>
  );
}
