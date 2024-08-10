const PriorityCounter = ({ priority, setPriority }) => {
  const handleIncrease = () => {
    if (priority < 10) setPriority(priority + 1);
  };

  const handleDecrease = () => {
    if (priority > 1) setPriority(priority - 1);
  };

  return (
    <div className="px-4 pt-2">
      <label
        htmlFor="priority"
        className="block text-lg font-bold text-text mb-2"
      >
        Priority
      </label>
      <div className="flex items-center bg-primary rounded-lg p-1 w-9/12">
        <button
          onClick={handleDecrease}
          className="w-8 h-8 flex items-center justify-center text-dominant hover:bg-secondary rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-dominant focus:ring-opacity-50"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="flex-grow text-center font-semibold text-text">
          {priority}
        </div>
        <button
          onClick={handleIncrease}
          className="w-8 h-8 flex items-center justify-center text-dominant hover:bg-secondary rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-dominant focus:ring-opacity-50"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PriorityCounter;
