export default function TaskMenuSectionContainer({
  flex = true,
  children,
  moreRoundedCorners,
  flexCol = false,
  othersStyles = "",
  padding = "5px",
  ...props
}) {
  return (
    <div
      className={`addMenuElement ${flex && "flex"} ${
        flexCol ? "flex-col" : ""
      } rounded-[20px] gradient-border ${
        moreRoundedCorners ? `rounded-${moreRoundedCorners}-[3.125vw]` : ""
      } ${othersStyles}`}
      style={{ padding: ` 10px ${padding}` }}
      {...props}
    >
      {children}
    </div>
  );
}
