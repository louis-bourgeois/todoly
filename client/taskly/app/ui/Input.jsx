export default function Input({
  name,
  type,
  autoComplete,
  placeholder,
  additionalStyles,
  autoDimensions,
  flexShrinkGrow,
  value,
  onChange,
  id,
  visible,
  required,
  disabled,
}) {
  return (
    <input
      id={id}
      value={value}
      name={name}
      type={
        type === "password" ? (visible ? "text" : "password") : type || "text"
      }
      autoComplete={autoComplete}
      placeholder={placeholder}
      className={
        `${flexShrinkGrow && "flex-grow flex-shrink"}
         disabled:cursor-not-allowed
         ${
           name === "password" || name === "confirm_password"
             ? "w-[99%] focus:border-none border-none focus:outline-none"
             : "sp-2 border border-grey rounded-2xl px-3"
         } 
         ${additionalStyles} ` +
        (autoDimensions ? "min-w-[300px] min-h-[60px]" : "")
      }
      required={required ? "required" : ""}
      onChange={onChange}
      disabled={disabled ? true : false}
    />
  );
}
