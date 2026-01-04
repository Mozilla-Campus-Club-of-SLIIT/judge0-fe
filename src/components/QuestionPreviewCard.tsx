import type { QuestionCardPreview } from '@/types/types';
import Link from 'next/link';

export default function QuestionPreviewCard({
  id,
  title,
  description,
}: Readonly<QuestionCardPreview>) {
  return (
    <Link
      href={`/question/${id}`}
      className="flex flex-col justify-start bg-white shadow-lg rounded-xl p-5 hover:shadow-2xl transition-shadow duration-300 max-w-[450px] md:max-w-[400px] max-h-60 overflow-hidden border border-gray-100"
    >
      <h1 className="text-lg font-semibold truncate h-6">{title}</h1>

      <p className="text-gray-700 text-sm line-clamp-3 mt-2">{description}</p>
    </Link>
  );
}
