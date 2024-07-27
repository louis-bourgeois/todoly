import { useEffect, useState } from "react";

export default function Header({
  name,
  handleSettingsChange,
  containerRef,
  showContentMenu,
  marginTop,
  height,
  layout,
  setLayout,
  setProfilePictureVisibility,
  libelles,
  currentLayout,
}) {
  useEffect(() => {
    if (
      libelles.some((libelle) => libelle.name === layout) &&
      layout !== "Main Menu"
    ) {
      setProfilePictureVisibility((prev) => !prev);
    }
  }, [layout]);

  const isSettingsLayout = libelles.some((libelle) => libelle.name === layout);
  const [isHovered, setIsHovered] = useState(false);
  if (isSettingsLayout && layout !== "Main Menu") {
    return (
      <div
        className={`mx-[4%] mt-[3vh] flex items-center justify-between gap-[4.5vw] transition-opacity duration-500 ease-in 
      ${!showContentMenu && "opacity-100 "}`}
      >
        <svg
          height={"48"}
          width={"48"}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="cursor-pointer"
          onClick={() => setLayout("settings")}
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
              d="M6 12H18M6 12L11 7M6 12L11 17"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>{" "}
          </g>
        </svg>
        <h1 className="font-extrabold text-2xl absolute left-1/2 transform -translate-x-1/2">
          {layout}
        </h1>
        {layout === "Account" ? (
          <svg
            height={"40"}
            width={"40"}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="cursor-pointer hover:scale-105 transition transition-transform duration-300 active:scale-100"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M3 6.98996C8.81444 4.87965 15.1856 4.87965 21 6.98996"
                stroke="red"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M8.00977 5.71997C8.00977 4.6591 8.43119 3.64175 9.18134 2.8916C9.93148 2.14146 10.9489 1.71997 12.0098 1.71997C13.0706 1.71997 14.0881 2.14146 14.8382 2.8916C15.5883 3.64175 16.0098 4.6591 16.0098 5.71997"
                stroke="red"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M12 13V18"
                stroke="red"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                d="M19 9.98999L18.33 17.99C18.2225 19.071 17.7225 20.0751 16.9246 20.8123C16.1266 21.5494 15.0861 21.9684 14 21.99H10C8.91389 21.9684 7.87336 21.5494 7.07541 20.8123C6.27745 20.0751 5.77745 19.071 5.67001 17.99L5 9.98999"
                stroke="red"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>
        ) : (
          <div className="w-48"></div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-end gap-[1.325vw] transition-opacity duration-500 ease-in 
       ${!showContentMenu && "opacity-100 "}`}
      style={{
        marginTop: `${marginTop}px`,
        height: `${height}px`,
      }}
    >
      <div className="flex flex-col items-start justify-between">
        <h3 className={`text-[2em] font-extrabold leading-none`}>{name}</h3>
        <p
          className={`delay-250 text-[0.8em] cursor-pointer font-light leading-none pl-[0.075vw]`}
        >
          Free plan
        </p>
      </div>
      {layout === "Main Menu" || layout === "default" ? (
        <div
          className="relative w-[10%] mr-[1vw] cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <svg
            className={`w-full h-full transition-all duration-300 ease-in-out ${
              isHovered ? "text-dominant  animate-settings-hover" : "text-black"
            }`}
            viewBox="0 0 33 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => handleSettingsChange("settings")}
          >
            <path
              d="M4.32086 18.3589L4.3578 18.6459L4.12735 18.8209L0.612505 21.4902C0.612289 21.4904 0.612076 21.4905 0.61186 21.4907C0.502794 21.5748 0.461592 21.7328 0.541822 21.8801L3.87127 27.4739L3.8714 27.4738L3.87756 27.4848C3.94976 27.6133 4.11534 27.6803 4.27899 27.619C4.27955 27.6188 4.28011 27.6186 4.28067 27.6183L8.4266 26.0013L8.6815 25.9019L8.90266 26.063C9.74336 26.6753 10.6402 27.2029 11.6098 27.5888L11.8775 27.6953L11.9196 27.9803L12.5529 32.2696L12.553 32.2696L12.5542 32.2788C12.5691 32.3943 12.6852 32.5224 12.8749 32.5224H19.5416C19.7313 32.5224 19.8475 32.3943 19.8624 32.2788L19.8623 32.2788L19.8636 32.2696L20.497 27.9803L20.5391 27.6953L20.8067 27.5888C21.7799 27.2015 22.6751 26.6896 23.509 26.0666L23.7314 25.9005L23.99 26.0013L28.1309 27.6164C28.3001 27.6729 28.4755 27.5979 28.539 27.4848L28.5389 27.4847L28.5453 27.4739L31.8747 21.8801C31.955 21.7328 31.9138 21.5748 31.8047 21.4907C31.8045 21.4905 31.8043 21.4904 31.8041 21.4902L28.2892 18.8209L28.0588 18.6459L28.0957 18.3589C28.161 17.8515 28.2083 17.3408 28.2083 16.8365C28.2083 16.3323 28.161 15.8216 28.0957 15.3141L28.0588 15.0271L28.2892 14.8521L31.8041 12.1828C31.8043 12.1827 31.8045 12.1825 31.8047 12.1823C31.9295 12.0862 31.9576 11.9293 31.8811 11.8036L31.8786 11.7995L28.5453 6.19915L28.5452 6.19923L28.539 6.18827C28.4668 6.0597 28.3012 5.99276 28.1375 6.05412L23.99 7.67175L23.7351 7.77116L23.5139 7.61008C22.6732 6.99774 21.7764 6.47021 20.8067 6.08426L20.5391 5.97773L20.497 5.69274L19.8636 1.40348L19.8636 1.40349L19.8624 1.39427C19.8475 1.27879 19.7313 1.15063 19.5416 1.15063H12.8749C12.6852 1.15063 12.5691 1.27879 12.5542 1.39427L12.5543 1.39428L12.5529 1.40348L11.9196 5.69274L11.8775 5.97773L11.6098 6.08426C10.6366 6.47161 9.74146 6.9835 8.90752 7.60649L8.68517 7.7726L8.4266 7.67175L4.28572 6.05672C4.11643 6.00014 3.94109 6.07517 3.87756 6.18827L3.8777 6.18835L3.87127 6.19915L0.541807 11.793C0.461617 11.9403 0.502779 12.0982 0.611782 12.1823C0.612022 12.1825 0.612263 12.1827 0.612505 12.1828L4.12735 14.8521L4.3578 15.0271L4.32086 15.3141C4.25548 15.8221 4.20828 16.3164 4.20828 16.8365C4.20828 17.3566 4.25548 17.851 4.32086 18.3589ZM22.5416 16.8365C22.5416 20.2502 19.6872 23.0016 16.2083 23.0016C12.7294 23.0016 9.87495 20.2502 9.87495 16.8365C9.87495 13.4228 12.7294 10.6715 16.2083 10.6715C19.6872 10.6715 22.5416 13.4228 22.5416 16.8365Z"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </div>
      ) : (
        layout === "settings" && (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="49"
              viewBox="0 0 48 49"
              fill="none"
              className="w-[10%] cursor-pointer mr-[1vw] transition duration-700 ease-in-out"
              onClick={() => setLayout("Account")}
            >
              <g filter="url(#filter0_d_76_3126)">
                <path
                  d="M24.1228 0.844971C12.9421 0.844971 3.84491 9.94308 3.84491 21.125C3.84491 27.1169 6.45907 32.5088 10.6042 36.2243V36.2386L10.8982 36.4921C10.9498 36.5369 11.0064 36.5741 11.0588 36.618C11.904 37.3309 12.8051 37.9749 13.7532 38.5438C13.825 38.5869 13.8985 38.6275 13.9703 38.6689C14.441 38.9426 14.9217 39.2004 15.4151 39.4361L15.4303 39.4429C16.4948 39.949 17.6017 40.3607 18.7382 40.6732L18.8015 40.6909C19.3431 40.8388 19.894 40.963 20.4525 41.0653L20.6088 41.0932C21.1517 41.189 21.6982 41.2629 22.2471 41.3146C22.3105 41.3205 22.3738 41.3238 22.4364 41.3289C22.9932 41.3754 23.5542 41.405 24.1228 41.405C24.6914 41.405 25.2525 41.3754 25.8092 41.3289C25.8726 41.3238 25.936 41.3205 25.9985 41.3146C26.5519 41.2639 27.0977 41.1878 27.6368 41.0932L27.7931 41.0653C28.3485 40.9641 28.8993 40.8392 29.4441 40.6909L29.5074 40.6732C30.6439 40.3607 31.7508 39.949 32.8153 39.4429L32.8305 39.4361C33.3221 39.1997 33.8041 38.9437 34.2753 38.6689C34.3479 38.6266 34.4206 38.5869 34.4924 38.5438C34.9211 38.2866 35.3402 38.0138 35.7488 37.7258C35.8536 37.6523 35.9583 37.5788 36.0623 37.5028C36.4475 37.2205 36.8227 36.9256 37.1868 36.618C37.2392 36.5741 37.2958 36.5369 37.3474 36.4921L37.6414 36.2386V36.2243C41.7865 32.508 44.4007 27.1169 44.4007 21.125C44.4007 9.94308 35.3035 0.844971 24.1228 0.844971ZM24.1228 21.125C20.3959 21.125 17.3635 18.0923 17.3635 14.365C17.3635 10.6377 20.3959 7.60497 24.1228 7.60497C27.8497 7.60497 30.8821 10.6377 30.8821 14.365C30.8821 18.0923 27.8497 21.125 24.1228 21.125ZM26.6575 22.815C31.7819 22.815 35.9516 26.985 35.9516 32.11V35.4545C35.9161 35.4841 35.8789 35.5111 35.8434 35.5407C35.5097 35.8119 35.1675 36.0696 34.8177 36.3164C34.74 36.3713 34.6639 36.4279 34.5862 36.4812C34.2085 36.7389 33.8207 36.9805 33.4261 37.2095L33.209 37.3346C31.4048 38.3512 29.4422 39.0562 27.4036 39.4201L27.2591 39.4463C26.7788 39.5284 26.2954 39.5918 25.8101 39.6364C25.7433 39.6423 25.6758 39.6465 25.6082 39.6516C25.1156 39.6896 24.6205 39.715 24.1228 39.715C23.6251 39.715 23.13 39.6896 22.6374 39.6499L22.4355 39.6347C21.9014 39.5858 21.3698 39.5137 20.842 39.4184C19.3228 39.1449 17.8435 38.6834 16.4383 38.0444L16.3023 37.9827C15.7965 37.747 15.3018 37.4885 14.8195 37.2079C14.4249 36.9797 14.0371 36.7372 13.6594 36.4795C13.5808 36.4262 13.5048 36.3696 13.4279 36.3147C13.0771 36.0681 12.735 35.8094 12.4022 35.539C12.3667 35.5103 12.3295 35.4824 12.294 35.4528V32.11C12.294 26.985 16.4637 22.815 21.5881 22.815H26.6575ZM37.6414 33.8642V32.11C37.6414 26.811 33.8697 22.3764 28.8712 21.3489C30.0108 20.5749 30.9437 19.5339 31.5888 18.3166C32.2338 17.0993 32.5713 15.7426 32.5719 14.365C32.5719 9.70564 28.7816 5.91497 24.1228 5.91497C19.464 5.91497 15.6737 9.70564 15.6737 14.365C15.6743 15.7426 16.0118 17.0993 16.6568 18.3166C17.3019 19.5339 18.2348 20.5749 19.3744 21.3489C14.3759 22.3764 10.6042 26.811 10.6042 32.11V33.8642C7.46451 30.534 5.53473 26.0522 5.53473 21.125C5.53473 10.8743 13.8732 2.53497 24.1228 2.53497C34.3724 2.53497 42.7109 10.8743 42.7109 21.125C42.7109 26.0522 40.7811 30.534 37.6414 33.8642Z"
                  fill="black"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_76_3126"
                  x="0.84491"
                  y="0.844971"
                  width="46.5558"
                  height="47.56"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="4" />
                  <feGaussianBlur stdDeviation="1.5" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_76_3126"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_76_3126"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </>
        )
      )}
    </div>
  );
}
