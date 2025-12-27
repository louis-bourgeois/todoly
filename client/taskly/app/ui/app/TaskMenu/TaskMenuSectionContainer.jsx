export default function TaskMenuSectionContainer({
  flex = true,
  children,
  moreRoundedCorners,
  flexCol = false,
  othersStyles = "",
  padding = "5px",
  allowOverflow = false,
  disableStacking = false,
  ...props
}) {
  const inlineStyle = {
    padding: ` 10px ${padding}`,
    ...(disableStacking ? { zIndex: "auto" } : {}),
  };

  return (
    <div
      className={`addMenuElement ${flex && "flex"} ${
        flexCol ? "flex-col" : ""
      } rounded-[20px] gradient-border ${
        moreRoundedCorners ? `rounded-${moreRoundedCorners}-[3.125vw]` : ""
      } ${allowOverflow ? "overflow-visible" : ""} ${othersStyles}`}
      style={inlineStyle}
      {...props}
    >
      {children}
    </div>
  );
}
