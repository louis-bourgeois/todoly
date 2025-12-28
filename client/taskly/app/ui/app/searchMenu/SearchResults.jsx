import { useTranslation } from "../../../i18n/client";

const SearchResults = ({
  results,
  selectedIndex,
  onItemClick,
  commandMode,
}) => {
  const { t } = useTranslation();
  return (
    <div className="w-full mt-2 bg-primary text-text border border-secondary/20 rounded-2xl shadow-lg max-h-[40vh] overflow-y-auto transition-all duration-300 ease-in-out scrollbar-custom">
      {results.length === 0 ? (
        <div className="px-[2vw] py-[1vw] text-[1vw] text-gray-500">
          {t("searchResults.noResults")}
        </div>
      ) : (
        <ul className="py-[0.5vw]">
          {results.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div
                key={item.id}
                className={`
                item-wrapper w-full ${isSelected ? "before:scale-105" : ""}
              `}
              >
                <li
                  key={item.id}
                  onClick={() => onItemClick?.(item)}
                  className={`group relative overflow-hidden w-full rounded-[0.5vw] mx-[1vw] my-[0.5vw] px-[2vw] py-[1vw] text-[1vw] transition-all duration-300 ease-in-out border ${
                    isSelected
                      ? "bg-dominant/20 border-dominant"
                      : "bg-transparent border-transparent hover:bg-primary/20 hover:border-secondary/30"
                  } ${commandMode === "addTag" ? "cursor-pointer" : "cursor-pointer"}`}
                >
                  <span className="relative z-10">{item.title}</span>
                  <span className="absolute inset-0 bg-dominant-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
                </li>
              </div>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
