'use client';

import React, { useState } from 'react';
import { Upload, Check, AlertCircle } from 'lucide-react';

const UploadPage = () => {
  const [uploadData, setUploadData] = useState({
    title: '',
    youtubeUrl: '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedBeats, setUploadedBeats] = useState<any[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUploadData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Generate a unique beat ID
      const beatId = `beat_${Date.now()}`;

      // Save basic beat data
      const beatPayload = {
        title: uploadData.title,
        youtubeUrl: uploadData.youtubeUrl,
        listed: false
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

      // Add to uploaded beats list
      const newBeat = {
        id: beatId,
        title: uploadData.title,
        youtubeUrl: uploadData.youtubeUrl,
        listed: false
      };

      setUploadedBeats(prev => [newBeat, ...prev]);

      // Reset form
      setUploadData({
        title: '',
        youtubeUrl: '',
      });

      alert('Beat uploaded successfully! Add files manually, then click "List Beat" below.');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
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

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Upload Your Beat</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 mb-12">
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Beat Information</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Beat Title</label>
              <input
                type="text"
                name="title"
                value={uploadData.title}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="Enter beat title"
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

            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
            >
              {isUploading ? 'Uploading...' : 'Upload Beat'}
            </button>
          </div>
        </form>

        {/* Uploaded Beats */}
        {uploadedBeats.length > 0 && (
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Uploaded Beats</h2>
            <div className="space-y-4">
              {uploadedBeats.map((beat) => (
                <div key={beat.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{beat.title}</h3>
                    <p className="text-gray-400 text-sm">{beat.youtubeUrl}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                      beat.listed 
                        ? 'bg-green-600 text-white' 
                        : 'bg-yellow-600 text-white'
                    }`}>
                      {beat.listed ? 'Listed' : 'Not Listed'}
                    </span>
                  </div>
                  {!beat.listed && (
                    <button
                      onClick={() => listBeat(beat.id)}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      List Beat
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
