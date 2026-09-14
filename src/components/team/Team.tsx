type Member = {
  role: string;
  name: string;
  image?: string;
};

const coreMembers: Member[] = [
  { role: 'Lead', name: 'Gayathri Krishnaram' },
  { role: 'Dev', name: 'Heshan Thenura' },
  { role: 'Content', name: 'Tharinda Marasinghe' },
  { role: 'Marketing', name: 'Shazmina Oudeen' },
  { role: 'Coordinator', name: 'Virul Meemana' },
  { role: 'Coordinator', name: 'Sahnas Thufail' },
  { role: 'Coordinator', name: 'Ranindu Wathsal' },
];

const speakers: Member[] = [
  { role: 'N1: DSA', name: 'Seniru Pasan' },
  { role: 'N2: Linux', name: 'Bhanuka Bandara' },
  { role: 'N3: GO', name: 'Dasun Wickramasooriya' },
  { role: 'N4: IOT', name: 'Bishru Muhammadhu' },
];

function MemberCard({ member }: { member: Member }) {
  return (
    <article className="team-member relative w-full max-w-[190px]">
      <h2 className="mb-1 text-[25px] font-normal leading-[1.15] text-[#c8ffd0] sm:text-[27px]">
        {member.role}
      </h2>
      <div className="relative overflow-visible border-x border-t border-[#40fd51] bg-[#080b15]">
        <div className="flex h-[210px] items-end justify-center bg-[linear-gradient(to_top,#003b16_0%,#07131a_45%,#080b15_100%)] px-2 pt-3">
          {member.image ? (
            <Image
              src={member.image}
              alt={member.name}
              width={176}
              height={210}
              className="h-full w-full object-contain object-bottom"
            />
          ) : null}
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[45px] left-[-1px] h-[46px] w-px bg-gradient-to-b from-[#124d2b] to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[45px] right-[-1px] h-[46px] w-px bg-gradient-to-b from-[#124d2b] to-transparent"
        />
      </div>
      <p className="relative mt-[8px] min-h-[37px] px-1 py-2 text-center text-[13px] font-normal leading-tight text-white sm:text-[14px]">
        {member.name}
      </p>
    </article>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h1 className="flex items-baseline justify-center gap-2 text-center text-[46px] font-semibold leading-none tracking-[-1.8px] sm:text-[56px]">
      <span className="font-mono font-bold italic text-[#40fd51]">/</span>
      <span>{children}</span>
    </h1>
  );
}

export default function Team() {
  const [lead, ...members] = coreMembers;

  return (
    <main className="team-page px-5 pb-24 text-white sm:px-8">
      <p className="pt-[57px] text-center text-[17px] uppercase text-[#40fd51] sm:pt-[59px] sm:text-[18px]">
        {'//Phase 01'}
      </p>

      <section className="mx-auto mt-[47px] w-full max-w-[910px]">
        <SectionTitle>Codenight Core</SectionTitle>

        <div className="mt-[83px] flex justify-center">
          <MemberCard member={lead} />
        </div>

        <div className="mx-auto mt-[93px] grid max-w-[910px] grid-cols-1 justify-items-center gap-x-[76px] gap-y-[55px] sm:grid-cols-3">
          {members.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-[119px] w-full max-w-[1120px]">
        <SectionTitle>Session Speakers</SectionTitle>

        <div className="mx-auto mt-[80px] grid grid-cols-1 justify-items-center gap-x-[72px] gap-y-[55px] sm:grid-cols-2 lg:grid-cols-4">
          {speakers.map((member) => (
            <MemberCard key={member.name} member={member} />
          ))}
        </div>
      </section>
    </main>
  );
}
import Image from 'next/image';
