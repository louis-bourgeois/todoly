import Image from "next/image";

export default function Integrations({transitionStyles}) {
  return (
    <div
      className={`flex flex-col w-full px-[4%] mt-[4%] gap-[1.75vh] justify-start ${transitionStyles}`}
    >
      <div className="flex justify-center items-center">
        <Image></Image>
        <Image></Image>
        <Image></Image>
        <Image></Image>
        <Image></Image>
      </div>
    </div>
  );
}
