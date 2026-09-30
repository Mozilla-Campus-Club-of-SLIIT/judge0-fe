import Link from 'next/link';
import GalleryGrid from '@/components/gallery/GalleryGrid';

const sessions = [
  { name: 'N1 : DSA', url: '#n1-dsa' },
  {
    name: 'N2 : Linux',
    url: 'https://drive.google.com/drive/folders/1CmAGhIeWQoCVdGHY3SH7OHPrBmqJe07T?usp=drive_link',
  },
  {
    name: 'N3 : GO',
    url: 'https://drive.google.com/drive/folders/1ZRp28fPFtwqhuevInIsHXPs-qhuMn-Kn?usp=drive_link',
  },
  { name: 'N4 : IOT', url: '#n4-iot' },
];

export default function Gallery() {
  return (
    <main className="gallery-page px-5 pb-24 text-white sm:px-8">
      <GalleryGrid />

      <section className="mx-auto mt-[105px] w-full max-w-[994px]">
        <h1 className="flex items-baseline justify-center gap-2 text-[40px] font-semibold leading-none tracking-[-1.5px] sm:text-[48px]">
          <span className="font-mono font-bold italic text-[#40fd51]">/</span>
          <span>Session Albums</span>
        </h1>

        <div className="mt-[70px] flex flex-col gap-[47px]">
          {sessions.map((session) => (
            <article
              key={session.name}
              className="flex min-h-[70px] items-center justify-between border border-[#40fd51] px-10 py-3 sm:px-[41px]"
            >
              <h2 className="text-[21px] font-normal tracking-[-0.3px] sm:text-[23px]">
                {session.name}
              </h2>
              <Link
                href={session.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[44px] w-[192px] items-center justify-center border border-[#40fd51] text-[18px] font-semibold uppercase text-[#40fd51] transition-colors hover:bg-[#40fd51] hover:text-[#070916] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#40fd51] sm:w-[192px]"
              >
                Click Here
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
