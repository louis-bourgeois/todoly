export default function LinesElement({ href, children }) {
  return (
    <div href={href} className="m-[5%]">
      {children}
    </div>
  );
}
