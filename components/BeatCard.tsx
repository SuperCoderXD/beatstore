'use client';

import React from 'react';
import Link from 'next/link';

interface BeatRecord {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  slug?: string;
}

interface BeatCardProps {
  beat: BeatRecord;
}

// Extract YouTube thumbnail
const getThumbnailUrl = (youtubeUrl: string) => {
  const videoId = youtubeUrl.split('v=')[1]?.split('&')[0];
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
};

const BeatCard: React.FC<BeatCardProps> = ({ beat }) => {
  const thumbnailUrl = beat.thumbnailUrl || getThumbnailUrl(beat.youtubeUrl);
  const beatUrl = `/beat/${beat.id}`;

  return (
    <Link href={beatUrl} className="block group">
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/20">
        {/* YouTube Thumbnail */}
        <div className="aspect-video relative overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={beat.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback if thumbnail fails to load
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/320x180/1a1a1a/ffffff?text=Beat+Artwork';
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300">
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Beat Title */}
        <div className="p-4">
          <h3 className="text-white font-medium text-sm leading-tight line-clamp-2 group-hover:text-purple-400 transition-colors">
            {beat.title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default BeatCard;
