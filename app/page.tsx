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
    <div className="min-h-screen bg-black text-white bg-pattern">

      {/* Header */}
      <header className="border-b border-zinc-900 bg-black/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* Logo */}
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-1">
            <span className="text-gradient">wise</span>
            <span className="text-white font-light">beats</span>
            {/* subtle blue dot accent */}
            <span
              className="w-1.5 h-1.5 rounded-full bg-sky-400 ml-0.5 mt-1 inline-block"
              style={{ boxShadow: '0 0 8px rgba(56,189,248,0.8)' }}
            />
          </h1>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowAbout(true)}
              className="text-zinc-400 hover:text-white transition-colors font-medium text-sm tracking-wide uppercase"
            >
              About
            </button>
            
            <a
              href="https://www.instagram.com/wisemadethat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-zinc-950 border border-sky-500/30 hover:border-sky-400/70 hover:bg-zinc-900 px-5 py-2.5 rounded-xl font-semibold transition-all text-sky-300 hover:text-sky-200 glow-blue-sm"
            >
              <Instagram size={16} />
              <span className="text-sm">Instant Replies</span>
            </a>
          </div>
        </div>
      </header>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/96 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 rounded-2xl p-8 max-w-md w-full border border-sky-900/30 shadow-2xl">
            <div className="text-center mb-6">
              <img
                src="/images/profilepic.jpg"
                alt="Wise Beats"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg glow-blue"
              />
              <h2 className="text-3xl font-bold mb-1 text-gradient">Wise Beats</h2>
              <p className="text-zinc-500 mb-1 text-sm font-mono uppercase tracking-widest">Premium Afro R&B Production</p>
              <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                Young producer & songwriter from Kenya crafting soulful, cinematic Afro R&B instrumentals.
              </p>
              
              <a
                href="https://www.youtube.com/@wisemadethat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors font-semibold text-sm"
              >
                <Youtube size={18} />
                Visit YouTube Channel
              </a>
            </div>
            <button
              onClick={() => setShowAbout(false)}
              className="w-full bg-zinc-900 hover:bg-zinc-800 border border-sky-900/30 py-3 rounded-xl transition-colors font-semibold text-sm"
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
            alt="Wise Beats Banner"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay with subtle blue tint at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
          {/* Blue atmospheric light bleed */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-32 blur-3xl"
            style={{ background: 'radial-gradient(ellipse, rgba(56,189,248,0.12) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative w-full py-28 flex items-center justify-center">
          <div className="text-center px-4">
            {/* Eyebrow label */}
            <p className="text-sky-400 font-mono text-xs uppercase tracking-[0.3em] mb-5">
              Premium Afro R&B Production
            </p>
            <h2 className="text-5xl md:text-7xl font-bold mb-5 leading-none tracking-tight">
              <span className="text-white">Sound that</span>
              <br />
              <span className="text-gradient">moves souls.</span>
            </h2>
            <p className="text-zinc-400 text-base font-medium tracking-wider">
              High Quality &nbsp;·&nbsp; Instant Delivery &nbsp;·&nbsp; Exclusive Licenses
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto px-6 -mt-6 relative z-10">
        <div className="relative group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-sky-400 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Search beats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-2xl pl-13 pr-6 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-sky-500/60 transition-all font-medium text-sm"
            style={{ paddingLeft: '3.25rem' }}
          />
        </div>
      </div>

      {/* Latest Beat Showcase */}
      {latestBeat && !searchQuery && (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-8">
            <span
              className="w-2 h-2 rounded-full bg-sky-400"
              style={{ boxShadow: '0 0 10px rgba(56,189,248,0.9)' }}
            />
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400">Latest Drop</h2>
          </div>

          <div
            onClick={() => handleBeatClick(latestBeat.id)}
            className="bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 hover:border-sky-500/30 transition-all cursor-pointer group card-hover shadow-2xl"
          >
            <div className="grid md:grid-cols-2 gap-0">
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={latestBeat.thumbnailUrl || getThumbnailUrl(latestBeat.youtubeUrl)}
                  alt={latestBeat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-sky-400/20 border border-sky-400/50 flex items-center justify-center backdrop-blur-sm glow-blue">
                    <Play className="w-6 h-6 text-sky-300 ml-1" />
                  </div>
                </div>
                {/* Blue glow bleed on right edge */}
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent to-zinc-950/80" />
              </div>

              {/* Info */}
              <div className="flex flex-col justify-between p-8 md:p-10">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-sky-400/70 mb-3">New Release</p>
                  <h3 className="text-3xl font-bold mb-8 leading-tight">{latestBeat.title}</h3>

                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {[
                      { label: 'Basic', price: latestBeat.prices.basic },
                      { label: 'Premium', price: latestBeat.prices.premium },
                      { label: 'Unlimited', price: latestBeat.prices.unlimited },
                    ].map(({ label, price }) => (
                      <div key={label} className="bg-black/60 border border-zinc-800 rounded-xl px-4 py-3">
                        <p className="text-xs text-zinc-600 uppercase tracking-wider mb-1 font-mono">{label}</p>
                        <p className="text-xl font-bold text-gradient">${price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="bg-white text-black hover:bg-sky-50 py-4 rounded-xl font-bold text-sm tracking-wide transition-all w-full">
                  View & Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Beats Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center gap-3 mb-8">
          <span
            className="w-2 h-2 rounded-full bg-sky-400"
            style={{ boxShadow: '0 0 10px rgba(56,189,248,0.9)' }}
          />
          <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-400">
            {searchQuery
              ? `Results (${filteredBeats.length})`
              : 'All Beats'}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-zinc-900 border-t-sky-400" />
              <div className="absolute inset-0 rounded-full bg-sky-400/10 blur-xl" />
            </div>
          </div>
        ) : filteredBeats.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-zinc-600 text-lg font-medium">No beats found for "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBeats.map((beat) => (
              <div
                key={beat.id}
                onClick={() => handleBeatClick(beat.id)}
                className="bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-sky-500/30 transition-all cursor-pointer group card-hover"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={beat.thumbnailUrl || getThumbnailUrl(beat.youtubeUrl)}
                    alt={beat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-sky-400/20 border border-sky-400/40 flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-4 h-4 text-sky-300 ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-base mb-4 truncate text-white/90">{beat.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-600 text-xs font-mono uppercase tracking-wider">from</span>
                    <span className="text-2xl font-bold text-gradient">${beat.prices.basic}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg text-gradient">wise</span>
            <span className="font-light text-lg text-white">beats</span>
            <span
              className="w-1.5 h-1.5 rounded-full bg-sky-400 ml-0.5"
              style={{ boxShadow: '0 0 8px rgba(56,189,248,0.8)' }}
            />
          </div>
          <p className="text-zinc-600 text-xs font-mono tracking-wider">
            © 2026 Wise Beats · Instant delivery · Professional quality · Secure checkout
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BeatStore;