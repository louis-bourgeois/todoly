import { useContext, useEffect, useState } from "react";
import { NotificationsContext } from "../../../../context/NotificationsContext";

export default function NotificationMenu({ data, isMobile }) {
  const { deleteNotification } = useContext(NotificationsContext);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let fadeOutTimer;
    if (!isVisible) {
      fadeOutTimer = setTimeout(() => {
        deleteNotification(data.id);
      }, 300); // Match this with the animation duration
    }
    return () => clearTimeout(fadeOutTimer);
  }, [isVisible, data.id, deleteNotification]);

  const handleDelete = () => {
    setIsVisible(false);
  };

  return (
    <div
      className={`
        ${data?.error ? "bg-[#FF8B8B]" : "bg-[#DBECFF]"}
        ${isMobile ? "w-full" : "w-[25vw]"}
        rounded-[13px] flex flex-col gap-2 p-3 pb-0 z-[150]
        transition-all duration-300 ease-in-out
        ${isHovered ? "scale-105" : "scale-100"}
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: isVisible ? "none" : "fadeOut 0.3s ease-out forwards",
      }}
    >
      <div className="flex justify-between items-center">
        <h1 className={`font-bold ${isMobile ? "text-lg" : "text-xl"}`}>
          {data?.title}
        </h1>
        <button
          onClick={handleDelete}
          className={`focus:outline-none transition-transform duration-300 ${
            isHovered ? "rotate-90" : "rotate-0"
          }`}
        >
          <svg
            width={isMobile ? "16" : "20"}
            height={isMobile ? "16" : "20"}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="10"
              y1="90"
              x2="90"
              y2="10"
              stroke="black"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <line
              x1="10"
              y1="10"
              x2="90"
              y2="90"
              stroke="black"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <p className={`${isMobile ? "text-sm" : "text-base"} leading-relaxed`}>
        {data?.subtitle}
      </p>
      <p className={`text-right ${isMobile ? "text-xs" : "text-sm"}`}>
        {data?.tagName}
      </p>
    </div>
  );
}
