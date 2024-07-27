"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Slider from "react-slick";
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
  const { addTag, updateTag, tags } = useTag();
  const { handleError } = useError();
  const newTagInputRef = useRef(null);
  const [isAddingTag, setIsAddingTag] = useState(false);

  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
  };

  const handleTagsChange = useCallback(
    async (newTags) => {
      if (id && newTags && task) {
        console.log(task);
        const updatedTask = { ...task, tags: JSON.stringify(newTags) };
        setTask(updatedTask);
        await modifyTask(updatedTask, "post");
      }
    },
    [id, task, setTask, modifyTask]
  );

  useEffect(() => {
    if (taskTags) {
      handleTagsChange(taskTags);
    }
  }, [taskTags]);

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
      setTaskTags((prev) => [...prev, { name, id }]);
      setIsAddingTag(true);
      setTimeout(() => {
        if (newTagInputRef.current) {
          newTagInputRef.current.focus();
        }
      }, 0);
    },
    [taskTags, handleError]
  );

  const handleNewTagChange = useCallback((index, value) => {
    setTaskTags((prev) =>
      prev.map((tag, i) => (i === index ? { ...tag, name: value } : tag))
    );
  }, []);

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
          setTaskTags((prev) =>
            prev.map((t, i) => (i === index ? { ...t, id: addedTag.id } : t))
          );
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
    [taskTags, handleError, addTag, updateTag]
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
  useEffect(() => {
    console.log(taskTags);
  }, [taskTags, tags]);
  const handleDeleteTag = useCallback((index) => {
    setTaskTags((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <TaskMenuSectionContainer
      flexCol
      moreRoundedCorners="bl"
      othersStyles={`justify-between ${id ? "h-[98%]" : "h-[77.5%]"}`}
    >
      <div className="flex justify-between items-center m-[1%]">
        <h2 className="p-[3%] font-bold text-2xl">Tag(s)</h2>
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
                className="border-none text-base bg-transparent focus:outline-none focus:ring-0"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer hover:text-dominant transition transition-color"
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
      <div className="flex flex-col w-[97%] ml-auto">
        <Slider {...settings}>
          {tags.map((tag, index) => {
            // Initialiser existingNamesInTaskTags en dehors de map pour éviter la réinitialisation
            let existingNamesInTaskTags = taskTags.map((t) => t.name);

            // Vérifier si tag.name existe dans existingNamesInTaskTags
            if (existingNamesInTaskTags.includes(tag.name)) {
              return null; // Utilisez 'null' pour ne rien rendre dans map
            }

            return (
              <div key={index} className="">
                <button
                  key={index}
                  onClick={() => handleTagClick(tag)}
                  className="cursor-pointer hover:scale-105 transition-transform transition transition-all flex h-[50%] items-center justify-center bg-white rounded-[20px] my-2 p-2"
                  style={{
                    boxShadow: "0px 4px 4px 0px rgba(0, 122, 255, 0.25)",
                  }}
                >
                  <p className="text-xs font-bold">{tag.name}</p>
                </button>
              </div>
            );
          })}
        </Slider>
      </div>
    </TaskMenuSectionContainer>
  );
}
