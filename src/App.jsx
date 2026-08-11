import Carousel from './components/Carousel';
import IntroSlide from './components/IntroSlide';
import ProjectSlide from './components/ProjectSlide';
import ContactSlide from './components/ContactSlide';
import { profile, projects, contact } from './data';

export default function App() {
  const slides = [
    {
      key: 'intro',
      node: <IntroSlide profile={profile} />,
    },
    ...projects.map((project) => ({
      key: project.id,
      node: <ProjectSlide project={project} />,
    })),
    {
      key: 'contact',
      node: <ContactSlide contact={contact} />,
    },
  ];

  const labels = [
    'Intro',
    ...projects.map((_, i) => `Project ${i + 1}`),
    'Contact',
  ];

  return <Carousel slides={slides} labels={labels} />;
}
