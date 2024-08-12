"use client";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useId } from "react";
import Input from "ui/Input";

export default function PasswordInputContainer({
  name,
  placeholder,
  visibilityState,
  setVisibilityState,
  autoDimensions,
  newUser,
  additionalStyles,
}) {
  const id = useId();
  const toggleVisibility = useCallback(
    (e) => {
      e.preventDefault();
      setVisibilityState((prev) => !prev);
    },
    [setVisibilityState]
  );

  return (
    <div
      className={`w-full sp-2 border border-secondary rounded-2xl pr-3 flex items-center h-14 ${
        autoDimensions ? "min-w-[300px]" : ""
      }`}
    >
      <Input
        type="password"
        id={`${id}-password`}
        name={name}
        autoComplete={newUser ? "new-password" : "current-password"}
        placeholder={placeholder}
        autoDimensions={autoDimensions}
        visible={visibilityState}
        required={true}
        additionalStyles={`bg-transparent border-none rounded-2xl ${additionalStyles}`}
        aria-describedby={`${id}-toggle`}
      />
      <button
        id={`${id}-toggle`}
        onClick={toggleVisibility}
        type="button"
        aria-label={visibilityState ? "Hide password" : "Show password"}
        aria-pressed={visibilityState}
        className="p-3 h-full focus:outline-none"
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
