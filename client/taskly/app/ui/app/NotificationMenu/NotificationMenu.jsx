import { useContext } from "react";
import { NotificationsContext } from "../../../../context/NotificationsContext";
import Div from "../Div";

export default function NotificationMenu({ data }) {
  const { deleteNotification } = useContext(NotificationsContext);

  const handleDelete = (id) => {
    document.getElementById(data.id).classList.add("fade-out");
    setTimeout(() => {
      deleteNotification(id);
    }, 800);
  };

  return (
    <Div
      id={data.id}
      notBorder
      styles={`hover:scale-105 rounded-[13px] ${
        data?.error ? "bg-[#FF8B8B]" : "bg-[#DBECFF]"
      } max-w-[25vw] max-h-[20vh] flex flex-col gap-[20px] p-5 mr-0  mb-5 z-[150] transition duration-150 ease-out transition-all`}
      data-id={data.id}
    >
      <div className="flex justify-between items-center gap-4 transition duration-150 ease-out transition-all">
        <h1 className="text-2xl font-bold transition duration-150 ease-out transition-all">
          {data?.title}
        </h1>
        <svg
          className="cursor-pointer hover:rotate-90 transition-all duration-1000ms"
          onClick={() => handleDelete(data.id)}
          width="20"
          height="20"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="10"
            y1="50"
            x2="90"
            y2="50"
            stroke="black"
            strokeWidth="10"
            strokeLinecap="round"
            transform="rotate(45 50 50)"
          />
          <line
            x1="50"
            y1="10"
            x2="50"
            y2="90"
            stroke="black"
            strokeWidth="10"
            strokeLinecap="round"
            transform="rotate(45 50 50)"
          />
        </svg>
      </div>
      <div className="flex justify-between transition duration-150 ease-out transition-all">
        <p className="transition duration-150 ease-out transition-all">
          {data?.subtitle}
        </p>
        <div className="flex justify-betweentransition duration-150 ease-out transition-all">
          <p className="transition duration-150 ease-out transition-all">
            {data?.tagName}
          </p>
        </div>
      </div>
    </Div>
  );
}
