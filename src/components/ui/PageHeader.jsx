export default function PageHeader({ icon: Icon, title, children, action }) {
  return (
    <header className="page-header">
      <span className="page-header-icon" aria-hidden="true">
        <Icon size={22} />
      </span>
      <div className="page-header-text">
        <h2>{title}</h2>
        <p>{children}</p>
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </header>
  );
}
