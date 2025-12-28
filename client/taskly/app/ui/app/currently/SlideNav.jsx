import { Children, cloneElement, isValidElement } from "react";

export default function SlideNav({ children, justify = "between" }) {
  const unfocusableChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    return cloneElement(child, { tabIndex: -1 });
  });

  return (
    <div
      className={`flex justify-${justify} items-center w-full px-[3%] mt-[1%] mb-[2vh]`}
    >
      {unfocusableChildren}
    </div>
  );
}
