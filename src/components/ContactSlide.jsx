import Slide from './Slide';

export default function ContactSlide({ contact }) {
  return (
    <Slide className="contact-slide" label="Contact">
      <div className="contact-slide__content">
        <h2 className="contact-slide__cta">{contact.cta}</h2>
        <p className="contact-slide__subtext">{contact.subtext}</p>
        {contact.location ? (
          <p className="contact-slide__location">{contact.location}</p>
        ) : null}

        <div className="contact-slide__choices">
          <div className="contact-slide__choice">
            <p className="contact-slide__choice-label">Contact</p>
            <a
              className="contact-slide__choice-main"
              href={`mailto:${contact.email}`}
            >
              {contact.email}
            </a>
            <ul className="contact-slide__secondary">
              {contact.phone ? (
                <li>
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>
                    {contact.phone}
                  </a>
                </li>
              ) : null}
              {contact.github ? (
                <li>
                  <a href={contact.github} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                </li>
              ) : null}
              {contact.linkedin ? (
                <li>
                  <a href={contact.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          <span className="contact-slide__or" aria-hidden="true">
            or
          </span>

          <a
            className="contact-slide__choice contact-slide__choice--link"
            href={contact.chessUrl}
            target="_blank"
            rel="noreferrer"
          >
            <p className="contact-slide__choice-label">{contact.chessHint}</p>
            <span className="contact-slide__choice-main">{contact.chessLabel}</span>
            <span className="contact-slide__choice-hint">Open board · new game</span>
          </a>
        </div>
      </div>
    </Slide>
  );
}
