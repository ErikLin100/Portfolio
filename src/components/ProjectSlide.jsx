import { useState } from 'react';
import Slide from './Slide';
import StackPills from './StackPills';

export default function ProjectSlide({ project }) {
  const [view, setView] = useState(project.defaultView ?? 'product');
  const [snippetIndex, setSnippetIndex] = useState(0);
  const showCode = view === 'code';
  const gallery = project.images?.length
    ? project.images
    : project.image
      ? [project.image]
      : [];
  const hasImage = gallery.length > 0;
  const snippets = project.snippets ?? [];
  const active = snippets[snippetIndex] ?? snippets[0];

  const setViewMode = (next) => {
    setView(next);
    if (next === 'code') setSnippetIndex(0);
  };

  return (
    <Slide className="project-slide" label={project.title}>
      <div className={`project-slide__grid${showCode ? ' is-code' : ''}`}>
        <div className="project-slide__copy">
          <p className="project-slide__eyebrow">Project</p>
          <h2 className="project-slide__title">{project.title}</h2>
          <p className="project-slide__role">{project.role}</p>

          <div
            className="project-slide__toggle"
            role="tablist"
            aria-label={`${project.title} view`}
          >
            <button
              type="button"
              role="tab"
              aria-selected={!showCode}
              className={`project-slide__toggle-btn${!showCode ? ' is-active' : ''}`}
              onClick={() => setViewMode('product')}
            >
              Product
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={showCode}
              className={`project-slide__toggle-btn${showCode ? ' is-active' : ''}`}
              onClick={() => setViewMode('code')}
            >
              Code
            </button>
          </div>

          <p className="project-slide__desc">{project.description}</p>

          <StackPills items={project.stack} />

          {project.stackFocus?.length ? (
            <ul className="project-slide__focus">
              {project.stackFocus.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}</strong>
                  <span>{item.detail}</span>
                </li>
              ))}
            </ul>
          ) : !showCode && project.highlights?.length ? (
            <ul className="project-slide__highlights">
              {project.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}

          {(project.liveUrl || project.repoUrl) && (
            <div className="project-slide__links">
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  Live site
                </a>
              ) : null}
              {project.repoUrl ? (
                <a href={project.repoUrl} target="_blank" rel="noreferrer">
                  Repository
                </a>
              ) : null}
            </div>
          )}
        </div>

        <div className="project-slide__stage" aria-live="polite">
          {showCode && active ? (
            <div className="project-code">
              {snippets.length > 1 ? (
                <div
                  className="project-code__tabs"
                  role="tablist"
                  aria-label={`${project.title} code snippets`}
                >
                  {snippets.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={i === snippetIndex}
                      className={`project-code__tab${i === snippetIndex ? ' is-active' : ''}`}
                      onClick={() => setSnippetIndex(i)}
                    >
                      {item.tab}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="project-code__meta">
                <span className="project-code__file">{active.file}</span>
                <p className="project-code__label">{active.label}</p>
                <p className="project-code__blurb">{active.blurb}</p>
              </div>
              <pre className="project-code__pre">
                <code>{active.snippet}</code>
              </pre>
            </div>
          ) : (
            <ProjectMedia project={project} gallery={gallery} hasImage={hasImage} />
          )}
        </div>
      </div>
    </Slide>
  );
}

function ProjectMedia({ project, gallery, hasImage }) {
  const [imageIndex, setImageIndex] = useState(0);

  if (project.layout === 'flow' || !hasImage) {
    return (
      <div className="project-flow" aria-label={`${project.title} flow`}>
        <p className="project-flow__title">Product flow</p>
        <ol className="project-flow__steps">
          {(project.flow ?? ['Input', 'Process', 'Output']).map((step, i) => (
            <li key={step} className="project-flow__step">
              <span className="project-flow__index">{i + 1}</span>
              <span className="project-flow__name">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  const safeIndex = Math.min(imageIndex, gallery.length - 1);
  const src = gallery[safeIndex];
  const multi = gallery.length > 1;

  const frameClass =
    project.layout === 'phone'
      ? 'project-media project-media--phone'
      : project.layout === 'web'
        ? 'project-media project-media--web'
        : 'project-media';

  const go = (next) => {
    setImageIndex((i) => (i + next + gallery.length) % gallery.length);
  };

  return (
    <div className="project-gallery">
      <figure className={frameClass}>
        <img
          src={src}
          alt={`${project.title} screenshot ${safeIndex + 1} of ${gallery.length}`}
          width={project.layout === 'phone' ? 360 : 720}
          height={project.layout === 'phone' ? 720 : 480}
          loading="lazy"
        />
      </figure>

      {multi ? (
        <div className="project-gallery__controls">
          <button
            type="button"
            className="project-gallery__arrow"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous screenshot"
          >
            ‹
          </button>
          <div className="project-gallery__dots" role="tablist" aria-label="Screenshots">
            {gallery.map((item, i) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={i === safeIndex}
                aria-label={`Screenshot ${i + 1}`}
                className={`project-gallery__dot${i === safeIndex ? ' is-active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setImageIndex(i);
                }}
              />
            ))}
          </div>
          <button
            type="button"
            className="project-gallery__arrow"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next screenshot"
          >
            ›
          </button>
        </div>
      ) : null}
    </div>
  );
}
