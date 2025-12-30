'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Music, DollarSign, ExternalLink, AlertTriangle, FileText, Settings, Check } from 'lucide-react';
import Link from 'next/link';

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

export default function ManageBeats() {
  const [beats, setBeats] = useState<BeatRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [listing, setListing] = useState<string | null>(null);

  useEffect(() => {
    fetchBeats();
  }, []);

  const fetchBeats = async () => {
    try {
      const response = await fetch('/api/save-beat');
      const data = await response.json();
      if (data.success) {
        setBeats(data.beats);
      }
    } catch (error) {
      console.error('Failed to fetch beats:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBeat = async (beatId: string, whopProductIds: BeatRecord['whopProductIds']) => {
    if (!confirm('Are you sure you want to delete this beat? This will also attempt to delete the Whop products.')) {
      return;
    }

    setDeleting(beatId);
    
    try {
      const response = await fetch('/api/delete-beat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beatId,
          whopProductIds
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setBeats(beats.filter(beat => beat.id !== beatId));
        alert(`Beat deleted successfully!${result.deletedProducts ? ` ${result.deletedProducts.length} Whop products deleted.` : ''}`);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to delete beat:', error);
      alert('Failed to delete beat');
    } finally {
      setDeleting(null);
    }
  };

  const listBeat = async (beatId: string) => {
    setListing(beatId);
    
    try {
      const response = await fetch('/api/list-beat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ beatId })
      });

      const result = await response.json();
      
      if (result.success) {
        // Update the beat's listed status in the local state
        setBeats(beats.map(beat => 
          beat.id === beatId 
            ? { ...beat, listed: true }
            : beat
        ));
        alert('Beat listed successfully! It will now appear in the store.');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to list beat:', error);
      alert('Failed to list beat');
    } finally {
      setListing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading beats...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Manage Beats</h1>
              <p className="text-gray-300">View and delete your beat listings</p>
            </div>
            
            <Link
              href="/manage/license-terms"
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
            >
              <Settings className="w-4 h-4" />
              License Terms
            </Link>
          </div>
        </div>

        {beats.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">No beats found</h3>
            <p className="text-gray-500">Upload some beats to see them here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {beats.map((beat) => (
              <div key={beat.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-start gap-4">
                  {beat.thumbnailUrl && (
                    <img
                      src={beat.thumbnailUrl}
                      alt={beat.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  )}
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{beat.title}</h3>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <a
                        href={beat.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        YouTube
                      </a>
                      <span className="text-gray-400 text-sm">
                        Created: {new Date(beat.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-900 rounded p-3">
                        <div className="text-green-400 font-semibold">Basic</div>
                        <div className="text-white">${beat.prices.basic}</div>
                        <div className="text-gray-400 text-xs truncate">{beat.whopProductIds.basic}</div>
                      </div>
                      <div className="bg-gray-900 rounded p-3">
                        <div className="text-blue-400 font-semibold">Premium</div>
                        <div className="text-white">${beat.prices.premium}</div>
                        <div className="text-gray-400 text-xs truncate">{beat.whopProductIds.premium}</div>
                      </div>
                      <div className="bg-gray-900 rounded p-3">
                        <div className="text-purple-400 font-semibold">Unlimited</div>
                        <div className="text-white">${beat.prices.unlimited}</div>
                        <div className="text-gray-400 text-xs truncate">{beat.whopProductIds.unlimited}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <DollarSign className="w-4 h-4" />
                      Files: {beat.assets.basicFiles.length} basic, {beat.assets.premiumFiles.length} premium, {beat.assets.unlimitedFiles.length} unlimited
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {/* List Button */}
                    {beat.listed ? (
                      <button
                        disabled
                        className="bg-green-600 text-white p-3 rounded-lg flex items-center gap-2 cursor-not-allowed opacity-75"
                      >
                        <Check className="w-4 h-4" />
                        Listed
                      </button>
                    ) : (
                      <button
                        onClick={() => listBeat(beat.id)}
                        disabled={listing === beat.id}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white p-3 rounded-lg transition flex items-center gap-2"
                      >
                        {listing === beat.id ? 'Listing...' : 'List Beat'}
                      </button>
                    )}
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteBeat(beat.id, beat.whopProductIds)}
                      disabled={deleting === beat.id}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white p-3 rounded-lg transition flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      {deleting === beat.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div className="text-sm text-yellow-300">
              <strong>Note:</strong> Deleting a beat will remove it from your storefront and attempt to delete the associated Whop products. This action cannot be undone.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
