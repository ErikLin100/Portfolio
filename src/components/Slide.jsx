export default function Slide({ children, className = '', label }) {
  return (
    <section className={`slide ${className}`.trim()} aria-label={label}>
      <div className="slide__inner">{children}</div>
    </section>
  );
}
