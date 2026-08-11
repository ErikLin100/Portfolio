import Slide from './Slide';

export default function ContactSlide({ contact }) {
  return (
    <Slide className="contact-slide" label="Contact">
      <div className="contact-slide__content">
        <h2 className="contact-slide__cta">{contact.cta}</h2>
        <ul className="contact-slide__links">
          <li>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </li>
          <li>
            <a href={contact.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href={contact.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </Slide>
  );
}
