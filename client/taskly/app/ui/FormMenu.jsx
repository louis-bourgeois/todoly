"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Form from "ui/Form";
import Input from "ui/Input";
import PasswordInputContainer from "ui/auth/PasswordInputContainer";
import { useAuth } from "../../context/AuthContext";
import { useError } from "../../context/ErrorContext";
import CTA from "./landing_page/CTA";

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
  const { login } = useAuth();
  const { handleError } = useError();
  const [isChecked, setIsChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const re =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{13,}$/;
    return re.test(password);
  };

  const validateAge = (age) => {
    return parseInt(age) >= 12;
  };

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (action === "Sign up") {
      if (formData.password && !validatePassword(formData.password)) {
        newErrors.password =
          "Password must be at least 13 characters long and include special characters and numbers.";
      }

      if (
        formData.confirm_password &&
        formData.password !== formData.confirm_password
      ) {
        newErrors.confirm_password = "The passwords do not match.";
      }

      if (formData.age && !validateAge(formData.age)) {
        newErrors.age = "You must be at least 12 years old to register.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, action]);

  useEffect(() => {
    validateForm();
  }, [formData, validateForm]);

  const addUser = useCallback(
    async (data) => {
      const {
        confirm_password,
        "terms and conditions checkbox": termsConditions,
        ...cleanedFormData
      } = data;
      try {
        const result = await axios.post(
          "/api/users/register",
          { data: cleanedFormData },
          { withCredentials: true }
        );
        if (result.status === 201) {
          const res = await login(formData);
          if (res && res.status === 200) {
            router.push("/app");
          } else {
            handleError({
              response: { data: { errorType: "UNAUTHORIZED_SIGNUP" } },
            });
          }
        }
      } catch (err) {
        handleError(err);
      }
    },
    [formData, login, router, handleError]
  );

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (validateForm()) {
        if (action === "Sign up") {
          addUser(formData);
          setDisabled(true);
        } else if (action === "Log in") {
          try {
            const res = await login(formData);
            if (res && res.status === 200) {
              router.push("/app/currently");
            }
          } catch (error) {
            handleError(error);
          }
        }
      }
    },
    [addUser, action, formData, login, router, handleError, validateForm]
  );

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  return (
    <div
      className={`rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] bg-primary border-white transition-opacity ease-in-out duration-1000 ${
        display ? "opacity-100" : "opacity-0"
      } absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
        display ? "z-30" : "z-0"
      }`}
    >
      <style jsx>{`
        .custom-checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid #959595;
          border-radius: 50%;
          display: inline-block;
          position: relative;
          cursor: pointer;
        }
        .custom-checkbox::after {
          content: "";
          position: absolute;
          width: 12px;
          height: 12px;
          background-color: #007aff;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          transition: transform 0.2s ease-in-out;
        }
        input:checked + .custom-checkbox::after {
          transform: translate(-50%, -50%) scale(1);
        }
      `}</style>
      <div className="m-6 flex flex-col justify-center items-center gap-6">
        {libelle && (
          <p className="self-start font-extralight text-1.5xl text-text">
            {libelle}
          </p>
        )}
        {mainTitle && (
          <h3 className="text-3xl font-bold self-start text-dominant mb-2">
            {mainTitle}
          </h3>
        )}
        <Form
          onSubmit={handleFormSubmit}
          onChange={handleChange}
          className="space-y-4 w-full"
        >
          {inputs.map((input, index) => (
            <div key={index} className="w-full">
              <Input {...input} additionalStyles="font-light w-full" />
              {errors[input.name] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[input.name]}
                </p>
              )}
            </div>
          ))}
          {password && (
            <div className="w-full">
              <PasswordInputContainer
                name="password"
                placeholder={`${
                  action === "Log in"
                    ? "Enter your password"
                    : "Enter a strong password"
                }`}
                autoDimensions
                newUser={newUser}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          )}
          {confirmPassword && (
            <div className="w-full">
              <PasswordInputContainer
                name="confirm_password"
                placeholder="Confirm Password"
                autoDimensions
                newUser={true}
                value={formData.confirm_password}
                onChange={handleChange}
              />
              {errors.confirm_password && (
                <p className="text-important text-sm mt-1">
                  {errors.confirm_password}
                </p>
              )}
            </div>
          )}
          {termsConditions && (
            <div className="flex items-center gap-4 w-full mt-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="terms and conditions checkbox"
                  className="sr-only"
                  required={true}
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <span className="custom-checkbox"></span>
              </label>
              <label
                htmlFor="terms and conditions checkbox"
                className="flex-grow text-sm text-text italic cursor-pointer"
              >
                I have read and accepted the{" "}
                <Link href="/legal/conditions" passHref legacyBehavior>
                  <a className="custom-color-anchor">conditions</a>
                </Link>{" "}
                and{" "}
                <Link href="/legal/terms" passHref legacyBehavior>
                  <a className="custom-color-anchor">terms of use</a>
                </Link>
                .
              </label>
            </div>
          )}
          <CTA
            type="secondary"
            title={submitValue}
            disabled={disabled || Object.keys(errors).length > 0}
            className="w-4/5 h-12 mt-4 text-xl"
          />
        </Form>
        <Link href={bottomMessageHREF} passHref legacyBehavior>
          <span className="text-dominant text-sm mt-2 cursor-pointer">
            {bottomMessage}
          </span>
        </Link>
      </div>
    </div>
  );
}
