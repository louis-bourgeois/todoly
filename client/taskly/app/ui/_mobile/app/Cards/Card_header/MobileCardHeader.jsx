import { addDays, format } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMenu } from "../../../../../../context/MenuContext";
import { useWorkspace } from "../../../../../../context/WorkspaceContext";
import Button from "../assets/Button";

const truncateTitle = (title, maxLength = 15) => {
  if (!title) return "";
  if (title.length <= maxLength) return title;
  return title.slice(0, maxLength) + "...";
};

const MobileCardHeader = ({ index = 0, workspace = null }) => {
  const { cardType, setIsMobileViewsMenuOpen, setCardType } = useMenu();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { currentWorkspace, workspaces, setCurrentWorkspace, deleteWorkspace } =
    useWorkspace();
  const isAllView = workspace;

  useEffect(() => {
    if (!isAllView) {
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
    }
  }, [isAllView]);

  const { dayLabel, formattedDate } = useMemo(() => {
    const today = new Date();
    const futureDate = addDays(today, index);
    const dayLabel =
      index === 0 ? "Today" : index === 1 ? "Tomorrow" : undefined;
    const formattedDate = format(futureDate, "EEEE");
    return { dayLabel, formattedDate };
  }, [index]);

  const formattedTime = useMemo(() => {
    return format(currentTime, "HH:mm");
  }, [currentTime]);

  const handleCurrentWorkspaceDropdownClick = useCallback(
    (workspaceId) => {
      setCurrentWorkspace(workspaceId);
    },
    [setCurrentWorkspace]
  );

  const currentWorkspaceName = useMemo(() => {
    const name = workspaces.find((w) => w.id === currentWorkspace)?.name || "";
    return name;
  }, [workspaces, currentWorkspace]);

  const handleDeleteWorkspace = async () => {
    console.warn("Deleting workspace:", workspace.id);
    await deleteWorkspace(workspace.id);
  };

  return (
    <div className="z-50 relative flex flex-col items-start justify-center px-4 pt-[10px] rounded-xl bg-primary">
      <div className="relative z-10 w-full">
        <div className="flex justify-between items-center w-full pb-2.5">
          <h1 className="text-2xl font-bold text-dominant w-5/12">
            {truncateTitle(
              !isAllView
                ? dayLabel || formattedDate || ""
                : workspace?.name || ""
            )}
          </h1>
          <div className="flex justify-between items-center space-x-2">
            <Button
              label="filter"
              onClick={() => setIsMobileViewsMenuOpen((prev) => !prev)}
            />
            {!isAllView ? (
              <Button
                label={truncateTitle(currentWorkspaceName)}
                options={workspaces.map((w) => w.name)}
                onOptionClick={(option) => {
                  const selectedWorkspace = workspaces.find(
                    (w) => w.name === option
                  );
                  if (selectedWorkspace) {
                    handleCurrentWorkspaceDropdownClick(selectedWorkspace.id);
                  }
                }}
              />
            ) : (
              <>
                {workspace.name !== "Personal" && (
                  <button onClick={handleDeleteWorkspace}>
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          d="M3 6.98996C8.81444 4.87965 15.1856 4.87965 21 6.98996"
                          stroke="#FA3766"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                        <path
                          d="M8.00977 5.71997C8.00977 4.6591 8.43119 3.64175 9.18134 2.8916C9.93148 2.14146 10.9489 1.71997 12.0098 1.71997C13.0706 1.71997 14.0881 2.14146 14.8382 2.8916C15.5883 3.64175 16.0098 4.6591 16.0098 5.71997"
                          stroke="#FA3766"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                        <path
                          d="M12 13V18"
                          stroke="#FA3766"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                        <path
                          d="M19 9.98999L18.33 17.99C18.2225 19.071 17.7225 20.0751 16.9246 20.8123C16.1266 21.5494 15.0861 21.9684 14 21.99H10C8.91389 21.9684 7.87336 21.5494 7.07541 20.8123C6.27745 20.0751 5.77745 19.071 5.67001 17.99L5 9.98999"
                          stroke="#FA3766"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                      </g>
                    </svg>
                  </button>
                )}

                <button onClick={() => setCardType("Workspace")}>
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
        {!isAllView && (
          <div>
            <span className="text-dominant">{formattedTime}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileCardHeader;
