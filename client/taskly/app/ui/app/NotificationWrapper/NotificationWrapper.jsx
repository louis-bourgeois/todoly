"use client";

import { useCallback, useContext, useEffect, useRef } from "react";
import { NotificationsContext } from "../../../../context/NotificationsContext";

export default function NotificationWrapper({ children }) {
  const { deleteNotification } = useContext(NotificationsContext);
  const parentRef = useRef(null);

  const checkIfTopExceeded = useCallback(() => {
    const parentDiv = parentRef.current;
    if (!parentDiv) return;

    const parentRect = parentDiv.getBoundingClientRect();
    let firstChild = parentDiv.firstChild;

    while (firstChild) {
      if (firstChild.nodeType === Node.ELEMENT_NODE) {
        const firstChildRect = firstChild.getBoundingClientRect();
        if (firstChildRect.top < parentRect.top) {
          const dataId = firstChild.getAttribute("data-id");
          if (dataId) {
            firstChild.classList.add("fade-out");
            setTimeout(() => {
              deleteNotification(dataId);
            }, 800);
            break;
          }
          const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
              if (
                mutation.type === "childList" &&
                mutation.addedNodes.length > 0
              ) {
                parentDiv.scrollTop = parentDiv.scrollHeight;
                checkIfTopExceeded();
              }
            }
          });
        }
      }
      firstChild = firstChild.nextSibling;
    }
  }, [deleteNotification]);

  useEffect(() => {
    const parentDiv = parentRef.current;
    if (!parentDiv) return;

    const handleResize = () => {
      checkIfTopExceeded();
    };

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          parentDiv.scrollTop = parentDiv.scrollHeight;
          checkIfTopExceeded();
        }
      }
    });

    observer.observe(parentDiv, { childList: true });

    // Écouteur de redimensionnement pour ajuster la vérification
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [checkIfTopExceeded]);

  useEffect(() => {
    // Réinitialiser les styles après la suppression de la notification
    const parentDiv = parentRef.current;
    if (!parentDiv) return;

    const mutationObserver = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
          const removedNode = mutation.removedNodes[0];
          if (removedNode && removedNode.nodeType === Node.ELEMENT_NODE) {
            removedNode.classList.remove("fade-out", "hover:scale-100");
          }
        }
      }
    });

    mutationObserver.observe(parentDiv, { childList: true });

    return () => {
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={parentRef}
      className="scroll-y-hide z-[70] fixed bottom-0 right-0 max-w-[25vw] max-h-[50vh] flex flex-col items-center p-10 pb-0 overflow-auto"
    >
      {children}
    </div>
  );
}
