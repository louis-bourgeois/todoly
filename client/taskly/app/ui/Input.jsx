import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      name,
      type = "text",
      autoComplete,
      placeholder,
      additionalStyles = "",
      autoDimensions = false,
      flexShrinkGrow = false,
      value,
      onChange,
      id,
      visible,
      required = false,
      disabled = false,
    },
    ref
  ) => {
    const isPassword = name === "password" || name === "confirm_password";

    const handleChange = (e) => {
      if (onChange) {
        onChange(e);
      }
    };

    const inputType = isPassword ? (visible ? "text" : "password") : type;

    const baseClasses = `
      focus:outline-none
      h-full
      font-light
      appearance-none
      bg-landing_page_bg
      text-gray-700
      transition-all duration-200 ease-in-out
      w-full
      flex items-center
      leading-tight 
    `;

    const conditionalClasses = `
      ${flexShrinkGrow ? "flex-grow flex-shrink" : ""}
      ${disabled ? "cursor-not-allowed opacity-50" : ""}
      ${isPassword ? "w-full" : "border border-grey rounded-2xl"}
      ${autoDimensions ? "min-w-[300px]" : ""}
    `;

    const className =
      `${baseClasses} ${conditionalClasses} ${additionalStyles}`.trim();

    // CSS for placeholder and input text alignment
    const inputCSS = `
      .custom-input::placeholder {
        font-size: var(--placeholder-size);
        font-weight: 300;
      }
      .custom-input {  
        padding: 1rem;
        font-size: var(--placeholder-size);
        display: flex;
        align-items: center;
      }
    `;

    return (
      <>
        <style>{inputCSS}</style>
        <input
          ref={ref}
          id={id}
          value={value}
          name={name}
          type={inputType}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`${className} pb-1 custom-input`}
          required={required}
          onChange={handleChange}
          disabled={disabled}
          style={{ "--placeholder-size": "1rem" }}
        />
      </>
    );
  }
);

Input.displayName = "Input";

export default Input;
