import { useEffect } from "react";
import { useTask } from "../../../context/TaskContext";

export default function Blur({
  trigger,
  show,
  fullscreen,
  bg,
  showZ,
  hideZ,
  styles,
}) {
  useEffect(() => {
    document.body.style.overflowY = "hidden";
  });
  return (
    <div
      onClick={() => {
        if (show) {
          trigger();
        }
      }}
      className={` ${styles} ${
        fullscreen ? "absolute inset-0 w-[100vw] h-[100vh]" : ""
      } transition-opacity ease-in-out backdrop-blur ${
        show ? `${bg} opacity-100` : `opacity-0 hidden`
      } z-${show ? showZ : hideZ} `}
    ></div>
  );
}
