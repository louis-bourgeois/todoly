import Switcher from "@/ui/app/MainMenu/settings/Switcher";

const TagToggle = ({ libelle, onChange, isChecked }) => {
  return (
    <div className="inline-flex items-center gap-2 bg-ternary rounded-full px-3 py-1">
      <span className="capitalize font-medium text-sm whitespace-nowrap">
        {libelle}
      </span>
      <Switcher
        className="flex-shrink-0 scale-75"
        onChange={onChange}
        isChecked={isChecked}
      />
    </div>
  );
};

export default TagToggle;
