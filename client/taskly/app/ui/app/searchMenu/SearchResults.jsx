const SearchResults = ({ results, selectedIndex, onItemClick }) => {
  return (
    <div className="absolute w-full mt-2 bg-white rounded-2xl shadow-lg max-h-[40vh] overflow-y-auto transition-all duration-300 ease-in-out scrollbar-custom">
      {results.length === 0 ? (
        <div className="px-[2vw] py-[1vw] text-[1vw] text-gray-500">
          No results found
        </div>
      ) : (
        <ul className="py-[0.5vw] ">
          {results.map((item, index) => (
            <div
              key={item.id}
              className={`
                item-wrapper
              w-full ${index === selectedIndex ? "before:scale-105 " : ""}
            `}
            >
              <li
                key={item.id}
                onClick={() => onItemClick(item)}
                className={`
                group relative overflow-hidden w-full rounded-[0.5vw] mx-[1vw] my-[0.5vw] px-[2vw] py-[1vw] text-[1vw] cursor-pointer transition-all duration-300 ease-in-out`}
              >
                <span className="relative z-10">{item.title}</span>
                <span className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
              </li>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
