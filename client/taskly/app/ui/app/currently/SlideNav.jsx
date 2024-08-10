export default function SlideNav({ children, justify = "between" }) {
  return (
    <div
      className={`flex justify-${justify} items-center w-full px-[3%] mt-[1%] mb-[2vh]`}
    >
      {children}
    </div>
  );
}
