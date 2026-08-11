import Slide from './Slide';
import StackPills from './StackPills';

export default function ProjectSlide({ project }) {
  return (
    <Slide className="project-slide" label={project.title}>
      <div className="project-slide__grid">
        <div className="project-slide__copy">
          <p className="project-slide__eyebrow">Project</p>
          <h2 className="project-slide__title">{project.title}</h2>
          <p className="project-slide__role">{project.role}</p>
          <p className="project-slide__desc">{project.description}</p>
          <StackPills items={project.stack} />
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
        </div>

        <figure className="project-slide__media">
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            width={720}
            height={480}
            loading="lazy"
          />
        </figure>
      </div>
    </Slide>
  );
}
