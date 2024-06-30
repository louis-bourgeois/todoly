export default function TaskMenuSectionContainer({
  flex = true,
  children,

  
  moreRoundedCorners,
  flexCol = false,
  othersStyles = "",
}) {
  return (
    <div
      className={`addMenuElement ${flex && "flex"} ${
        flexCol ? "flex-col" : ""
      } rounded-[20px] ${
        moreRoundedCorners ? `rounded-${moreRoundedCorners}-[3.125vw]` : ""
      } ${othersStyles}`}
    >
      {children}
    </div>
  );
}
