'use client';

import React, { useState, useEffect } from 'react';
import { Play, Music, ChevronDown } from 'lucide-react';
import BeatCard from '../components/BeatCard';

interface BeatRecord {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  slug?: string;
  whopProductIds: {
    basic: string;
    premium: string;
    unlimited: string;
  };
  prices: {
    basic: number;
    premium: number;
    unlimited: number;
  };
  licenses: {
    basic: string;
    premium: string;
    unlimited: string;
  };
  assets: {
    basicFiles: string[];
    premiumFiles: string[];
    unlimitedFiles: string[];
  };
  createdAt: string;
  listed?: boolean; // Add listed field
}

export default function Page() {
  const [beats, setBeats] = useState<BeatRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBeats();
  }, []);

  const fetchBeats = async () => {
    try {
      const response = await fetch('/api/save-beat');
      const data = await response.json();
      if (data.success) {
        // Only show beats that are listed
        const listedBeats = data.beats.filter((beat: BeatRecord) => beat.listed !== false);
        setBeats(listedBeats);
      }
    } catch (error) {
      console.error('Error fetching beats:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBeats = () => {
    const element = document.getElementById('beat-grid');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900 p-8" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
              <Music className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Professional Beat Store</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-linear-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Premium Quality Beats
              <br />
              for Professional Artists
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Instant download, professional quality, royalty-free beats for your next hit
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/upload"
                className="group relative px-8 py-4 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-600/25"
              >
                Upload Your Beat
              </a>
              <a
                href="/manage"
                className="group relative px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                Manage Beats
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={scrollToBeats}
              className="group relative px-8 py-4 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-600/25"
            >
              <span className="flex items-center gap-2">
                Browse Our Collection
                <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </span>
            </button>
            <a
              href="/upload"
              className="px-8 py-4 border border-gray-700 rounded-lg font-semibold text-lg hover:border-purple-500 hover:bg-purple-600/10 transition-all duration-300"
            >
              Sell Your Beats
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-500" />
        </div>
      </section>

      {/* Beat Grid Section */}
      <section id="beat-grid" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Available Beats</h2>
            <p className="text-xl text-gray-400">Click any beat to preview and purchase licenses</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : beats.length === 0 ? (
            <div className="text-center py-20">
              <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-400 mb-2">No beats available yet</h3>
              <p className="text-gray-500 mb-8">Be the first to upload a beat to the store</p>
              <a
                href="/upload"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
              >
                <Play className="w-4 h-4" />
                Upload Your First Beat
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {beats.map((beat) => (
                <BeatCard key={beat.id} beat={beat} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
