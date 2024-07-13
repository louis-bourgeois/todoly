import { useState } from "react";
import SelectionDiv from "./SelectionDiv";

export default function DropdownMenu({ title, onSelect, options }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <SelectionDiv className="relative">
      <h4>{title}</h4>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="14"
        viewBox="0 0 24 14"
        fill="none"
        className={`cursor-pointer transition-transform duration-500 ${
          menuOpen ? "rotate-180" : ""
        }`}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <path
          d="M13.6184 13.337L23.323 3.83427C23.5375 3.62592 23.7078 3.37803 23.824 3.10492C23.9402 2.83181 24 2.53887 24 2.243C24 1.94713 23.9402 1.65419 23.824 1.38108C23.7078 1.10796 23.5375 0.860081 23.323 0.651731C22.8941 0.234301 22.314 -7.36958e-08 21.7094 -1.00127e-07C21.1047 -1.26558e-07 20.5246 0.234301 20.0958 0.65173L11.9934 8.58566L3.89101 0.65173C3.46217 0.2343 2.88207 -9.23094e-07 2.2774 -9.49525e-07C1.67273 -9.75956e-07 1.09263 0.2343 0.66379 0.65173C0.45166 0.86115 0.283834 1.10951 0.169933 1.38258C0.0560321 1.65564 -0.00170335 1.94804 3.80489e-05 2.243C-0.00170337 2.53796 0.0560321 2.83035 0.169933 3.10342C0.283834 3.37648 0.45166 3.62485 0.66379 3.83427L10.3683 13.337C10.5811 13.5471 10.8342 13.7138 11.1132 13.8276C11.3921 13.9414 11.6912 14 11.9934 14C12.2955 14 12.5947 13.9414 12.8736 13.8276C13.1525 13.7138 13.4057 13.5471 13.6184 13.337Z"
          fill="black"
        />
      </svg>
      <div
        className={`bg-white flex flex-col gap-[0.3vw] p-[1vw] absolute top-full mt-[1%] left-0 right-0 shadow-lg rounded-lg transition-opacity duration-300 z-[255] ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {options.map((option) => (
          <div
            key={option}
            className="cursor-pointer hover:text-blue transition-all duration-300"
            onClick={() => {
              setMenuOpen(false);
              if (typeof onSelect === "function") {
                onSelect(option);
              }
            }}
          >
            <span className="text-black hover:text-blue transition transition-color ease">
              {option}
            </span>
          </div>
        ))}
      </div>
    </SelectionDiv>
  );
}
