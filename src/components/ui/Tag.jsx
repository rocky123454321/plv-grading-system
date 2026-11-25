export default function Tag({ tone = "neutral", icon: Icon, children }) {
  return (
    <span className={`tag tag-${tone}`}>
      {Icon && <Icon size={13} aria-hidden="true" />}
      {children}
    </span>
  );
}
