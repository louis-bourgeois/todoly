import { addDays, format } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMenu } from "../../../../../../context/MenuContext";
import { useWorkspace } from "../../../../../../context/WorkspaceContext";
import Button from "../assets/Button";

export default function MobileCardHeader({ index }) {
  const { setIsMobileViewsMenuOpen } = useMenu();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { currentWorkspace, workspaces, setCurrentWorkspace } = useWorkspace();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { dayLabel, formattedDate } = useMemo(() => {
    const today = new Date();
    const futureDate = addDays(today, index);
    const dayLabel =
      index === 0 ? "Today" : index === 1 ? "Tomorrow" : undefined;
    const formattedDate = format(futureDate, "EEEE");
    return { dayLabel, formattedDate };
  }, [index]);

  const formattedTime = useMemo(
    () => format(currentTime, "HH:mm"),
    [currentTime]
  );

  const handleCurrentWorkspaceDropdownClick = useCallback(
    (workspaceId) => {
      setCurrentWorkspace(workspaceId);
      setMenuOpen(false);
    },
    [setCurrentWorkspace]
  );

  const currentWorkspaceName = useMemo(
    () =>
      workspaces.find((workspace) => workspace.id === currentWorkspace)?.name ||
      "",
    [workspaces, currentWorkspace]
  );

  return (
    <div className="z-50 relative flex flex-col items-start justify-center px-4 pt-[10px] rounded-xl bg-white">
      <div className="relative z-10 w-full">
        <div className="flex justify-between items-center w-full pb-2.5">
          <h1 className="text-2xl font-bold text-dominant">
            {dayLabel || formattedDate}
          </h1>
          <div className="flex justify-between items-center space-x-2">
            <Button
              label="filter"
              onClick={() => {
                setIsMobileViewsMenuOpen((prev) => !prev);
              }}
            />
            <Button
              label={currentWorkspaceName}
              options={workspaces.map((workspace) => workspace.name)}
              onOptionClick={(option) => {
                const selectedWorkspace = workspaces.find(
                  (w) => w.name === option
                );
                if (selectedWorkspace) {
                  handleCurrentWorkspaceDropdownClick(selectedWorkspace.id);
                }
              }}
            />
          </div>
        </div>
        <div>
          <span className="text-dominant">{formattedTime}</span>
        </div>
      </div>
    </div>
  );
}
