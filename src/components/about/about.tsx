import Image from 'next/image';
import { Twitter, Github, Linkedin, Instagram } from 'lucide-react';

export default function About() {
  return (
    <section className="py-12 md:py-20 px-4 md:px-8 bg-transparent flex flex-col items-center overflow-x-hidden">
      {/* Logo */}
      <div className="relative w-full max-w-[550px] mb-12 md:mb-16 aspect-[550/370]">
        <Image
          src="/assets/logo.svg"
          fill
          className="object-contain"
          alt="logo"
        />
      </div>

      <div className="relative max-w-4xl w-full">
        {/* SECTION: What is CodeNight */}
        <div className="mb-16 md:mb-20 relative">
          {/* Left Decorative Dots (Hidden on small screens) */}
          <div className="hidden md:flex absolute -left-12 top-4 gap-1">
            <div className="w-1.5 h-1.5 bg-[#40fd51]" />
            <div className="w-1.5 h-1.5 bg-[#40fd51]" />
            <div className="w-1.5 h-1.5 bg-[#40fd51]" />
            <div className="w-1.5 h-1.5 bg-[#40fd51]" />
          </div>

          {/* Title */}
          <h2 className="text-white text-2xl md:text-4xl font-medium tracking-tight mb-6 md:mb-8 text-center md:text-left">
            <span className="text-[#40fd51]">/</span> What is CodeNight
          </h2>

          {/* Paragraph and Dots */}
          <div className="relative">
            <p className="text-[#ededed] text-base md:text-lg leading-relaxed text-center md:text-left max-w-2xl mx-auto md:mx-0">
              Code Night is a continuous technical series designed to create a
              practical and engaging environment for students. It focuses on
              physical events where participants learn key concepts and
              immediately apply them through challenges, creating a balance
              between learning and competition.
            </p>

            {/* Right Decorative Pattern (Hidden on small screens) */}
            <div className="hidden lg:grid absolute -right-8 bottom-4 grid-cols-2 gap-1.5">
              <div className="w-1.5 h-1.5 bg-[#40fd51]" />
              <div className="w-1.5 h-1.5 bg-[#40fd51]" />
              <div className="w-1.5 h-1.5 bg-[#40fd51]" />
              <div className="w-1.5 h-1.5 bg-[#40fd51]" />
              <div className="w-1.5 h-1.5 bg-[#40fd51]" />
              <div className="w-1.5 h-1.5 bg-[#40fd51]" />
            </div>

            {/* Center dots between sections */}
            <div className="mt-8 flex justify-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-[#40fd51]" />
            </div>
          </div>
        </div>

        {/* SECTION: Our Vision */}
        <div className="relative mb-20 md:mb-24">
          {/* Title */}
          <h2 className="text-white text-2xl md:text-4xl font-medium tracking-tight mb-6 md:mb-8 text-center md:text-left">
            <span className="text-[#40fd51]">/</span> Our Vision
          </h2>

          {/* Vision Statement Box */}
          <div className="border border-white/40 bg-black/40 p-6 md:p-12 text-center rounded-sm">
            <p className="text-[#ededed] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-light">
              &quot;To create a consistent space where students can learn,
              apply, and improve their technical skills through practical
              experience and structured competition.&quot;
            </p>
          </div>
        </div>

        {/* SECTION: Event RoadMap */}
        <div className="text-center px-2">
          <h2 className="text-white text-2xl md:text-4xl font-medium tracking-tight mb-8 md:mb-12">
            <span className="text-[#40fd51]">/</span> Event RoadMap
          </h2>
          <div className="flex justify-center overflow-x-auto scrollbar-hide py-2">
            <Image
              src="/dsa_roadmap.svg"
              width={1000}
              height={600}
              className="w-full h-auto min-w-[600px] md:min-w-0 max-w-5xl"
              alt="DSA Roadmap"
            />
          </div>
        </div>

        {/* SECTION: Social Media Footer */}
        <div className="mt-24 md:mt-32 text-center pb-12 md:pb-20 px-4">
          <p className="text-white/60 text-base md:text-lg mb-8 max-w-xs md:max-w-none mx-auto">
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
