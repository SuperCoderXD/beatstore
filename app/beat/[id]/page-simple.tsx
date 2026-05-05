'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Play, ArrowLeft } from 'lucide-react';

interface BeatRecord {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  slug?: string;
  listed: boolean;
  createdAt: string;
}

const BeatPage = () => {
  const params = useParams();
  const beatId = params.id as string;
  const [beat, setBeat] = useState<BeatRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (beatId) {
      fetchBeat();
    }
  }, [beatId]);

  const fetchBeat = async () => {
    try {
      const response = await fetch('/api/save-beat');
      const data = await response.json();
      if (data.success) {
        const foundBeat = data.beats.find((b: BeatRecord) => b.id === beatId);
        setBeat(foundBeat || null);
      }
    } catch (error) {
      console.error('Error fetching beat:', error);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const getThumbnailUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!beat) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Beat not found</h1>
          <a href="/" className="text-purple-400 hover:text-purple-300">Return to store</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto p-8">
        {/* Back Button */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </a>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Artwork & Info */}
          <div>
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6">
              <img 
                src={getThumbnailUrl(beat.youtubeUrl)} 
                alt={beat.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{beat.title}</h1>
            <p className="text-gray-400 mb-6">TNC Rockstar</p>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Purchase Information</h3>
              <p className="text-gray-300 mb-4">
                To purchase this beat, contact us at: <strong>eddykenogo@gmail.com</strong>
              </p>
              <p className="text-gray-400 text-sm">
                We'll send you the beat files and license agreement via email.
              </p>
            </div>
          </div>

          {/* Right: YouTube Preview */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Preview</h2>
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <iframe
                src={getYouTubeEmbedUrl(beat.youtubeUrl)}
                title={beat.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            <div className="mt-6 bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">How to Purchase</h3>
              <ol className="space-y-2 text-gray-300">
                <li>1. Email us at eddykenogo@gmail.com</li>
                <li>2. Specify the beat title: "{beat.title}"</li>
                <li>3. We'll send payment instructions</li>
                <li>4. Receive beat files and license via email</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeatPage;
