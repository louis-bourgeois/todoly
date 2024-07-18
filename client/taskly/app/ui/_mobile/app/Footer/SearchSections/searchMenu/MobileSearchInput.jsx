export default function MobileSearchInput({ children }) {
  return (
    <>
      <div className="flex rounded-full justify-start px-[15px] border py-[10px] mr-[2.5%] items-center shadow-shadow_01 w-3/4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="21"
          viewBox="0 0 19 21"
          fill="none"
        >
          <path
            d="M12.0826 14.0477C10.068 15.8873 7.05543 16.4669 4.52119 15.3833C1.46547 14.0769 -0.481036 10.402 0.103575 6.98273C0.688532 3.56114 3.73073 0.79352 7.13261 0.714632C7.19521 0.713544 7.25782 0.713181 7.3206 0.713362C10.664 0.74655 13.816 3.44453 14.4353 6.93594C14.8505 9.27611 14.1346 11.8044 12.5816 13.5432L18.6145 19.6765C18.7438 19.8194 18.7215 19.8669 18.7194 19.9465C18.7121 20.2231 18.3535 20.4048 18.1308 20.1966L12.0826 14.0477ZM7.23094 1.43877C4.24666 1.46833 1.44639 3.82773 0.82571 6.89949C0.368913 9.16077 1.08845 11.6448 2.67076 13.2601C4.4879 15.1149 7.36413 15.7377 9.76327 14.7118C12.5386 13.5254 14.3038 10.1718 13.7532 7.06814C13.2075 3.99113 10.4825 1.5115 7.40124 1.43986C7.34448 1.43896 7.28771 1.43859 7.23094 1.43877Z"
            fill="#007AFF"
          />
        </svg>
        <input
          type="text"
          name="collaborators"
          className="placeholder:text-gray placeholder:text-[13px] w-full text-center pr-5 focus:outline-none text-black "
          placeholder="Type a command or search"
        />
      </div>
      {children}
    </>
  );
}
