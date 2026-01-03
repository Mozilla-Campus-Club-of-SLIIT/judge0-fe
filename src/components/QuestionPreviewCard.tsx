import type { QuestionCardPreview } from '@/types/types';
import Link from 'next/link';

export default function QuestionPreviewCard({
  id,
  title,
  description,
}: Readonly<QuestionCardPreview>) {
  return (
    <div className="relative group">
      <div className="w-3 h-12 bg-primary absolute -left-3 top-14 -translate-y-1/2 " />
      <Link href={`/question/${id}`} className="question-card">
        <h1 className="question-card-title ">{title}</h1>

        <p className="question-card-description">{description}</p>
      </Link>
    </div>
  );
}
