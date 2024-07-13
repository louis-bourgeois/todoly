import { forwardRef } from "react";

const Circle = forwardRef(function Circle(
  {
    height = "30px",
    width = "30px",
    borderColor = "black",
    className,
    onColorChange,
    isSelected,
    ...props
  },
  ref
) {
  const borderClass = `border-${borderColor}`;
  return (
    <button
      ref={ref}
      onClick={() => {
        onColorChange && onColorChange();
      }}
      style={{ width: width, height: height }}
      className={`${className} transition-all rounded-full border ${borderClass} cursor-pointer ${
        isSelected ? `bg-${borderColor}` : "bg-transparent"
      }`}
      {...props}
    />
  );
});

export default Circle;
