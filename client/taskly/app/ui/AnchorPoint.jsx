export default function AnchorPoint({ children, styles }) {
  return (
    <a draggable="false" className={styles + ""}>
      {children}
    </a>
  );
}
