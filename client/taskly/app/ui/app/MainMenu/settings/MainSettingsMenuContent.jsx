import SVGIcon from "../SVGIcon";
import SettingsLine from "./SettingsLine";

const icons = [
  <SVGIcon key="icon1">
    <path
      d="M3 6C3 3.79086 4.79086 2 7 2H17C19.2091 2 21 3.79086 21 6C21 8.20914 19.2091 10 17 10H7C4.79086 10 3 8.20914 3 6Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M3 16C3 14.8954 3.89543 14 5 14H8C9.10457 14 10 14.8954 10 16V19C10 20.1046 9.10457 21 8 21H5C3.89543 21 3 20.1046 3 19V16Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M14 17.5C14 15.567 15.567 14 17.5 14C19.433 14 21 15.567 21 17.5C21 19.433 19.433 21 17.5 21C15.567 21 14 19.433 14 17.5Z"
      stroke="currentColor"
      strokeWidth="2"
    />
  </SVGIcon>,
  <SVGIcon key="icon2">
    <path
      d="M19.54 5.08A10.61 10.61 0 0 0 11.91 2a10 10 0 0 0-.05 20 2.58 2.58 0 0 0 2.53-1.89 2.52 2.52 0 0 0-.57-2.28.5.5 0 0 1 .37-.83h1.65A6.15 6.15 0 0 0 22 11.33a8.48 8.48 0 0 0-2.46-6.25zM15.88 15h-1.65a2.49 2.49 0 0 0-1.87 4.15.49.49 0 0 1 .12.49c-.05.21-.28.34-.59.36a8 8 0 0 1-7.82-9.11A8.1 8.1 0 0 1 11.92 4H12a8.47 8.47 0 0 1 6.1 2.48 6.5 6.5 0 0 1 1.9 4.77A4.17 4.17 0 0 1 15.88 15z"
      fill="currentColor"
    />
    <circle cx="12" cy="6.5" r="1.5" />
    <path d="M15.25 7.2a1.5 1.5 0 1 0 2.05.55 1.5 1.5 0 0 0-2.05-.55z" />
    <path d="M8.75 7.2a1.5 1.5 0 1 0 .55 2.05 1.5 1.5 0 0 0-.55-2.05z" />
    <path d="M6.16 11.26a1.5 1.5 0 1 0 2.08.4 1.49 1.49 0 0 0-2.08-.4z" />
  </SVGIcon>,
  <SVGIcon key="icon3">
    <path
      d="M12.0001 5.5C14.7615 5.5 17.0001 7.73858 17.0001 10.5V12.7396C17.0001 13.2294 17.1798 13.7022 17.5052 14.0683L18.7809 15.5035C19.6408 16.4708 18.9541 18 17.6598 18H6.34031C5.04604 18 4.35933 16.4708 5.2192 15.5035L6.49486 14.0683C6.82028 13.7022 7.00004 13.2294 7.00004 12.7396L7.00006 10.5C7.00006 7.73858 9.23864 5.5 12.0001 5.5ZM12.0001 5.5V3M3 11.0001C3 7.87966 4.58803 5.13015 7 3.51562M21 11.0001C21 7.87966 19.412 5.13015 17 3.51562M11 21H13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>,
  <SVGIcon key="icon4">
    <path
      d="M20.58 19.37L17.59 11.01C17.38 10.46 16.91 10.12 16.37 10.12C15.83 10.12 15.37 10.46 15.14 11.03L12.16 19.37C12.02 19.76 12.22 20.19 12.61 20.33C13 20.47 13.43 20.27 13.57 19.88L14.19 18.15H18.54L19.16 19.88C19.27 20.19 19.56 20.38 19.87 20.38C19.95 20.38 20.04 20.37 20.12 20.34C20.51 20.2 20.71 19.77 20.57 19.38L20.58 19.37ZM14.74 16.64L16.38 12.05L18.02 16.64H14.74ZM12.19 7.85C9.92999 11.42 7.89 13.58 5.41 15.02C5.29 15.09 5.16 15.12 5.04 15.12C4.78 15.12 4.53 14.99 4.39 14.75C4.18 14.39 4.3 13.93 4.66 13.73C6.75999 12.51 8.48 10.76 10.41 7.86H4.12C3.71 7.86 3.37 7.52 3.37 7.11C3.37 6.7 3.71 6.36 4.12 6.36H7.87V4.38C7.87 3.97 8.21 3.63 8.62 3.63C9.02999 3.63 9.37 3.97 9.37 4.38V6.36H13.12C13.53 6.36 13.87 6.7 13.87 7.11C13.87 7.52 13.53 7.86 13.12 7.86H12.18L12.19 7.85ZM12.23 15.12C12.1 15.12 11.97 15.09 11.85 15.02C11.2 14.64 10.57 14.22 9.97999 13.78C9.64999 13.53 9.58 13.06 9.83 12.73C10.08 12.4 10.55 12.33 10.88 12.58C11.42 12.99 12.01 13.37 12.61 13.72C12.97 13.93 13.09 14.39 12.88 14.75C12.74 14.99 12.49 15.12 12.23 15.12Z"
      fill="currentColor"
    />
  </SVGIcon>,
  <SVGIcon key="icon5">
    <path
      d="M14 12C14 14.7614 11.7614 17 9 17H7C4.23858 17 2 14.7614 2 12C2 9.23858 4.23858 7 7 7H7.5M10 12C10 9.23858 12.2386 7 15 7H17C19.7614 7 22 9.23858 22 12C22 14.7614 19.7614 17 17 17H16.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </SVGIcon>,
  <SVGIcon key="icon6">
    <path
      d="M3 8H16.5C18.9853 8 21 10.0147 21 12.5C21 14.9853 18.9853 17 16.5 17H3M3 8L6 5M3 8L6 11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SVGIcon>,
];

export default function MainSettingsMenuContent({
  transitionStyles,
  setLayout,
  libelles,
}) {
  return (
    <div
      className={`flex flex-col justify-between w-full h-full text-text  ${transitionStyles}`}
    >
      {icons.map((icon, index) => (
        <SettingsLine
          icons={icons}
          setLayout={setLayout}
          index={index}
          key={index}
          libelles={libelles}
        >
          {icon}
        </SettingsLine>
      ))}
    </div>
  );
}
