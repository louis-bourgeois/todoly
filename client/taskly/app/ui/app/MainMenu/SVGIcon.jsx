const SVGIcon = ({ children, width = 48, height = 48 }) => (
  <svg
    viewBox="0 0 24 24"
    width={width}
    height={height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="gradient-1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="hsla(0, 0%, 100%, 0)" />
        <stop offset="100%" stopColor="hsla(32, 53%, 58%, 0)" />
      </linearGradient>
    </defs>
    {children}
  </svg>
);

export default SVGIcon;
