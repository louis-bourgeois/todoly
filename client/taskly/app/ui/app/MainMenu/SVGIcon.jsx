const SVGIcon = ({ children, width = 48, height = 48 }) => (
  <svg
    viewBox="0 0 24 24"
    width={width}
    height={height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
);

export default SVGIcon;
