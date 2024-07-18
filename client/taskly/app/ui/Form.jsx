"use client";

export default function Form({ children, onSubmit, onChange }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form
      className="flex flex-wrap content-between justify-center items-left gap-6 w-full"
      onSubmit={handleSubmit}
      onChange={onChange}
    >
      {children}
    </form>
  );
}
