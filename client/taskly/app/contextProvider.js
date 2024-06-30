import { ErrorProvider } from "../context/ErrorContext";
import { MenuProvider } from "../context/MenuContext";
import { NotificationsProvider } from "../context/NotificationsContext";
import { SectionProvider } from "../context/SectionContext";
import { TaskProvider } from "../context/TaskContext";
import { UserProvider } from "../context/UserContext";
import { WorkspaceProvider } from "../context/WorkspaceContext";

const AppProviders = ({ children }) => (
  <NotificationsProvider>
    <ErrorProvider>
      <UserProvider>
        <WorkspaceProvider>
          <TaskProvider>
            <SectionProvider>
              <MenuProvider>{children}</MenuProvider>
            </SectionProvider>
          </TaskProvider>
        </WorkspaceProvider>
      </UserProvider>
    </ErrorProvider>
  </NotificationsProvider>
);

export default AppProviders;
