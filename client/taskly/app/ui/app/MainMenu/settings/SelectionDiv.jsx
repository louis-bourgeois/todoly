export default function SelectionDiv({ children, className, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`border border-secondary h-[4.5vh] flex justify-between rounded-[10px] items-center ${className}`}
    >
      {children}
    </div>
  );
}
