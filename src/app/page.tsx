import NavBar from '@/components/NavBar';
import QuestionPreviewCardContainer from '@/components/QuestionPreviewCardContainer';

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <Bubble />
      <NavBar />
      <main className="mt-20 px-4">
        <QuestionPreviewCardContainer />
      </main>
    </div>
  );
}

const Bubble = () => (
  <div className="hidden md:block w-screen h-20 absolute top-0 left-0">
    <div className="pointer-events-none absolute inset-0">
      <div
        className="
      absolute -top-24 left-1/2 -translate-x-1/2
      w-150 h-44
      bg-radial from-green-400/60 via-green-400/10 to-transparent
      blur-2xl
    "
      />
    </div>
  </div>
);
