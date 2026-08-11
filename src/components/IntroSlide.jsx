import Slide from './Slide';
import StackPills from './StackPills';

export default function IntroSlide({ profile }) {
  const historyLines = profile.history
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <Slide className="intro-slide" label="Intro">
      <div className="intro-slide__grid">
        <div className="intro-slide__copy">
          <p className="intro-slide__role">{profile.role}</p>
          <h1 className="intro-slide__name">{profile.name}</h1>
          <p className="intro-slide__bio">{profile.bio}</p>
          <div className="intro-slide__history">
            {historyLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        <figure className="intro-slide__photo">
          <img
            src={profile.photo}
            alt={`${profile.name} portrait`}
            width={320}
            height={400}
            loading="eager"
          />
        </figure>

        <div className="intro-slide__stack">
          <StackPills items={profile.stack} />
        </div>
      </div>
    </Slide>
  );
}
