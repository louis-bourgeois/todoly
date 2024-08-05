import { useEffect, useRef, useState } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { useMenu } from "../../../../context/MenuContext";
import Blur from "../Blur";
import Div from "../Div";
import TaskForm from "./task/TaskForm";
import WorkspaceForm from "./workspace/WorkspaceForm";

export default function TaskMenu({
  visibility,
  taskId = null,
  workspaceId = null,
}) {
  const { isTaskMenuOpen, toggleTaskMenu, element } = useMenu();
  const [elementType, setElementType] = useState(element || "Task");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const taskMenuRef = useRef(null);
  const [callback, setCallback] = useState("");

  const handleElementTypeChange = (newType, from = undefined) => {
    if (from) {
      setCallback(from);
    }
    setIsTransitioning(true);
    setShowContent(false);
    setTimeout(() => {
      setElementType(newType);
      setShowContent(true);
    }, 300);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  useEffect(() => {
    if (element) {
      console.log(element);
      setElementType(element);
    }
    if (workspaceId !== "") {
      setElementType("Workspace");
    }
    if (taskId) {
      console.log("====================================");
      console.log("there is taskId", taskId);
      console.log("====================================");
      setElementType("Task");
    }
  }, [taskId, workspaceId, element]);
  const resetTaskMenu = () => {
    setElementType(element);
  };
  useEffect(() => {
    if (!isTaskMenuOpen) {
      resetTaskMenu();
    }
  }, [isTaskMenuOpen, resetTaskMenu]);

  const transitionStyles = `transition-all duration-300 ease-in-out ${
    isTransitioning || !showContent ? "opacity-0" : "opacity-100"
  }`;

  return (
    <>
      <Blur
        trigger={toggleTaskMenu}
        show={isTaskMenuOpen}
        showZ="40"
        hideZ="0"
        bg="bg-transparent"
        fullscreen={true}
      />

      <Div
        _id="TaskMenuMain"
        ref={taskMenuRef}
        styles={`glass-morphism ${
          elementType === "Workspace" ? "flex flex-col" : "flex"
        } border gap-[0.5%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[80] fontMenu transition-all duration-300 rounded-[3.125vw] py-[1.5vh] px-[1.3227%] ${
          visibility
            ? "4xl:w-[1482px] h-[750px] 2xl:w-[1280px] lg:w-[1024px] md:w-[600px] sm:w-[400px] opacity-100"
            : "w-0 h-0 opacity-0 pointer-events-none"
        }`}
        notBorder
      >
        {elementType === "Task" && (
          <TaskForm
            transitionStyles={transitionStyles}
            id={taskId}
            visibility={visibility}
            handleElementTypeChange={handleElementTypeChange}
            elementType={elementType}
          />
        )}
        {elementType === "Workspace" && (
          <WorkspaceForm
            transitionStyles={transitionStyles}
            id={workspaceId}
            visibility={visibility}
            elementType={elementType}
            setElementType={setElementType}
            callback={callback}
            setCallback={setCallback}
            showContent={showContent}
            setShowContent={setShowContent}
          />
        )}
      </Div>
    </>
  );
}
