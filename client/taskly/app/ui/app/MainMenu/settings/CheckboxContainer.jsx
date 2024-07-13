export default function CheckboxContainer({ children, isChecked, onChange }) {
  return (
    <div
      className={`w-full rounded-[12px] flex justify-between border border-black p-[2%]`}
    >
      {children}
      <button
        onClick={onChange}
        className={`rounded-[5px] border border-black w-[26px] h-[26px] cursor-pointer ${
          isChecked && "bg-blue"
        } transition transition-all`}
      />
    </div>
  );
}
