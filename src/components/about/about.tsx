import Image from 'next/image';
import { Twitter, Github, Linkedin, Instagram } from 'lucide-react';

export default function About() {
  return (
    <section className="pb-12 md:pb-20 px-4 md:px-8 bg-transparent flex flex-col items-center overflow-x-hidden pt-0">
      {/* Logo */}
      <Image
        src="/assets/logo.svg"
        width={550}
        height={370}
        className="w-137.5 h-92.5 relative mb-12 md:mb-16"
        alt="logo"
      />

      <div className="relative max-w-[1300px] w-full">
        {/* SECTION: What is CodeNight */}
        <div className="mb-24 md:mb-32 relative">
          {/* Title */}
          <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight mb-8 md:mb-12 text-left">
            <span className="text-[#40fd51]">/</span> What is CodeNight
          </h2>

          {/* Paragraph and Dots */}
          <div className="relative">
            <p className="text-[#ededed] text-xl md:text-2xl lg:text-3xl leading-relaxed text-center md:text-left max-w-none mx-auto md:mx-0">
              Code Night is a continuous technical series designed to create a{' '}
              <br className="hidden lg:block" />
              practical and engaging environment for students. It focuses on
              physical <br className="hidden lg:block" />
              events where participants learn key concepts and immediately apply{' '}
              <br className="hidden lg:block" />
              them through challenges, creating a balance between learning and{' '}
              <br className="hidden lg:block" />
              competition.
            </p>
          </div>
        </div>

        {/* SECTION: Our Vision */}
        <div className="relative mb-24 md:mb-32">
          {/* Title */}
          <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight mb-8 md:mb-12 text-left">
            <span className="text-[#40fd51]">/</span> Our Vision
          </h2>

          <div className="border border-[#40fd51]/40 bg-[#0C0E19]/80 p-6 md:p-10 text-center rounded-sm max-w-5xl">
            <p className="text-[#ededed] text-2xl md:text-3xl lg:text-4xl leading-relaxed max-w-none mx-auto font-light italic">
              &quot;To create a consistent space where students can learn,{' '}
              <br className="hidden lg:block" />
              apply, and improve their technical skills through practical{' '}
              <br className="hidden lg:block" />
              experience and structured competition.&quot;
            </p>
          </div>
        </div>

        {/* SECTION: Event RoadMap */}
        <div className="text-center px-2">
          <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight mb-8 md:mb-12 text-center">
            <span className="text-[#40fd51]">/</span> Event RoadMap
          </h2>
          <div className="flex justify-center overflow-x-auto scrollbar-hide py-2">
            <Image
              src="/dsa_roadmap.svg"
              width={1000}
              height={600}
              className="w-full h-auto min-w-[600px] md:min-w-0 max-w-6xl"
              alt="DSA Roadmap"
            />
          </div>
        </div>

        {/* SECTION: Social Media Footer */}
        <div className="mt-24 md:mt-32 text-center pb-12 md:pb-20 px-4">
          <p className="text-white/60 text-xl md:text-2xl lg:text-3xl mb-8 max-w-xs md:max-w-none mx-auto">
            Follow us for updates, announcements, and upcoming events.
          </p>
          <div className="flex justify-center gap-6 md:gap-8 flex-wrap">
            <a
              href="https://x.com/mozillasliit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-[#40fd51] transition-colors"
              aria-label="X (Twitter)"
            >
              <Twitter size={24} className="md:w-7 md:h-7" />
            </a>
            <a
              href="https://github.com/Mozilla-Campus-Club-of-SLIIT"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-[#40fd51] transition-colors"
              aria-label="GitHub"
            >
              <Github size={24} className="md:w-7 md:h-7" />
            </a>
            <a
              href="https://www.linkedin.com/company/sliitmozilla/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-[#40fd51] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} className="md:w-7 md:h-7" />
            </a>
            <a
              href="https://www.instagram.com/sliitmozilla"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-[#40fd51] transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={24} className="md:w-7 md:h-7" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
