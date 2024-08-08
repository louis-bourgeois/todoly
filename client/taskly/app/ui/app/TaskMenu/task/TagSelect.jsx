"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useError } from "../../../../../context/ErrorContext";
import { useTag } from "../../../../../context/TagContext";
import { useTask } from "../../../../../context/TaskContext";
import TaskMenuSectionContainer from "../TaskMenuSectionContainer";

export default function TagSelect({
  id,
  setTask,
  taskTags,
  setTaskTags,
  task,
}) {
  const { modifyTask } = useTask();
  const { addTag, updateTag, tags, deleteTag } = useTag();
  const { handleError } = useError();
  const newTagInputRef = useRef(null);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const swiperRef = useRef(null);
  const [hoveredTag, setHoveredTag] = useState(null);

  const handleTagsChange = useCallback(
    async (newTags) => {
      if (id && newTags && task) {
        const updatedTask = { ...task, tags: newTags };
        setTask(updatedTask);
        await modifyTask(updatedTask);
      }
    },
    [id, task, setTask, modifyTask]
  );

  useEffect(() => {
    if (taskTags && task && taskTags !== task.tags) {
      handleTagsChange(taskTags);
    }
  }, [taskTags, task, handleTagsChange]);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.update();
    }
  }, [tags]);

  const handleAddTag = useCallback(
    (name = "", id = undefined) => {
      if (
        taskTags.some((tag) => tag.name.toLowerCase() === name.toLowerCase())
      ) {
        handleError({
          response: {
            data: {
              title: "Duplicate tag",
              subtitle: "This tag already exists.",
            },
          },
        });
        return;
      }
      const newTaskTags = [...taskTags, { name, id }];
      setTaskTags(newTaskTags);
      setIsAddingTag(true);
      setTimeout(() => {
        if (newTagInputRef.current) {
          newTagInputRef.current.focus();
        }
      }, 0);
    },
    [taskTags, handleError, setTaskTags]
  );

  const handleNewTagChange = useCallback(
    (index, value) => {
      const newTaskTags = taskTags.map((t, i) =>
        i === index ? { ...t, name: value } : t
      );
      setTaskTags(newTaskTags);
    },
    [taskTags, setTaskTags]
  );

  const handleDeleteTag = useCallback(
    (index) => {
      const newTaskTags = taskTags.filter((_, i) => i !== index);
      setTaskTags(newTaskTags);
    },
    [taskTags, setTaskTags]
  );

  const handlePermanentDeleteTag = useCallback(
    async (id, e) => {
      e.stopPropagation();
      const newTaskTags = taskTags.filter((tag) => tag.id !== id);
      setTaskTags(newTaskTags);
      await deleteTag(id);
    },
    [taskTags, setTaskTags, deleteTag]
  );

  const handleNewTagBlur = useCallback(
    async (index) => {
      const tag = taskTags[index];
      const newName = tag.name.trim();

      if (newName === "") {
        handleDeleteTag(index);
        return;
      }
      if (
        taskTags.some(
          (t, i) =>
            i !== index && t.name.toLowerCase() === newName.toLowerCase()
        )
      ) {
        handleError({
          response: {
            data: {
              title: "Duplicate tag",
              subtitle: "This tag already exists.",
            },
          },
        });
        handleDeleteTag(index);
        return;
      }

      try {
        if (tag.id === undefined) {
          const response = await addTag(newName);
          const addedTag = response.find((resTag) => resTag.name === newName);
          const newTags = taskTags.map((t, i) =>
            i === index ? { ...t, id: addedTag.id } : t
          );
          setTaskTags(newTags);
        } else {
          await updateTag(newName, tag.id);
        }
        setIsAddingTag(false);
      } catch (error) {
        console.error("Failed to add/update tag", error);
        handleError(error);
        handleDeleteTag(index);
      }
    },
    [taskTags, handleError, addTag, updateTag, handleDeleteTag, setTaskTags]
  );

  const handleTagClick = useCallback(
    (tag) => {
      if (
        !taskTags.some((t) => t.name.toLowerCase() === tag.name.toLowerCase())
      ) {
        handleAddTag(tag.name, tag.id);
      } else {
        handleError({
          response: {
            data: {
              title: "Duplicate tag",
              subtitle: "This tag already exists.",
            },
          },
        });
      }
    },
    [taskTags, handleAddTag, handleError]
  );

  return (
    <TaskMenuSectionContainer
      flexCol
      moreRoundedCorners="bl"
      othersStyles={`justify-between ${id ? "h-full" : "h-[90%]"}`}
    >
      <div className="flex justify-between items-center m-[1%]">
        <h2 className="p-[3%] font-bold text-2xl text-text">Tag(s)</h2>
        <button
          className="justify-center items-center font-bold"
          onClick={() => handleAddTag("")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="flex justify-center items-center text-dominant"
            aria-label="Add"
            fill="currentColor"
            width="60"
          >
            <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8 A8,8,0,0,1,12,20Zm4-9H13V8a1,1,0,0,0-2,0v3H8a1,1,0,0,0,0,2h3v3a1,1,0,0,0,2,0V13h3a1,1,0,0,0,0-2Z"></path>
          </svg>
        </button>
      </div>
      <div className="flex flex-col items-start overflow-y-auto">
        {Array.isArray(taskTags) &&
          taskTags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center justify-between mb-2 rounded-full addMenuElement m-2"
            >
              <input
                ref={
                  index === taskTags.length - 1 && isAddingTag
                    ? newTagInputRef
                    : null
                }
                type="text"
                value={tag.name}
                onChange={(e) => handleNewTagChange(index, e.target.value)}
                onBlur={() => handleNewTagBlur(index)}
                className="text-text border-none text-base bg-transparent focus:outline-none focus:ring-0"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer hover:text-dominant transition transition-color text-text"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                onClick={() => handleDeleteTag(index)}
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          ))}
      </div>
      <div className="w-[97%] h-[60px] ml-auto">
        <Swiper
          ref={swiperRef}
          modules={[FreeMode]}
          freeMode={true}
          slidesPerView="auto"
          spaceBetween={10}
          className="h-full overflow-visible"
          observer={true}
          observeParents={true}
        >
          {tags.map((tag) => {
            if (
              taskTags &&
              taskTags.some(
                (t) => t.name.toLowerCase() === tag.name.toLowerCase()
              )
            ) {
              return null;
            }
            return (
              <SwiperSlide key={tag.id} className="!w-auto">
                <div
                  className={`
                    relative cursor-pointer transition-all flex items-center justify-start
                    bg-primary rounded-[20px] h-10 px-4 shadow-md
                    ${hoveredTag === tag.id ? "pr-10" : ""}
                  `}
                  style={{
                    transition: "all 0.3s ease-in-out",
                    width: hoveredTag === tag.id ? "auto" : "fit-content",
                  }}
                  onMouseEnter={() => setHoveredTag(tag.id)}
                  onMouseLeave={() => setHoveredTag(null)}
                  onClick={() => handleTagClick(tag)}
                >
                  <span className="text-xs text-text font-bold whitespace-nowrap pt-[4.5%]">
                    {tag.name}
                  </span>
                  <button
                    onClick={(e) => handlePermanentDeleteTag(tag.id, e)}
                    className={`
                      absolute right-0 w-8 h-8 flex items-center justify-center
                      transition-all duration-300 ease-in-out rounded-full
                      hover:bg-opacity-10 hover:bg-red-500
                      ${
                        hoveredTag === tag.id
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-2 pointer-events-none"
                      }
                    `}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="w-4 h-4 transition-all hover:text-dominant"
                      style={{
                        transform:
                          hoveredTag === tag.id
                            ? "rotate(135deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.3s ease-in-out",
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 5v14m-7-7h14"
                      />
                    </svg>
                  </button>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </TaskMenuSectionContainer>
  );
}
