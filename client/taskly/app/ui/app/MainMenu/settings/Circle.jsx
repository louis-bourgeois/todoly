import { forwardRef } from "react";

const Circle = forwardRef(function Circle(
  {
    height = "30px",
    width = "30px",
    borderColor = "secondary",
    className,
    onColorChange,
    isSelected = false,
    ...props
  },
  ref
) {
  const borderClass =
    borderColor === "dominant" ? `gradient-border` : borderColor;

  const handleClick = () => {
    onColorChange && onColorChange();
  };

  return (
    <button
      ref={ref}
      onClick={handleClick}
      style={{ width: width, height: height }}
      className={`${className} transition-all rounded-full border ${borderClass} cursor-pointer ${
        isSelected ? `bg-dominant` : "bg-transparent"
      }`}
      {...props}
    />
  );
});

export default Circle;
