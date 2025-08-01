"use client";
import Link from "next/link";
import { createContext, useContext, useEffect, useMemo } from "react";
import { NotificationsContext } from "./NotificationsContext";
import { useTranslation } from "@/app/i18n/client";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  
  const { addNotification, notificationsList } =
    useContext(NotificationsContext);

  const { t } = useTranslation()

 const errorMessages = useMemo(() => ({
    "already exist": {
      title: t('error.accountAlreadyExists.title'),
      subtitle: t('error.accountAlreadyExists.subtitle'),
      action: {
        text: t('error.accountAlreadyExists.action'),
        href: "/auth/login",
      },
    },
    "Incorrect Password": {
      title: t('error.incorrectPassword.title'),
      subtitle: t('error.incorrectPassword.subtitle'),
    },
    "Title already used": {
      title: t('error.titleAlreadyUsed.title'),
      subtitle: t('error.titleAlreadyUsed.subtitle'),
    },
    "Workspace name already used": {
      title: t('error.nameAlreadyTaken.title'),
      subtitle: t('error.nameAlreadyTaken.subtitle'),
    },
    "username already taken": {
      title: t('error.usernameUnavailable.title'),
      subtitle: t('error.usernameUnavailable.subtitle'),
    },
    "Still dependencies in it": {
      title: t('error.unableToDelete.title'),
      subtitle: t('error.unableToDelete.subtitle'),
    },
    "User not found": {
      title: t('error.authenticationFailed.title'),
      subtitle: t('error.userNotFound.subtitle'),
      action: {
        text: t('error.userNotFound.action'),
        href: "/auth/signup",
      },
    },
    "Missing credentials": {
      title: t('error.missingCredentials.title'),
      subtitle: t('error.missingCredentials.subtitle'),
    },
    "Authentication failed": {
      title: t('error.authenticationFailed.title'),
      subtitle: t('error.authenticationFailed.subtitle'),
    },
    "Incorrect current password": {
      title: t('error.incorrectCurrentPassword.title'),
      subtitle: t('error.incorrectCurrentPassword.subtitle'),
    },
    "You cannot delete this section because there are still tasks in it!": {
      title: t('error.sectionNotEmpty.title'),
      subtitle: t('error.sectionNotEmpty.subtitle'),
    },
    INTERNAL_SERVER_ERROR: {
      title: t('error.serverError.title'),
      subtitle: t('error.serverError.subtitle'),
      action: {
        text: t('error.serverError.action'),
        href: "/support/report",
      },
    },
    UNAUTHORIZED_SIGNUP: {
      title: t('error.registrationError.title'),
      subtitle: t('error.registrationError.subtitle'),
    },
    DEFAULT: {
      title: t('error.default.title'),
      subtitle: t('error.default.subtitle'),
      action: {
        text: t('error.default.action'),
        href: "/support/report",
      },
    },
  }), [t]);

  useEffect(() => {
    
  }, [notificationsList]);

  const handleError = (error) => {
    console.error(error); 
    let errorInfo;

    
    if (error.response && error.response.data) {
        const { status, data } = error.response;
        const errorMessageKey = data.message || data.err || (typeof data === 'string' && data) || `ERROR_${status}`;
        
        errorInfo = errorMessages[errorMessageKey] || errorMessages.DEFAULT;
        
        
        if (errorInfo === errorMessages.DEFAULT && data.message) {
            errorInfo = { ...errorInfo, subtitle: data.message };
        }

    } else { 
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