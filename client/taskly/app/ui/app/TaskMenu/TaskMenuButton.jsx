export default function TaskMenuButton({
  disabled = false,
  flex = true,
  children,
  width,
  height,
  moreRoundedCorners,
  flexCol = false,
  othersStyles = "",
  onClick,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`transition transition-scale ${
        !disabled && "active:scale-95"
      } addMenuElement p-[10px] ${flex && "flex"} ${
        flexCol ? "flex-col" : ""
      } ${width ? `w-[${width}]` : ""} ${
        height ? `h-[${height}]` : ""
      } rounded-[20px] ${
        moreRoundedCorners ? `rounded-${moreRoundedCorners}-[3.125vw]` : ""
      } ${othersStyles}`}
    >
      {children}
    </button>
  );
}
