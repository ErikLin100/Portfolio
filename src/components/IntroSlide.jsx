import Slide from './Slide';
import StackPills from './StackPills';

export default function IntroSlide({ profile }) {
  const historyLines = profile.history
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <Slide className="intro-slide" label="Intro">
      <div className="intro-slide__content">
        <p className="intro-slide__role">{profile.role}</p>
        <h1 className="intro-slide__name">{profile.name}</h1>
        <p className="intro-slide__bio">{profile.bio}</p>
        <div className="intro-slide__history">
          {historyLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        {profile.mvpNote ? (
          <p className="intro-slide__mvp">{profile.mvpNote}</p>
        ) : null}
        <StackPills items={profile.stack} />
      </div>
    </Slide>
  );
}
