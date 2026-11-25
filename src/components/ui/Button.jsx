export default function Button({ variant = "primary", icon: Icon, children, ...props }) {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {Icon && <Icon size={16} aria-hidden="true" />}
      {children}
    </button>
  );
}
