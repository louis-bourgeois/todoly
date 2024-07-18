export default function Heroe({ subtitle, darkMode }) {
  return (
    <section id="Heroe">
      <div className="mt-[30vh]">
        <h1
          draggable="false"
          className={
            "select-none text-7xl text-center font-bold " +
            (darkMode && "text-white")
          }
        >
          Clarify{" "}
          <span className={darkMode ? " text-dominant" : " text-[#d2a5a5]"}>
            Today
          </span>
          , Simplify{" "}
          <span className={darkMode ? " text-dominant" : " text-[#d2a5a5]"}>
            Tommorow
          </span>
          .
        </h1>
        <h4
          draggable="false"
          className={
            "italic select-none text-3xl text-center mt-[2.25vh] " +
            (darkMode && "text-white")
          }
        >
          {subtitle}
        </h4>
      </div>
    </section>
  );
}
