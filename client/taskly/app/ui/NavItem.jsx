export default function NavItem({ index, additionalStyles, children, text }) {
  return (
    <li
      draggable="false"
      key={index ? index : undefined}
      className={`${
        text ? "text-3xl" : ""
      } mx-[2vw] select-none ${additionalStyles}`}
    >
      {children}
    </li>
  );
}
