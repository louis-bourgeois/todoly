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
  "Workspace name already used": {
    title: "Name Already Taken",
    subtitle: "You already have a workspace with this name. Please choose another.",
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
    title: "Authentication Failed",
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
  "Incorrect current password": {
    title: "Incorrect Password",
    subtitle: "The provided current password is incorrect.",
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
  "You cannot delete this section because there are still tasks in it!": {
    title: "This section is not empty",
    subtitle: "Please delete or move the tasks to another section to delete this section."
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

    // Check for Axios-like error structure first
    if (error.response && error.response.data) {
        const { status, data } = error.response;
        const errorMessageKey = data.message || data.err || (typeof data === 'string' && data) || `ERROR_${status}`;
        
        errorInfo = errorMessages[errorMessageKey] || errorMessages.DEFAULT;
        
        // Handle cases where the message is dynamic but we want a generic title
        if (errorInfo === errorMessages.DEFAULT && data.message) {
            errorInfo = { ...errorInfo, subtitle: data.message };
        }

    } else { // Handle other types of errors (e.g., network, plain JS objects)
        errorInfo = errorMessages.DEFAULT;
        if (error.message) {
            errorInfo = { ...errorInfo, subtitle: error.message };
        }
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