import MobileMainMenu from "./MainMenu/MobileMainMenu";
import MobileMainButtons from "./SearchSections/mainButtons/MobileMainButtons";
import MobileSearchSection from "./SearchSections/MobileSearchSection";
import MobileSearchInput from "./SearchSections/searchMenu/MobileSearchInput";

export default function MobileFooter() {
  return (
    <footer className=" px-[17.5px] h-[15dvh] w-full flex flex-col items-center justify-between gap-[2vh]">
      <MobileSearchSection>
        <MobileSearchInput />
        <MobileMainButtons />
      </MobileSearchSection>
      <MobileMainMenu />
    </footer>
  );
}
