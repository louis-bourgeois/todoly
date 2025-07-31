import React from "react";
import { useTranslation } from "../../../../i18n/client";

const SettingsLine = React.memo(
  ({ children = true, index, setLayout, libelles }) => {
    const { t } = useTranslation();
    return (
      <>
        <div className="button-wrapper m-[5%] my-0 flex items-center justify-between px-4">
          <button
            className="relative z-10 flex items-center justify-between w-full py-4"
            onClick={() =>
              index !== libelles.length - 1
                ? setLayout(libelles[index].name)
                : setLayout("default")
            }
          >
            <div className="flex justify-start  gap-[10%] items-center w-full">
              {children}
              <h2 className="ml-[0.4vw] text-text">
                {libelles[index].name === "default" ? t('settingsLine.mainMenu') : t(`libelles.${libelles[index].name}`)}
              </h2>
            </div>
          </button>
        </div>
      </>
    );
  }
);
SettingsLine.displayName = "SettingsLine";
export default SettingsLine;