'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Heart, Repeat, Plus, Share, Download, ChevronUp, Mic, Radio, Video, Music, Globe, Headphones, Play, ArrowLeft } from 'lucide-react';

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
  whopPurchaseUrls?: {
    basic?: string;
    premium?: string;
    unlimited?: string;
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
}

const BeatPage = () => {
  const params = useParams();
  const beatId = params.id as string;
  const [beat, setBeat] = useState<BeatRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLicense, setSelectedLicense] = useState('basic');

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

  const licenses = [
    { 
      id: 'basic', 
      title: 'Basic License', 
      price: beat?.prices.basic || 0, 
      formats: 'MP3',
      terms: [
        { icon: <Mic size={18}/>, text: 'USED FOR MUSIC RECORDING' },
        { icon: <Headphones size={18}/>, text: 'DISTRIBUTE UP TO 2,000 COPIES' },
        { icon: <Globe size={18}/>, text: '500,000 ONLINE AUDIO STREAMS' },
        { icon: <Video size={18}/>, text: '1 MUSIC VIDEO' },
        { icon: <Music size={18}/>, text: 'FOR PROFIT LIVE PERFORMANCES' },
        { icon: <Radio size={18}/>, text: 'RADIO BROADCASTING (2 STATIONS)' }
      ]
    },
    {
      id: 'premium',
      title: 'Premium License',
      price: beat?.prices.premium || 0,
      formats: 'MP3 + WAV',
      terms: [
        { icon: <Mic size={18}/>, text: 'USED FOR MUSIC RECORDING' },
        { icon: <Headphones size={18}/>, text: 'DISTRIBUTE UP TO 5,000 COPIES' },
        { icon: <Globe size={18}/>, text: '2,000,000 ONLINE AUDIO STREAMS' },
        { icon: <Video size={18}/>, text: '2 MUSIC VIDEOS' },
        { icon: <Music size={18}/>, text: 'FOR PROFIT LIVE PERFORMANCES' },
        { icon: <Radio size={18}/>, text: 'RADIO BROADCASTING (ALL STATIONS)' }
      ]
    },
    {
      id: 'unlimited',
      title: 'Unlimited License',
      price: beat?.prices.unlimited || 0,
      formats: 'MP3 + WAV + STEMS',
      terms: [
        { icon: <Mic size={18}/>, text: 'USED FOR MUSIC RECORDING' },
        { icon: <Headphones size={18}/>, text: 'DISTRIBUTE UNLIMITED COPIES' },
        { icon: <Globe size={18}/>, text: 'UNLIMITED ONLINE AUDIO STREAMS' },
        { icon: <Video size={18}/>, text: 'UNLIMITED MUSIC VIDEOS' },
        { icon: <Music size={18}/>, text: 'FOR PROFIT LIVE PERFORMANCES' },
        { icon: <Radio size={18}/>, text: 'RADIO BROADCASTING (ALL STATIONS)' }
      ]
    },
  ];

  const currentLicense = licenses.find(l => l.id === selectedLicense);

  const handlePurchase = (licenseType: string) => {
    if (beat) {
      const purchaseUrl = beat.whopPurchaseUrls?.[licenseType as keyof typeof beat.whopPurchaseUrls];
      if (purchaseUrl) {
        console.log(`Redirecting to checkout: ${purchaseUrl}`);
        window.location.href = purchaseUrl;
      } else {
        // Fallback to product URL if no purchase URL
        const productId = beat.whopProductIds[licenseType as keyof typeof beat.whopProductIds];
        console.log(`No purchase URL found, trying product URL: https://whop.com/products/${productId}`);
        window.location.href = `https://whop.com/products/${productId}`;
      }
    }
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
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Main Content - Centered */}
      <div className="max-w-4xl mx-auto p-8">
        {/* Back Button - Positioned to the Left */}
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </a>
        </div>

        {/* YouTube Embed - Smaller */}
        <div className="mb-6">
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden" style={{ maxHeight: '400px' }}>
            <iframe
              src={getYouTubeEmbedUrl(beat.youtubeUrl)}
              title={beat.title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Beat Title and Purchase Button - Side by Side */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-1">{beat.title}</h1>
            <p className="text-gray-400">TNC Rockstar</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-base font-medium">Instant Delivery 🌐</span>
            <button 
              onClick={() => handlePurchase(selectedLicense)}
              className="bg-blue-600 hover:bg-blue-700 border-2 border-blue-500 px-10 py-4 rounded-lg font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Licensing Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Licensing</h2>

          {/* License Grid with Proper Blue Highlight */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {licenses.map((license) => (
              <div
                key={license.id}
                onClick={() => setSelectedLicense(license.id)}
                className={`p-5 rounded-lg cursor-pointer transition-all ${
                  selectedLicense === license.id 
                  ? 'border-4 border-blue-500 bg-blue-950 shadow-2xl shadow-blue-500/50 ring-2 ring-blue-400' 
                  : 'border-2 border-gray-800 bg-gray-900 hover:border-gray-700'
                }`}
              >
                <h3 className="font-bold text-base mb-2">{license.title}</h3>
                <p className="text-xl font-bold mb-1">${license.price}</p>
                <p className="text-xs text-gray-500 uppercase">{license.formats}</p>
              </div>
            ))}
          </div>

          {/* Usage Terms */}
          <div className="border-t border-gray-900 pt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Usage Terms</h2>
            </div>
            
            <p className="font-bold mb-8">{currentLicense?.title} (${currentLicense?.price})</p>

            <div className="grid grid-cols-3 gap-x-8 gap-y-10">
              {currentLicense?.terms.map((term, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-gray-600">{term.icon}</span>
                  <span className="text-[11px] font-semibold tracking-wide uppercase leading-tight text-gray-300">
                    {term.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeatPage;
