export default function SearchMenuLibelle({ children, styles }) {
  return (
    <div className={`bg-[#F0F0F0] rounded-lg p-2 text-s font-light ${styles}`}>
      {children}
    </div>
  );
}
