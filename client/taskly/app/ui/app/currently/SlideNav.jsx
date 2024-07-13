export default function SlideNav({ children, justify = "between" }) {
  return (
    <div
      className={`flex justify-${justify} items-center w-full px-[3%] my-[1%] pt-[1.5%]`}
    >
      {children}
    </div>
  );
}
