'use client';

import type { QuestionCardPreview } from '@/types/types.ts';
import { useEffect, useState } from 'react';
import { fetchQuestionsPreview } from '@/utils/fetchQuestions';
import QuestionPreviewCard from './QuestionPreviewCard';

export default function QuestionPreviewCardContainer() {
  const [questions, setQuestions] = useState<QuestionCardPreview[] | null>(
    null
  );

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchQuestionsPreview();
        console.log(data);

        setQuestions(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (!questions) loadQuestions();
  }, [questions]);

  return (
    <div className="flex justify-center items-center w-full">
      <div className="grid justify-center md:grid-cols-3 gap-6 px-4 py-6">
        {questions ? (
          questions.map((q) => (
            <QuestionPreviewCard
              key={q.id}
              id={q.id}
              title={q.title}
              description={q.description}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">Loading...</p>
        )}
      </div>
    </div>
  );
}
