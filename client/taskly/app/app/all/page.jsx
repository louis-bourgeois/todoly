"use client";
import SlideNav from "@/ui/app/currently/SlideNav";
import SlickCarousel from "@/ui/app/SlickCarousel";
import Slide from "@/ui/app/Slide";
import Task from "@/ui/app/Task/Task";
import { useContext } from "react";
import { MenuContext } from "../../../context/MenuContext";
import { useTask } from "../../../context/TaskContext";
import { useUser } from "../../../context/UserContext";

export default function Page() {
  const { workspaces } = useUser();
  const { activeTask, setActiveTask } = useTask();
  const { toggleTaskMenu } = useContext(MenuContext);
  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    centerMode: true,
    centerPadding: "150px",
    slidesToScroll: 0.5,
    arrows: false,
    draggable: true,
  };
  const handleAddWorkspace = () => {};
  const expandTask = (taskId) => {
    if (taskId !== activeTask) {
      setActiveTask(taskId);
    }
    toggleTaskMenu();
  };
  return (
    <>
      <SlickCarousel settings={settings}>
        {workspaces
          .sort((a, b) => b.tasks.length - a.tasks.length)
          .map((workspace, index) => (
            <Slide index={index} key={index}>
              <SlideNav key={index} justify="center">
                <h2 className="text-5xl font-extrabold">{workspace.name}</h2>
              </SlideNav>
              <div className="w-full overflow-y-auto scroll-hide grid grid-cols-4 gap-[2%] pb-[10%] pl-[5%]">
                {workspace.tasks.map((task) => (
                  <Task
                    task={task}
                    key={task.id}
                    onTaskClick={() => expandTask(task.id)}
                  />
                ))}
              </div>
            </Slide>
          ))}
        <Slide index={workspaces.length} key="add-workspace">
          <div>
            <button onClick={handleAddWorkspace}>Add Workspace</button>
          </div>
        </Slide>
      </SlickCarousel>
    </>
  );
}
// design de la page all
