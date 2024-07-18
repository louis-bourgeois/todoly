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

    return (
      <input
        ref={ref}
        id={id}
        value={value}
        name={name}
        type={isPassword ? (visible ? "text" : "password") : type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`
        ${flexShrinkGrow ? "flex-grow flex-shrink" : ""}
        ${disabled ? "cursor-not-allowed opacity-50" : ""}
        ${
          isPassword
            ? "w-full focus:border-none border-none focus:outline-none"
            : "border border-grey rounded-2xl px-3 py-2"
        }
        ${autoDimensions ? "min-w-[300px] min-h-[60px]" : ""}
        ${additionalStyles}
        appearance-none
        bg-white
        text-gray-700
        focus:outline-none focus:ring-2 focus:ring-dominant-500
        transition-all duration-200 ease-in-out
        text-base
        w-full
      `}
        required={required}
        onChange={handleChange}
        disabled={disabled}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
