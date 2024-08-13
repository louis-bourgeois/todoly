import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useId, useState } from "react";
import Input from "ui/Input";

export default function PasswordInputContainer({
  name,
  placeholder,
  autoDimensions,
  newUser,
  additionalStyles,
  value,
  onChange,
}) {
  const id = useId();
  const [visibilityState, setVisibilityState] = useState(false);
  const toggleVisibility = useCallback(
    (e) => {
      e.preventDefault();
      setVisibilityState((prev) => !prev);
    },
    [setVisibilityState]
  );

  return (
    <div
      className={`relative w-full border border-secondary rounded-2xl ${
        autoDimensions ? "min-w-[300px]" : ""
      }`}
    >
      <Input
        type={"password"}
        id={`${id}-password`}
        name={name}
        visible={visibilityState}
        autoComplete={newUser ? "new-password" : "current-password"}
        placeholder={placeholder}
        autoDimensions={autoDimensions}
        required={true}
        additionalStyles={`bg-transparent border-none rounded-2xl pr-12 ${additionalStyles}`}
        aria-describedby={`${id}-toggle`}
        value={value}
        onChange={onChange}
      />
      <button
        id={`${id}-toggle`}
        onClick={toggleVisibility}
        type="button"
        tabIndex="-1"
        aria-label={visibilityState ? "Hide password" : "Show password"}
        aria-pressed={visibilityState}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-primary rounded-lg focus:outline-none scale-75 lg:scale-100"
      >
        <FontAwesomeIcon
          className="text-secondary text-lg"
          aria-hidden="true"
          icon={visibilityState ? faEye : faEyeSlash}
        />
      </button>
    </div>
  );
}
