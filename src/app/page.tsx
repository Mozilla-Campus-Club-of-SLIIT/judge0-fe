import NavBar from '@/components/NavBar';
import QuestionPreviewCardContainer from '@/components/QuestionPreviewCardContainer';

export default function Home() {
  return (
    <div className="w-full h-screen overflow-x-hidden">
      <NavBar />
      <main className="mt-20 px-4">
        <QuestionPreviewCardContainer />
      </main>
    </div>
  );
}
