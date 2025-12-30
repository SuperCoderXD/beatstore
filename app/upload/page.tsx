'use client';

import React, { useState } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';

const UploadPage = () => {
  const [uploadData, setUploadData] = useState({
    title: '',
    youtubeUrl: '',
    basicPrice: 0,
    premiumPrice: 0,
    unlimitedPrice: 0,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedBeats, setUploadedBeats] = useState<any[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUploadData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createWhopProduct = async (name: string, price: number, licenseType: string) => {
    const response = await fetch('/api/create-whop-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        price,
        license: '', // Empty - you'll add manually
        licenseType,
        redirectUrl: `${window.location.origin}/thank-you?beatId=beat_${Date.now()}&license=${licenseType}&status=success`,
        askQuestions: true // Enable buyer name collection
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create Whop product');
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create Whop products for each license type
      const products = await Promise.all([
        createWhopProduct(uploadData.title, uploadData.basicPrice, 'basic'),
        createWhopProduct(uploadData.title, uploadData.premiumPrice, 'premium'),
        createWhopProduct(uploadData.title, uploadData.unlimitedPrice, 'unlimited')
      ]);

      setUploadProgress(25);

      // Generate a unique beat ID
      const beatId = `beat_${Date.now()}`;

      setUploadProgress(50);

      // Save basic beat data (without files)
      const beatPayload = {
        title: uploadData.title,
        youtubeUrl: uploadData.youtubeUrl,
        whopProductIds: {
          basic: products[0].id,
          premium: products[1].id,
          unlimited: products[2].id
        },
        whopPurchaseUrls: {
          basic: products[0].purchase_url,
          premium: products[1].purchase_url,
          unlimited: products[2].purchase_url
        },
        prices: {
          basic: uploadData.basicPrice,
          premium: uploadData.premiumPrice,
          unlimited: uploadData.unlimitedPrice
        },
        licenses: {
          basic: '', // Empty - you'll add manually
          premium: '', // Empty - you'll add manually
          unlimited: '', // Empty - you'll add manually
        },
        assets: {
          basicFiles: [], // Empty - you'll add manually
          premiumFiles: [], // Empty - you'll add manually
          unlimitedFiles: [], // Empty - you'll add manually
        },
        listed: false // Not listed yet - waiting for your confirmation
      };

      // Save beat data
      const saveResponse = await fetch('/api/save-beat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(beatPayload)
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save beat data');
      }

      setUploadProgress(75);

      // Add to uploaded beats list
      const newBeat = {
        id: beatId,
        title: uploadData.title,
        youtubeUrl: uploadData.youtubeUrl,
        prices: {
          basic: uploadData.basicPrice,
          premium: uploadData.premiumPrice,
          unlimited: uploadData.unlimitedPrice
        },
        whopProductIds: {
          basic: products[0].id,
          premium: products[1].id,
          unlimited: products[2].id
        },
        whopPurchaseUrls: {
          basic: products[0].purchase_url,
          premium: products[1].purchase_url,
          unlimited: products[2].purchase_url
        },
        listed: false
      };

      setUploadedBeats(prev => [newBeat, ...prev]);
      setUploadProgress(100);

      // Reset form
      setUploadData({
        title: '',
        youtubeUrl: '',
        basicPrice: 0,
        premiumPrice: 0,
        unlimitedPrice: 0,
      });

      alert('Beat created! Now add files and licenses manually in Whop, then click "List Beat" below.');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const listBeat = async (beatId: string) => {
    try {
      const response = await fetch('/api/list-beat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ beatId })
      });

      if (!response.ok) {
        throw new Error('Failed to list beat');
      }

      // Update the beat's listed status
      setUploadedBeats(prev => 
        prev.map(beat => 
          beat.id === beatId 
            ? { ...beat, listed: true }
            : beat
        )
      );

      alert('Beat listed successfully! It will now appear in the store.');
    } catch (error) {
      console.error('Failed to list beat:', error);
      alert('Failed to list beat. Please try again.');
    }
  };

  const PriceInputSection = ({ 
    title, 
    licenseType, 
    price 
  }: { 
    title: string; 
    licenseType: 'basic' | 'premium' | 'unlimited'; 
    price: number;
  }) => (
    <div className="bg-gray-900 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Price ($)</label>
        <input
          type="number"
          name={`${licenseType}Price`}
          value={price}
          onChange={handleInputChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
          placeholder="0.00"
          step="0.01"
          min="0"
        />
      </div>

      <div className="text-sm text-gray-400">
        <p>• Files: Add manually in Whop</p>
        <p>• License: Add manually in Whop</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Upload Your Beat</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8 mb-12">
          {/* Basic Information */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Beat Title</label>
              <input
                type="text"
                name="title"
                value={uploadData.title}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="Enter beat title..."
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">YouTube URL</label>
              <input
                type="url"
                name="youtubeUrl"
                value={uploadData.youtubeUrl}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="https://youtube.com/watch?v=..."
                required
              />
            </div>
          </div>

          {/* License Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PriceInputSection
              title="Basic License"
              licenseType="basic"
              price={uploadData.basicPrice}
            />
            
            <PriceInputSection
              title="Premium License"
              licenseType="premium"
              price={uploadData.premiumPrice}
            />
            
            <PriceInputSection
              title="Unlimited License"
              licenseType="unlimited"
              price={uploadData.unlimitedPrice}
            />
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Creating Products...</span>
                <span className="text-sm text-gray-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isUploading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-8 py-3 rounded-lg font-medium transition-colors"
            >
              {isUploading ? 'Creating...' : 'Create Beat Products'}
            </button>
          </div>
        </form>

        {/* Uploaded Beats Section */}
        {uploadedBeats.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Created Beats - Ready for Manual Setup</h2>
            
            {uploadedBeats.map((beat) => (
              <div key={beat.id} className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{beat.title}</h3>
                    <p className="text-gray-400 mb-4">{beat.youtubeUrl}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-400">Basic:</span>
                        <span className="ml-2 font-bold">${beat.prices.basic}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Premium:</span>
                        <span className="ml-2 font-bold">${beat.prices.premium}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Unlimited:</span>
                        <span className="ml-2 font-bold">${beat.prices.unlimited}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    beat.listed 
                      ? 'bg-green-600 text-white' 
                      : 'bg-yellow-600 text-black'
                  }`}>
                    {beat.listed ? 'Listed' : 'Pending Setup'}
                  </div>
                </div>

                {!beat.listed && (
                  <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-400 mb-2">Manual Setup Required</h4>
                        <ol className="text-sm text-gray-300 space-y-1">
                          <li>1. Add files to each tier in Whop</li>
                          <li>2. Add license terms for each tier</li>
                          <li>3. Click "List Beat" when complete</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <a
                    href={beat.whopPurchaseUrls.basic}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    Open in Whop
                  </a>
                  
                  {!beat.listed && (
                    <button
                      onClick={() => listBeat(beat.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Check size={16} />
                      List Beat
                    </button>
                  )}
                  
                  {beat.listed && (
                    <a
                      href={`/beat/${beat.id}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      View in Store
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;