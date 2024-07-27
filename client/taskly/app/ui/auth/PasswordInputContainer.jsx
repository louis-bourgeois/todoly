"use client";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  const toggleVisibility = (e) => {
    e.preventDefault();
    setVisibilityState(!visibilityState);
  };
  return (
    <div
      className={`w-full sp-2 border border-grey rounded-2xl pr-2 flex ${
        autoDimensions && "min-w-[300px] "
      }`}
    >
      <Input
        type={visibilityState ? "" : "password"}
        name={name}
        autoComplete={newUser ? "new-password" : "current-password"}
        placeholder={placeholder}
        autoDimensions={autoDimensions ? "true" : "false"}
        visible={visibilityState}
        required="true"
        additionalStyles={
          additionalStyles + " bg-transparent border-none rounded-2xl"
        }
      />
      <button
        onClick={(e) => {
          toggleVisibility(e);
        }}
      >
        <FontAwesomeIcon
          icon={visibilityState ? faEye : faEyeSlash}
        ></FontAwesomeIcon>
      </button>
    </div>
  );
}
