export default function SelectionDiv({ children, className }) {
  return (
    <div
      className={`border border-black h-[4.5vh] flex justify-between rounded-[10px] items-center px-5 ${className}`}
    >
      {children}
    </div>
  );
}
