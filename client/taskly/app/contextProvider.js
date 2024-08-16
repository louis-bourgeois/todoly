import { AuthProvider } from "../context/AuthContext";
import { ErrorProvider } from "../context/ErrorContext";
import { MenuProvider } from "../context/MenuContext";
import { NotificationsProvider } from "../context/NotificationsContext";
import { ScreenProvider } from "../context/ScreenContext";
import { MobileSearchProvider } from "../context/searchContext";
import { SectionProvider } from "../context/SectionContext";
import { TagProvider } from "../context/TagContext";
import { TaskProvider } from "../context/TaskContext";
import { UserProvider } from "../context/UserContext";
import { UserPreferencesProvider } from "../context/UserPreferencesContext";
import { WorkspaceProvider } from "../context/WorkspaceContext";
import ScreenWrapper from "./ScreenWrapper";
const AppProviders = ({ children }) => (
  <ScreenProvider>
    <NotificationsProvider>
      <ErrorProvider>
        <AuthProvider>
          <UserProvider>
            <UserPreferencesProvider>
              <SectionProvider>
                <WorkspaceProvider>
                  <TaskProvider>
                    <TagProvider>
                      <MenuProvider>
                        <MobileSearchProvider>
                          <ScreenWrapper>{children}</ScreenWrapper>
                        </MobileSearchProvider>
                      </MenuProvider>
                    </TagProvider>
                  </TaskProvider>
                </WorkspaceProvider>
              </SectionProvider>
            </UserPreferencesProvider>
          </UserProvider>
        </AuthProvider>
      </ErrorProvider>
    </NotificationsProvider>
  </ScreenProvider>
);

export default AppProviders;
