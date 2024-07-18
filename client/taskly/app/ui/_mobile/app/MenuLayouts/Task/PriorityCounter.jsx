const PriorityCounter = ({ priority, setPriority }) => {
  const handleIncrease = () => {
    if (priority < 10) setPriority(priority + 1);
  };

  const handleDecrease = () => {
    if (priority > 1) setPriority(priority - 1);
  };

  return (
    <div className="px-4">
      <label
        htmlFor="priority"
        className="block text-lg font-bold text-black mb-2"
      >
        Priority
      </label>
      <div className="flex items-center bg-gray-100 rounded-lg p-1  w-9/12">
        <button
          onClick={handleDecrease}
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-dominant focus:ring-opacity-50"
        >
          -
        </button>
        <div className="flex-grow text-center font-semibold text-gray-800">
          {priority}
        </div>
        <button
          onClick={handleIncrease}
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-dominant focus:ring-opacity-50"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default PriorityCounter;
