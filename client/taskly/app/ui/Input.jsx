import { forwardRef, useMemo } from "react";

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
      "aria-describedby": ariaDescribedBy,
    },
    ref
  ) => {
    const isPassword = name === "password" || name === "confirm_password";
    const inputType = useMemo(() => {
      if (isPassword) return visible ? "text" : "password";
      return type;
    }, [isPassword, visible, type]);

    const handleChange = (e) => {
      onChange?.(e);
    };

    const className = useMemo(() => {
      const baseClasses = `
        bg-transparent
        font-light
        appearance-none
        text-secondary
        transition-all duration-200 ease-in-out
        w-full
        leading-tight 
        px-5
        h-14
        text-base
        focus:outline-none
      `;

      const conditionalClasses = `
        ${flexShrinkGrow ? "flex-grow flex-shrink" : ""}
        ${disabled ? "cursor-not-allowed opacity-50" : ""}
        ${!isPassword ? "border border-secondary rounded-2xl" : ""}
        ${autoDimensions ? "min-w-[300px]" : ""}
      `;

      return `${baseClasses} ${conditionalClasses} ${additionalStyles}`.trim();
    }, [
      flexShrinkGrow,
      disabled,
      isPassword,
      autoDimensions,
      additionalStyles,
    ]);

    return (
      <input
        ref={ref}
        id={id}
        value={value}
        name={name}
        type={inputType}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`${className} custom-input text-[0.8rem]`}
        required={required}
        onChange={handleChange}
        disabled={disabled}
        aria-invalid={false}
        aria-describedby={ariaDescribedBy}
        style={{ "--placeholder-size": "0.8rem" }}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
