"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AnchorPoint from "ui/AnchorPoint";
import Form from "ui/Form";
import Input from "ui/Input";
import PasswordInputContainer from "ui/auth/PasswordInputContainer";
import { useUser } from "../../context/UserContext";
export default function FormMenu({
  display,
  mainTitle,
  libelle,
  inputs,
  password,
  confirmPassword,
  submitValue,
  formDataArray,
  action,
  bottomMessage,
  termsConditions = false,
  bottomMessageHREF,
  newUser,
}) {
  const router = useRouter();
  const [formData, setFormData] = useState(formDataArray);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const { login } = useUser();

  const [passwordMatch, setPasswordMatch] = useState(true);
  const errors = [
    {
      error: "already exist",
      message: "We already know about you,",
      anchor: "log in.",
      href: "/auth/login",
    },
    {
      error: "unauthorized",
      message: "Password is incorrect.",
      anchor: undefined,
      href: undefined,
    },
    {
      error: "username already taken",
      message: "This username is already taken!",
      anchor: undefined,
      href: undefined,
    },
    {
      error: "Internal Servor Error",
      message: "Server Error (500), ",
      anchor: "report here",
      href: "/support/report",
    },
    {
      error: "not found",
      message: "We don't know about you :(,",
      anchor: "please sign up.",
      href: "/auth/signup",
    },
    {
      error: "password doesn't match",
      message: "The passwords are not the same!",
      anchor: undefined,
      href: undefined,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (
      (name === "password" || name === "confirm_password") &&
      confirmPassword
    ) {
      setFormData((prev) => {
        // On utilise les valeurs les plus récentes de formData
        const isMatch =
          name === "password"
            ? value === prev.confirm_password
            : prev.password === value;
        setPasswordMatch(isMatch);
        if (!isMatch) {
          setError("password doesn't match");
        } else {
          setError("Internal Servor Error");
        }
        return prev; // On retourne prev sans le modifier
      });
    }
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    switch (action) {
      case "Sign up":
        addUser(formData);
        break;
      case "Log in":
        const res = await login(formData);
        if (res && res.status === 200) {
          router.push("/app");
        } else {
          console.log(res.status);
          switch (res.status) {
            case 404:
              setError("not found");
              break;
            case 401:
              setError("unauthorized");
              break;
            case 500:
              setError("Internal Servor Error");
              break;
          }

          return null;
        }
    }
  };
  const cleanFormData = (formData) => {
    const {
      confirm_password,
      "terms and conditions checkbox": termsConditions,
      ...cleanedFormData
    } = formData;

    return cleanedFormData;
  };
  const addUser = async (data) => {
    data = cleanFormData(formData);
    const result = await axios.post(
      "http://localhost:3001/api/users/register",
      {
        data,
      }
    );
    console.log(result);

    if (result.data === "already exist") {
      setError("already exist");
    } else if (result.data === "username already taken") {
      setError("username already taken");
    } else if (result.status === 201) {
      const res = await login(formData);
      if (res && res.status === 200) {
        router.push("/app");
      } else {
        console.log(
          "anormal error : user unauthorised from signup form ?",
          res
        );
        setError(res.statusText);
        return null;
      }
    }
  };
  return (
    <div
      className={`rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] bg-white transition-opacity ease-in-out duration-1000 ${
        display ? "opacity-100" : "opacity-0"
      } ${"absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 "} ${
        display ? "z-30" : "z-0"
      }`}
    >
      {" "}
      {/* faut adapter dans le theme tailwind le 3xl pr le border radius */}{" "}
      <div className="m-10 flex flex-col justify-center items-center gap-10 ">
        {libelle && (
          <p className="self-start font-extralight text-3xl">{libelle}</p>
        )}
        {mainTitle && (
          <h3 className="text-6xl font-bold self-start text-gradient-black-to-purple">
            {mainTitle}
          </h3>
        )}
        <Form onSubmit={handleFormSubmit} onChange={handleChange}>
          {inputs.map((input, index) => (
            <Input
              key={index}
              type={input.type}
              name={input.name}
              autoComplete={input.autoComplete}
              placeholder={input.placeholder}
              additionalStyles={input.additionalStyles}
              pattern={input.pattern}
              inputMode={input.inputMode}
              autoDimensions={!(input.width || input.height)}
              flexShrinkGrow
              required
              onChange={
                input.type === "email"
                  ? () => {
                      setError("");
                    }
                  : undefined
              }
            />
          ))}

          {password && (
            <PasswordInputContainer
              name="password"
              placeholder={`${
                action === "Log in"
                  ? "Enter your password"
                  : action === "Sign up" && "Enter a strong password"
              }`}
              setVisibilityState={setPasswordVisible}
              visibilityState={passwordVisible}
              autoDimensions
              newUser={newUser}
            />
          )}
          {confirmPassword && (
            <PasswordInputContainer
              name="confirm_password"
              placeholder="Confirm Password"
              setVisibilityState={setConfirmPasswordVisible}
              visibilityState={confirmPasswordVisible}
              autoDimensions
              newUser={true}
            />
          )}
          {error &&
            errors.map((e, index) => {
              console.log(e.error === error);
              if (e.error === error) {
                return (
                  <p
                    className="text-red-800 text-right text-xl ml-auto"
                    key={index}
                  >
                    {e.message}{" "}
                    {e.href && e.anchor && (
                      <Link href={e.href} passHref legacyBehavior>
                        <AnchorPoint styles="text-blue">{e.anchor}</AnchorPoint>
                      </Link>
                    )}
                  </p>
                );
              } else {
                return null; // Retourne null si la condition n'est pas remplie
              }
            })}

          {termsConditions && (
            <div className="mr-auto ml-2 flex gap-10 w-full mt-[2rem]">
              <Input
                type="checkbox"
                name="terms and conditions checkbox"
                id="terms and conditions checkbox"
                additionalStyles="p-2 border border-grey rounded-2xl w-5 rounded-full"
                required
              />

              <label
                htmlFor="terms and conditions checkbox"
                className="flex-grow-2 text-xl text-black italic"
              >
                I have read and accepted the{" "}
                <Link href="/legal/conditions" passHref legacyBehavior>
                  <a className="custom-color-anchor">conditions</a>
                </Link>
                and{" "}
                <Link href="/legal/terms" passHref legacyBehavior>
                  <a className="custom-color-anchor">terms of use</a>
                </Link>
                .
              </label>
            </div>
          )}
          <Input
            type="submit"
            value={submitValue}
            additionalStyles="p-2 border-black text-3xl mt-[2rem] font-black w-full cursor-pointer hover:scale-105 transition ease-in-out"
            disabled={!passwordMatch}
          />
        </Form>{" "}
        <Link href={bottomMessageHREF} passHref legacyBehavior>
          <a className="custom-color-anchor">{bottomMessage}</a>
        </Link>{" "}
      </div>
    </div>
  );
}
