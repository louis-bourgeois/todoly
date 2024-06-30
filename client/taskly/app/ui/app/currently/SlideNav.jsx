export default function SlideNav({ children, key, justify = "between" }) {
  return (
    <div
      className={`flex justify-${justify} items-center w-full px-[3%] mb-[5%]`}
    >
      {children}
    </div>
  );
}
