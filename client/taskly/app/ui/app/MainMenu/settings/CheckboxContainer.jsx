import Circle from "./Circle";

export default function CheckboxContainer({ children, isChecked, onChange }) {
  return (
    <div
      className="w-full rounded-[12px] flex justify-between border border-secondary p-[2%]"
    >
      {children}
      <Circle
        borderColor="dominant"
        onColorChange={onChange}    // Transmet le callback via onColorChange
        isSelected={isChecked}      // Passe isChecked sous le nom attendu isSelected
      />
    </div> 
  );
}
