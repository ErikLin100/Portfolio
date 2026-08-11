export default function StackPills({ items }) {
  if (!items?.length) return null;
  return (
    <ul className="stack-pills" aria-label="Tech stack">
      {items.map((item) => (
        <li key={item} className="stack-pills__item">
          {item}
        </li>
      ))}
    </ul>
  );
}
