"use client";
import Link from "next/link";
import { createContext, useContext, useEffect } from "react";
import { NotificationsContext } from "./NotificationsContext";

const ErrorContext = createContext();

// Comprehensive error messages
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
    title: "Incorrect Password",
    subtitle: "The provided credentials are incorrect. Please try again.",
  },
  "Title already used": {
    title: "Title Already Used",
    subtitle: "Please use a unique title.",
  },
  "username already taken": {
    title: "Username Unavailable",
    subtitle: "This username is already in use. Please choose a different one.",
  },
  "Still dependencies in it": {
    title: "Unable to Delete",
    subtitle:
      "This item cannot be deleted because other elements depend on it (e.g., tasks or sections).",
  },
  "User not found": {
    title: "User Not Found",
    subtitle: "We couldn't find an account associated with these credentials.",
    action: {
      text: "Create an account",
      href: "/auth/signup",
    },
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
  INTERNAL_SERVER_ERROR: {
    title: "Server Error",
    subtitle: "We're experiencing some technical difficulties.",
    action: {
      text: "Report this issue",
      href: "/support/report",
    },
  },
  UNAUTHORIZED_SIGNUP: {
    title: "Registration Error",
    subtitle:
      "We couldn't complete your registration. Please try again or contact support.",
  },
  DEFAULT: {
    title: "Unexpected Error",
    subtitle:
      "Something went wrong. Please try again or contact our support team if the issue persists.",
    action: {
      text: "Contact Support",
      href: "/support/report",
    },
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

    if (error.isAxiosError) {
      const { response } = error;

      if (response) {
        const { status, data } = response;
        let errorType;

        if (status === 404 && data && data.err === "User not found") {
          errorType = "User not found";
        } else if (typeof data === "string") {
          errorType = data;
        } else if (data && (data.err || data.reason || data.message)) {
          errorType = data.err || data.reason || data.message;
        } else {
          errorType = `ERROR_${status}`;
        }

        errorInfo =
          errorMessages[errorType] || errorMessages[`ERROR_${status}`];

        if (!errorInfo) {
          const errorMessage =
            typeof data === "string" ? data : "An unexpected error occurred.";
          errorInfo = {
            title: `Error ${status}: ${errorMessage.slice(0, 50)}${
              errorMessage.length > 50 ? "..." : ""
            }`,
            subtitle:
              "An unexpected error occurred. If this persists, please contact our support team.",
            action: {
              text: "Contact Support",
              href: "/support/report",
            },
          };
        }
      } else {
        // Network error or request cancelled
        errorInfo = {
          title: "Network Error",
          subtitle:
            "Unable to connect to the server. Please check your internet connection.",
        };
      }
    } else {
      // Non-Axios error
      errorInfo = {
        title: `Unexpected Error: ${error.message.slice(0, 50)}${
          error.message.length > 50 ? "..." : ""
        }`,
        subtitle:
          "An unexpected error occurred. If this problem persists, please contact our support team.",
        action: {
          text: "Contact Support",
          href: "/support/report",
        },
      };
    }

    // Use DEFAULT if no specific error info is found
    if (!errorInfo) {
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
