'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Music, DollarSign, ExternalLink, AlertTriangle, FileText, Settings, Check, LogOut, Copy, Eye } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../components/AuthProvider';
import AuthGuard from '../components/AuthGuard';
import { generateContentForBeats, formatAllBeatsForCopyPaste, type BeatContentData } from '../../lib/beat-content-generator';

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
  const { logout } = useAuth();
  const [beats, setBeats] = useState<BeatRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [listing, setListing] = useState<string | null>(null);
  const [generatingContent, setGeneratingContent] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [beatsContent, setBeatsContent] = useState<BeatContentData[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);

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

  const generateContentForAllBeats = async () => {
    setGeneratingContent(true);
    try {
      const content = await generateContentForBeats(beats);
      setBeatsContent(content);
      setShowContentModal(true);
    } catch (error) {
      console.error('Failed to generate content:', error);
      alert('Failed to generate content for beats');
    } finally {
      setGeneratingContent(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy to clipboard');
    }
  };

  const copyAllContent = () => {
    const allContent = formatAllBeatsForCopyPaste(beatsContent);
    copyToClipboard(allContent);
  };

  const needsManualSetup = (beat: BeatRecord) => {
    // Check if any Whop product IDs are missing or empty
    return !beat.whopProductIds.basic || !beat.whopProductIds.premium || !beat.whopProductIds.unlimited ||
           beat.whopProductIds.basic === '' || beat.whopProductIds.premium === '' || beat.whopProductIds.unlimited === '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading beats...</div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Manage Beats</h1>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 px-4 py-2 rounded-lg transition-colors text-white"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Manage Beats</h1>
              <p className="text-gray-300">View and delete your beat listings</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={generateContentForAllBeats}
                disabled={generatingContent || beats.length === 0}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 px-4 py-2 rounded-lg text-white font-medium transition-colors"
              >
                <FileText className="w-4 h-4" />
                {generatingContent ? 'Generating...' : 'Generate Content'}
              </button>
              
              <Link
                href="/manage/license-terms"
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
              >
                <Settings className="w-4 h-4" />
                License Terms
              </Link>
            </div>
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
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white">{beat.title}</h3>
                      {needsManualSetup(beat) && (
                        <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Manual Setup Needed
                        </span>
                      )}
                    </div>
                    
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

        {/* Content Modal */}
        {showContentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white">Generated Content for Whop Products</h2>
                <button
                  onClick={() => setShowContentModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="mb-4">
                  <button
                    onClick={copyAllContent}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    {copySuccess ? 'Copied!' : 'Copy All Content'}
                  </button>
                </div>
                
                <div className="space-y-6">
                  {beatsContent.map((beat, index) => (
                    <div key={beat.beatId} className="bg-gray-900 rounded-lg p-4">
                      <h3 className="text-lg font-bold text-white mb-4">{beat.beatTitle}</h3>
                      
                      <div className="space-y-4">
                        {/* Basic License */}
                        <div className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-semibold text-green-400 mb-2">Basic License</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-400">Title:</span>
                              <span className="text-white ml-2">{beat.basic.title}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Headline:</span>
                              <span className="text-white ml-2">{beat.basic.headline}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Description:</span>
                              <div className="text-white mt-1 whitespace-pre-wrap bg-gray-800 p-2 rounded">
                                {beat.basic.description}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Premium License */}
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-semibold text-blue-400 mb-2">Premium License</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-400">Title:</span>
                              <span className="text-white ml-2">{beat.premium.title}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Headline:</span>
                              <span className="text-white ml-2">{beat.premium.headline}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Description:</span>
                              <div className="text-white mt-1 whitespace-pre-wrap bg-gray-800 p-2 rounded">
                                {beat.premium.description}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Unlimited License */}
                        <div className="border-l-4 border-purple-500 pl-4">
                          <h4 className="font-semibold text-purple-400 mb-2">Unlimited License</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-400">Title:</span>
                              <span className="text-white ml-2">{beat.unlimited.title}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Headline:</span>
                              <span className="text-white ml-2">{beat.unlimited.headline}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Description:</span>
                              <div className="text-white mt-1 whitespace-pre-wrap bg-gray-800 p-2 rounded">
                                {beat.unlimited.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
