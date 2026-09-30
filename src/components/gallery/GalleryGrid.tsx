'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const BUCKET = 'gallery';
const IMAGES_PER_FOLDER = 30;
const FOLDERS = [{ path: 'linux' }, { path: 'go' }] as const;

type GalleryImage = {
  name: string;
  url: string;
};

function shuffled<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function GalleryGrid() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadImages() {
      const results = await Promise.all(
        FOLDERS.map(async (folder) => {
          const { data, error: listError } = await supabase.storage
            .from(BUCKET)
            .list(folder.path, {
              limit: 1000,
              sortBy: { column: 'name', order: 'asc' },
            });

          if (listError) throw listError;

          return {
            path: folder.path,
            images: shuffled(
              (data ?? [])
                .filter((file) => /\.(webp|jpe?g|png)$/i.test(file.name))
                .map((file) => ({
                  name: file.name,
                  url: supabase.storage
                    .from(BUCKET)
                    .getPublicUrl(`${folder.path}/${file.name}`).data.publicUrl,
                }))
            ).slice(0, IMAGES_PER_FOLDER),
          };
        })
      );

      if (!active) return;

      setImages(shuffled(results.flatMap((result) => result.images)));
      setLoading(false);
    }

    loadImages().catch((loadError: Error) => {
      if (!active) return;
      setError(
        loadError.message ||
          'Unable to load the gallery images. Check the Storage list policy.'
      );
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-[1320px]">
      <p className="pt-[32px] text-center text-[18px] font-normal uppercase text-[#40fd51] sm:pt-[36px] sm:text-[20px]">
        Session Captured.
      </p>

      {error && (
        <p className="mx-auto mt-12 max-w-xl text-center text-[#ff9d89]">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="mt-[38px] grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
          {images.map((image) => (
            <div
              key={image.name}
              className="relative cursor-pointer aspect-[4/3] group overflow-hidden border border-[#124c29] bg-[#090b16]"
            >
              <Image
                src={image.url}
                alt={`Session capture ${image.name}`}
                fill
                sizes="(min-width: 1536px) 10vw, (min-width: 1024px) 16vw, 25vw"
                className="object-cover transition duration-300 group-hover:scale-[1.02]"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
