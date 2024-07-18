import { forwardRef } from "react";

const AutoResizeInput = forwardRef(
  ({ value, disabled, className, onChange, style, ...props }, ref) => {
    return (
      <input
        ref={ref}
        style={style}
        className={`${className} transition-all duration-200 ease-in-out`}
        disabled={disabled}
        value={value}
        onChange={onChange}
        {...props}
      />
    );
  }
  );

AutoResizeInput.displayName = "AutoResizeInput";

export default AutoResizeInput;
