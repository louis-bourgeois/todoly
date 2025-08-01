export default function SectionTitle({ children, className }) {
  return (
    <h2 className={"text-xl font-bold select-none text-text " + className}>{children}</h2>
  );
}
