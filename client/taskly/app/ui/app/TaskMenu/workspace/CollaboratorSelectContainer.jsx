import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

export default function CollaboratorSelectContainer({
  collaborators,
  setCollaborators,
}) {
  const [inputValue, setInputValue] = useState("");

  const handleConfirm = async (key) => {
    if (key === "Enter" || !key) {
      if (inputValue.trim() !== "") {
        setCollaborators((prev) => [...prev, { name: inputValue }]);
        setInputValue("");
      }
    }
  };

  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
  };

  return (
    <div className="addMenuElement glass-morphism h-[80%] rounded-[20px] flex flex-col justify-between items-center">
      <h1 className="text-4xl font-extrabold">Collaborators</h1>
      <div className="w-full h-[50%]  flex flex-col items-center justify-center p-5">
        <Slider {...settings} className="w-full">
          {collaborators.map((collaborator, index) => {
            console.log(collaborator);
            return (
              <div key={index} className="px-2 py-10">
                <div className="p-2 addMenuElement glass-morphism rounded-full flex justify-between items-center">
                  <span className="text-center block">
                    {collaborator.username || collaborator.name}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    className="cursor-pointer"
                    onClick={() =>
                      setCollaborators((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
      <div className="glass-morphism addMenuElement rounded-full w-[80%] flex justify-around items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="39"
          height="40"
          viewBox="0 0 29 30"
          fill="none"
          className="pl-[1%] cursor-pointer hover:scale-105 transition-transform duration-300"
        >
          <g filter="url(#filter0_d_336_5534)">
            <path
              d="M18.0974 16.8815C15.2072 19.2232 10.8854 19.961 7.24978 18.5817C2.86603 16.9186 0.0735771 12.2407 0.91226 7.88831C1.75144 3.5329 6.11578 0.00992846 10.9961 -0.0904905C11.0859 -0.0918756 11.1757 -0.0923372 11.2658 -0.0921064C16.0623 -0.0498612 20.5841 3.38447 21.4726 7.82875C22.0682 10.8076 21.0411 14.0259 18.8132 16.2392L27.468 24.0465C27.6536 24.2284 27.6215 24.2889 27.6185 24.3903C27.608 24.7423 27.0935 24.9736 26.7741 24.7086L18.0974 16.8815ZM11.1372 0.831286C6.85594 0.868914 2.83867 3.87225 1.94824 7.78235C1.29291 10.6608 2.32516 13.8227 4.59515 15.8789C7.20201 18.24 11.3282 19.0327 14.7701 17.7268C18.7515 16.2166 21.284 11.9478 20.494 7.99704C19.7111 4.08024 15.8018 0.923856 11.3815 0.832671C11.3001 0.831518 11.2186 0.831056 11.1372 0.831286Z"
              fill="black"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_336_5534"
              x="-0.236328"
              y="-0.0921631"
              width="28.8586"
              height="29.9154"
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
              <feGaussianBlur stdDeviation="0.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_336_5534"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_336_5534"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
        <input
          type="text"
          value={inputValue}
          name="collaborators"
          className="placeholder:text-gray w-full text-center focus:outline-none text-black bg-transparent"
          placeholder="Type username"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            handleConfirm(e.key);
          }}
        />
      </div>
      <button className="h-[10%] hover:text-blue transition transition-color ease-in-out duration-300">
        Copy link
      </button>
    </div>
  );
}
