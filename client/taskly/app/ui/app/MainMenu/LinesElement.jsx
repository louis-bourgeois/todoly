import Link from "next/link";
export default function LinesElement({ href, children }) {
  return (
    <Link
      href={href}
      className="m-[5%]"
    >
      {children}
    </Link>
  );
}
