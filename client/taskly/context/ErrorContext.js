"use client";
import Link from "next/link";
import { createContext, useContext, useEffect } from "react";
import { NotificationsContext } from "./NotificationsContext";

const ErrorContext = createContext();

// Updated error messages
const errorMessages = {
  "already exist": {
    title: "Account Already Exists",
    subtitle: "We already have an account associated with this information.",
    action: {
      text: "Log in instead",
      href: "/auth/login",
    },
  },
  "Incorrect Password": {
    title: "Oops",
    subtitle: "The provided credentials are incorrect. Please try again.",
  },
  "Title already used": {
    title: "Title already used",
    subtitle: "Please use a unique title",
  },
  "username already taken": {
    title: "Username Unavailable",
    subtitle: "This username is already in use. Please choose a different one.",
  },
  "Still dependencies in it": {
    title: "Failed to delete this instance",
    subtitle:
      "You cannot delete this element because there are still elements that depends on it (like tasks or sections)",
  },
  INTERNAL_SERVER_ERROR: {
    title: "Server Error",
    subtitle: "We're experiencing some technical difficulties.",
    action: {
      text: "Report this issue",
      href: "/support/report",
    },
  },
  "User not found": {
    title: "User Not Found",
    subtitle: "We don't have any record of this account.",
    action: {
      text: "Join the adventure",
      href: "/auth/signup",
    },
  },
  UNAUTHORIZED_SIGNUP: {
    title: "Registration Error",
    subtitle:
      "We couldn't complete your registration. Please try again or contact support.",
  },
  "Missing credentials": {
    title: "Missing Information",
    subtitle: "Please provide all required credentials to proceed.",
  },
  "Authentication failed": {
    title: "Authentication Failed",
    subtitle:
      "We couldn't authenticate you. Please check your credentials and try again.",
  },
  DEFAULT: {
    title: "Unexpected Error",
    subtitle:
      "Something went wrong. Please try again or contact our support team if the issue persists.",
  },
};

export const ErrorProvider = ({ children }) => {
  const { addNotification, notificationsList } =
    useContext(NotificationsContext);

  useEffect(() => {
    // Logic to handle changes in notificationsList if necessary
  }, [notificationsList]);

  const handleError = (error) => {
    console.error(error); // Log the error for debugging

    let errorInfo;

    if (error.response) {
      const { status, data } = error.response;
      let errorType;

      if (typeof data === "string") {
        console.log(data);
        if (data.includes("still") && data.includes("in it")) {
          console.log("still tasks in it ahhhh");
          errorType = "Still dependencies in it";
        } else {
          errorType = data;
        }
      } else if (data && (data.reason || data.message)) {
        errorType = data.reason || data.message;
      } else {
        errorType = `ERROR_${status}`;
      }

      errorInfo = errorMessages[errorType] || errorMessages[`ERROR_${status}`];

      if (!errorInfo) {
        errorInfo = {
          title: `Error ${status}`,
          subtitle:
            typeof data === "string" ? data : "An unexpected error occurred.",
          action: {
            text: "Please report this unexpected error",
            href: "/support/report",
          },
        };
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorInfo = {
        title: "Network Error",
        subtitle:
          "Unable to connect to the server. Please check your internet connection.",
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      errorInfo = errorMessages.DEFAULT;
    }

    addNotification({
      title: errorInfo.title,
      subtitle: (
        <span>
          {errorInfo.subtitle}{" "}
          {errorInfo.action && (
            <Link href={errorInfo.action.href} passHref>
              <span className="text-blue-500 hover:underline cursor-pointer">
                {errorInfo.action.text}
              </span>
            </Link>
          )}
        </span>
      ),
      error: true,
      tag: "Error",
      tagColor: "#F00",
    });
  };

  return (
    <ErrorContext.Provider value={{ handleError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  return useContext(ErrorContext);
};
