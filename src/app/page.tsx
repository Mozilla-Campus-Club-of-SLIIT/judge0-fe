import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/navbar/Navbar';
import About from '@/components/about/about';

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <About />
    </>
  );
}
