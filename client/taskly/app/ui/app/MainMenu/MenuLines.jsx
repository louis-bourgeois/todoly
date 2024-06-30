import LinesElement from "./LinesElement";
export default function MenuLines({ children, text, href }) {
  return (
    <div className="flex items-center justify-start w-full gap-[3%]">
      <LinesElement href={href}>{children}</LinesElement>
      <LinesElement href={href}>
        <span className="transition duration-300  ease-in-out hover:text-blue">
          {text}
        </span>
      </LinesElement>
    </div>
  );
}
