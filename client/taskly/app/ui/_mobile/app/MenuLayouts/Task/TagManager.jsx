import { useCallback, useEffect, useRef, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useError } from "../../../../../../context/ErrorContext";
import { useTag } from "../../../../../../context/TagContext";
import Button from "../../Cards/assets/Button";
import CustomArrow from "./CustomSwiperArrow";
import EditableTag from "./EditableTag";

const TagManager = ({ taskTags, setTaskTags, handleTagsChange }) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [showArrows, setShowArrows] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const newTagInputRef = useRef(null);
  const swiperRef = useRef(null);
  const { handleError } = useError();
  const { tags, addTag, updateTag, deleteTag } = useTag();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const updateArrowsVisibility = useCallback(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const { isBeginning, isEnd } = swiperRef.current.swiper;
      setShowArrows(!isBeginning || !isEnd);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      updateArrowsVisibility();
    }
  }, [isMounted, tags, updateArrowsVisibility]);

  const handleAddTag = useCallback(() => {
    setIsAddingTag(true);
    setNewTagName("");
    setTimeout(() => newTagInputRef.current?.focus(), 0);
  }, []);

  const handleNewTagSubmit = useCallback(async () => {
    if (newTagName.trim() === "") {
      setIsAddingTag(false);
      return;
    }

    const existingTag = tags.find(
      (tag) => tag.name.toLowerCase() === newTagName.toLowerCase()
    );
    if (existingTag) {
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

    try {
      const updatedTags = await addTag(newTagName);
      const addedTag = updatedTags.find((tag) => tag.name === newTagName);
      if (addedTag) {
        const newTaskTags = Array.isArray(taskTags)
          ? [...taskTags, addedTag]
          : [addedTag];
        setTaskTags(newTaskTags);
        handleTagsChange(newTaskTags);
      } else {
        throw new Error("Added tag not found in response");
      }
    } catch (error) {
      console.error("Failed to add tag", error);
      handleError({
        response: {
          data: {
            title: "Failed to add tag",
            subtitle: error.message || "An unexpected error occurred",
          },
        },
      });
    } finally {
      setIsAddingTag(false);
      setNewTagName("");
    }
  }, [
    newTagName,
    tags,
    addTag,
    setTaskTags,
    handleTagsChange,
    taskTags,
    handleError,
  ]);

  const handleNewTagKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleNewTagSubmit();
      } else if (e.key === "Escape") {
        setIsAddingTag(false);
        setNewTagName("");
      }
    },
    [handleNewTagSubmit]
  );

  const handleRemoveTag = useCallback(
    (tagId) => {
      const newTaskTags = Array.isArray(taskTags)
        ? taskTags.filter((tag) => tag.id !== tagId)
        : [];
      setTaskTags(newTaskTags);
      handleTagsChange(newTaskTags);
    },
    [taskTags, setTaskTags, handleTagsChange]
  );

  const handleUpdateTag = useCallback(
    async (tagId, newName) => {
      try {
        await updateTag(newName, tagId);
        const newTaskTags = Array.isArray(taskTags)
          ? taskTags.map((tag) =>
              tag.id === tagId ? { ...tag, name: newName } : tag
            )
          : [];
        setTaskTags(newTaskTags);
        handleTagsChange(newTaskTags);
      } catch (error) {
        console.error("Failed to update tag", error);
        handleError(error);
      }
    },
    [updateTag, handleError, setTaskTags, taskTags, handleTagsChange]
  );

  const handleDeleteTag = useCallback(
    async (tagId) => {
      try {
        await deleteTag(tagId);
        const newTaskTags = Array.isArray(taskTags)
          ? taskTags.filter((tag) => tag.id !== tagId)
          : [];
        setTaskTags(newTaskTags);
        handleTagsChange(newTaskTags);
      } catch (error) {
        console.error("Failed to delete tag", error);
        handleError(error);
      }
    },
    [deleteTag, handleError, setTaskTags, taskTags, handleTagsChange]
  );

  const handleAddExistingTag = useCallback(
    (tag) => {
      const newTaskTags = Array.isArray(taskTags)
        ? taskTags.some((t) => t.id === tag.id)
          ? taskTags
          : [...taskTags, tag]
        : [tag];
      setTaskTags(newTaskTags);
      handleTagsChange(newTaskTags);
    },
    [taskTags, setTaskTags, handleTagsChange]
  );

  const handlePrev = useCallback(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
      updateArrowsVisibility();
    }
  }, [updateArrowsVisibility]);

  const handleNext = useCallback(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
      updateArrowsVisibility();
    }
  }, [updateArrowsVisibility]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-start px-4">
      <h2 className="text-lg font-bold text-text mb-2">Tag(s)</h2>
      <div className="flex flex-wrap gap-2 mb-4 w-full justify-center">
        {Array.isArray(taskTags) && taskTags.length > 0 ? (
          taskTags.map((tag) => (
            <EditableTag
              key={tag.id}
              tag={tag}
              onUpdate={handleUpdateTag}
              onRemove={handleRemoveTag}
            />
          ))
        ) : (
          <p className="text-grey text-sm w-full">There are no tags here.</p>
        )}
        {isAddingTag && (
          <input
            ref={newTagInputRef}
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onBlur={handleNewTagSubmit}
            onKeyDown={handleNewTagKeyDown}
            placeholder="New tag"
            className="text-dominant bg-primary text-xs font-semibold py-1 px-2 rounded-full focus:outline-none"
          />
        )}
      </div>
      <Button label="Add Tag" onClick={handleAddTag} />

      <div className="w-full max-w-3xl my-4">
        <h3 className="text-sm font-semibold  mb-2 text-left text-text">
          Available Tags
        </h3>
        {tags.length > 0 ? (
          <div className="relative">
            <div className="swiper-container overflow-hidden px-8">
              <Swiper
                ref={swiperRef}
                modules={[Navigation]}
                spaceBetween={10}
                slidesPerView="auto"
                navigation={{
                  prevEl: ".custom-arrow-prev",
                  nextEl: ".custom-arrow-next",
                }}
                onSwiper={() => {
                  updateArrowsVisibility();
                }}
                onSlideChange={updateArrowsVisibility}
                className="flex flex-nowrap"
              >
                {tags.map((tag) => (
                  <SwiperSlide key={tag.id} className="!w-auto">
                    <span className="inline-flex items-center bg-primary gradient-border m-1 text-dominant text-xs font-semibold py-1 px-2 rounded-full cursor-pointer whitespace-nowrap">
                      <span
                        onClick={() => handleAddExistingTag(tag)}
                        className="mr-1"
                      >
                        {tag.name}
                      </span>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        className="text-white hover:text-important"
                      >
                        ×
                      </button>
                    </span>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            {showArrows && (
              <>
                <div className="custom-arrow-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
                  <CustomArrow direction="prev" onClick={handlePrev} />
                </div>
                <div className="custom-arrow-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
                  <CustomArrow direction="next" onClick={handleNext} />
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-grey text-xs">
            No tags available. Create a new tag to get started!
          </p>
        )}
      </div>
    </div>
  );
};

export default TagManager;
