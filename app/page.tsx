'use client';

import React, { useState, useEffect } from 'react';
import { Search, Play, Instagram, Youtube } from 'lucide-react';

interface BeatRecord {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  prices: {
    basic: number;
    premium: number;
    unlimited: number;
  };
  whopProductIds: {
    basic: string;
    premium: string;
    unlimited: string;
  };
}

const BeatStore = () => {
  const [beats, setBeats] = useState<BeatRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    fetchBeats();
  }, []);

  const fetchBeats = async () => {
    try {
      const response = await fetch('/api/save-beat');
      const data = await response.json();
      if (data.success) {
        // Only show listed beats
        const listedBeats = data.beats.filter((beat: any) => beat.listed === true);
        setBeats(listedBeats);
      }
    } catch (error) {
      console.error('Error fetching beats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getThumbnailUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

  const filteredBeats = beats.filter(beat =>
    beat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBeatClick = (beatId: string) => {
    window.location.href = `/beat/${beatId}`;
  };

  const latestBeat = beats[0];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-900 bg-black/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-gradient">TNC</span>
            <span className="text-white ml-2">Rockstar</span>
          </h1>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowAbout(true)}
              className="text-zinc-400 hover:text-white transition-colors font-medium"
            >
              About
            </button>
            <a
              href="https://www.instagram.com/tncrockstar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-linear-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:via-red-400 hover:to-red-500 px-5 py-2.5 rounded-xl font-semibold transition-all glow-red"
            >
              <Instagram size={18} />
              Instant Replies 📩
            </a>
          </div>
        </div>
      </header>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 rounded-2xl p-8 max-w-md w-full border-2 border-red-900/30 shadow-2xl">
            <div className="text-center mb-6">
              <img 
                src="/images/profilepic.jpg" 
                alt="TNC Rockstar" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg glow-red"
              />
              <h2 className="text-3xl font-bold mb-2 text-gradient">TNC Rockstar</h2>
              <p className="text-zinc-400 mb-6 font-medium">Hip Hop Producer</p>
              <a
                href="https://www.youtube.com/@tncrockstar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors font-semibold"
              >
                <Youtube size={20} />
                Visit My YouTube Channel
              </a>
            </div>
            <button
              onClick={() => setShowAbout(false)}
              className="w-full bg-zinc-900 hover:bg-zinc-800 border border-red-900/30 py-3 rounded-xl transition-colors font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/banner.jpg" 
            alt="TNC Rockstar Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black"></div>
        </div>
        <div className="relative w-full py-24 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-6xl font-bold mb-4 text-gradient">Iconic Beats to Make History.</h2>
            <p className="text-xl text-zinc-300 font-medium tracking-wide">High Quality • Instant Delivery</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors" size={22} />
          <input
            type="text"
            placeholder="Search beats by name or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 backdrop-blur-xl border-2 border-zinc-900 rounded-2xl pl-14 pr-6 py-5 text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:glow-red transition-all font-medium"
          />
        </div>
      </div>

      {/* Latest Beat Showcase */}
      {latestBeat && !searchQuery && (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="text-gradient">🔥 Latest Drop</span>
          </h2>
          <div className="bg-zinc-950 rounded-3xl overflow-hidden border-2 border-red-900/20 hover:border-red-600/50 transition-all cursor-pointer group card-hover shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl ring-2 ring-red-900/20">
                <img
                  src={latestBeat.thumbnailUrl || getThumbnailUrl(latestBeat.youtubeUrl)}
                  alt={latestBeat.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-red-950/20 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-20 h-20 text-white drop-shadow-lg" />
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-4xl font-bold mb-6 leading-tight">{latestBeat.title}</h3>
                  <div className="flex gap-4 mb-8">
                    <div className="bg-zinc-900 border border-red-900/30 rounded-xl px-5 py-3 flex-1">
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1 font-semibold">Basic</p>
                      <p className="text-2xl font-bold text-gradient">${latestBeat.prices.basic}</p>
                    </div>
                    <div className="bg-zinc-900 border border-red-900/30 rounded-xl px-5 py-3 flex-1">
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1 font-semibold">Premium</p>
                      <p className="text-2xl font-bold text-gradient">${latestBeat.prices.premium}</p>
                    </div>
                    <div className="bg-zinc-900 border border-red-900/30 rounded-xl px-5 py-3 flex-1">
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1 font-semibold">Unlimited</p>
                      <p className="text-2xl font-bold text-gradient">${latestBeat.prices.unlimited}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleBeatClick(latestBeat.id)}
                  className="bg-linear-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 py-5 rounded-xl font-bold text-lg transition-all w-full shadow-lg hover:shadow-red-600/50"
                >
                  View & Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Beats Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8">
          {searchQuery ? (
            <span>
              Search Results <span className="text-gradient">({filteredBeats.length})</span>
            </span>
          ) : (
            <span className="text-gradient">All Beats</span>
          )}
        </h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-zinc-900 border-t-red-600"></div>
              <div className="absolute inset-0 rounded-full bg-red-600/20 blur-xl"></div>
            </div>
          </div>
        ) : filteredBeats.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-zinc-400 text-xl font-medium">No beats found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBeats.map((beat) => (
              <div
                key={beat.id}
                onClick={() => handleBeatClick(beat.id)}
                className="bg-zinc-950 rounded-2xl overflow-hidden border-2 border-red-900/20 hover:border-red-600/50 transition-all cursor-pointer group card-hover shadow-xl"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={beat.thumbnailUrl || getThumbnailUrl(beat.youtubeUrl)}
                    alt={beat.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-red-950/20 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-14 h-14 text-white drop-shadow-lg" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-xl mb-4 truncate">{beat.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-sm font-semibold uppercase tracking-wider">From</span>
                    <span className="text-3xl font-bold text-gradient">${beat.prices.basic}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 mt-32 bg-black/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p className="text-zinc-400 font-medium">© 2026 TNC Rockstar. All rights reserved.</p>
          <p className="mt-3 text-sm text-zinc-500 font-mono">
            Instant delivery • Professional quality • Secure checkout
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BeatStore;