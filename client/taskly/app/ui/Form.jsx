"use client";
export default function Form({ children, onSubmit, onChange }) {
  return (
    <form
      className="flex flex-wrap content-between justify-center items-left gap-6"
      onSubmit={(e) => {
        onSubmit(e);
      }}
      onChange={(e) => {
        onChange(e);
      }}
    >
      {children}
    </form>
  );
}
