const Switcher = ({ isChecked, onChange, className = "" }) => {
  return (
    <label
      className={`switch relative inline-block w-[50px] h-[24px] ${className}`}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="opacity-0 w-0 h-0"
      />
      <span className="slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#ccc] duration-400 rounded-full transition-all"></span>
    </label>
  );
};

export default Switcher;
