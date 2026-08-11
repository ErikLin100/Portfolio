export default function NavDots({ count, index, labels = [], onSelect }) {
  return (
    <nav className="nav-dots" aria-label="Slide navigation">
      <ul className="nav-dots__list">
        {Array.from({ length: count }, (_, i) => {
          const label = labels[i] ?? `Slide ${i + 1}`;
          const active = i === index;
          return (
            <li key={label + i}>
              <button
                type="button"
                className={`nav-dots__btn${active ? ' is-active' : ''}`}
                onClick={() => onSelect(i)}
                aria-label={label}
                aria-current={active ? 'true' : undefined}
              >
                <span className="nav-dots__dot" aria-hidden="true" />
                <span className="nav-dots__label">{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
