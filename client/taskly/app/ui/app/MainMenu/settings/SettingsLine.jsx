import React from "react";

const SettingsLine = React.memo(
  ({ children = true, index, setLayout, libelles, icons }) => {
    return (
      <>
        <div className="button-wrapper m-[5%] my-0 flex items-center justify-between px-4 py-2">
          <button
            className="relative z-10 flex items-center justify-between w-full "
            onClick={() =>
              index !== libelles.length - 1
                ? setLayout(libelles[index].name)
                : setLayout("default")
            }
          >
            <div className="flex justify-start gap-[7.5%] items-center ">
              {children}
              <h2 className="ml-[0.4vw] w-full text-text">
                {libelles[index].name}
              </h2>
            </div>
            {index !== icons.length - 1 && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="24"
                viewBox="0 0 14 24"
                fill="none"
                className="m-[8%]"
              >
                <path
                  d="M13.3371 10.3816L3.83427 0.677025C3.62592 0.462499 3.37803 0.292224 3.10492 0.176025C2.83181 0.0598248 2.53887 0 2.243 0C1.94713 0 1.65419 0.0598248 1.38108 0.176025C1.10796 0.292224 0.860081 0.462499 0.651731 0.677025C0.234301 1.10586 0 1.68596 0 2.29063C0 2.8953 0.234301 3.47541 0.651731 3.90424L8.58566 12.0066L0.651731 20.109C0.234301 20.5378 0 21.1179 0 21.7226C0 22.3273 0.234301 22.9074 0.651731 23.3362C0.861151 23.5483 1.10951 23.7162 1.38258 23.8301C1.65564 23.944 1.94804 24.0017 2.243 24C2.53796 24.0017 2.83035 23.944 3.10342 23.8301C3.37648 23.7162 3.62485 23.5483 3.83427 23.3362L13.3371 13.6317C13.5471 13.4189 13.7139 13.1658 13.8276 12.8868C13.9414 12.6079 14 12.3088 14 12.0066C14 11.7045 13.9414 11.4053 13.8276 11.1264C13.7139 10.8475 13.5471 10.5943 13.3371 10.3816Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
        </div>
      </>
    );
  }
);
SettingsLine.displayName = "SettingsLine";
export default SettingsLine;
