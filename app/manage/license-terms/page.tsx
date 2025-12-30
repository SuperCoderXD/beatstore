'use client';

import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, FileText, Settings } from 'lucide-react';
import Link from 'next/link';

interface LicenseTerms {
  basic: {
    name: string;
    streams: string;
    sales: string;
    videos: string;
    performances: string;
    publishing: string;
    description: string;
    canDo: string[];
    cannotDo: string[];
  };
  premium: {
    name: string;
    streams: string;
    sales: string;
    videos: string;
    performances: string;
    publishing: string;
    description: string;
    canDo: string[];
    cannotDo: string[];
  };
  unlimited: {
    name: string;
    streams: string;
    sales: string;
    videos: string;
    performances: string;
    publishing: string;
    description: string;
    canDo: string[];
    cannotDo: string[];
  };
}

const defaultTerms: LicenseTerms = {
  basic: {
    name: "Basic Lease License",
    streams: "250,000",
    sales: "5,000",
    videos: "2 music videos",
    performances: "Non-profit performances only",
    publishing: "50%",
    description: "Perfect for artists starting out or working on smaller projects.",
    canDo: [
      "Use the beat for your recording, mix, and master",
      "Distribute your song on Spotify, Apple Music, etc.",
      "Use for 2 music videos",
      "Perform live at non-profit events",
      "Keep 100% of master recording royalties"
    ],
    cannotDo: [
      "Transfer or resell this license to another artist",
      "Register the beat with Content ID as your own",
      "Claim copyright ownership of the underlying beat",
      "Use for commercial performances",
      "Create derivative beats from this instrumental"
    ]
  },
  premium: {
    name: "Premium Lease License",
    streams: "1,000,000",
    sales: "10,000",
    videos: "5 music videos",
    performances: "All performances (commercial allowed)",
    publishing: "75%",
    description: "Great for established artists and commercial projects.",
    canDo: [
      "Use the beat for your recording, mix, and master",
      "Distribute your song on Spotify, Apple Music, etc.",
      "Use for 5 music videos",
      "Perform live commercially",
      "Keep 100% of master recording royalties"
    ],
    cannotDo: [
      "Transfer or resell this license to another artist",
      "Register the beat with Content ID as your own",
      "Claim copyright ownership of the underlying beat",
      "Use in film/TV without additional license",
      "Create derivative beats from this instrumental"
    ]
  },
  unlimited: {
    name: "Unlimited Lease License",
    streams: "Unlimited",
    sales: "Unlimited",
    videos: "Unlimited music videos",
    performances: "All performances",
    publishing: "100%",
    description: "Maximum rights for serious artists and major projects.",
    canDo: [
      "Use the beat for your recording, mix, and master",
      "Distribute your song with unlimited streams",
      "Unlimited music videos",
      "All live performances",
      "Keep 100% of master recording royalties",
      "Use in commercial projects"
    ],
    cannotDo: [
      "Transfer or resell this license to another artist",
      "Register the beat with Content ID as your own",
      "Claim copyright ownership of the underlying beat",
      "Create derivative beats from this instrumental"
    ]
  }
};

const LicenseTermsPage = () => {
  const [terms, setTerms] = useState<LicenseTerms>(defaultTerms);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'premium' | 'unlimited'>('basic');

  useEffect(() => {
    loadTerms();
  }, []);

  const loadTerms = async () => {
    try {
      const response = await fetch('/api/license-terms');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.terms) {
          setTerms(data.terms);
        }
      }
    } catch (error) {
      console.error('Failed to load license terms:', error);
    }
  };

  const saveTerms = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/license-terms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(terms)
      });

      if (response.ok) {
        alert('License terms saved successfully!');
      } else {
        alert('Failed to save license terms');
      }
    } catch (error) {
      console.error('Failed to save license terms:', error);
      alert('Failed to save license terms');
    } finally {
      setSaving(false);
    }
  };

  const updateTerm = (licenseType: keyof LicenseTerms, field: string, value: string) => {
    setTerms(prev => ({
      ...prev,
      [licenseType]: {
        ...prev[licenseType],
        [field]: value
      }
    }));
  };

  const updateCanDoItem = (licenseType: keyof LicenseTerms, index: number, value: string) => {
    setTerms(prev => ({
      ...prev,
      [licenseType]: {
        ...prev[licenseType],
        canDo: prev[licenseType].canDo.map((item, i) => i === index ? value : item)
      }
    }));
  };

  const updateCannotDoItem = (licenseType: keyof LicenseTerms, index: number, value: string) => {
    setTerms(prev => ({
      ...prev,
      [licenseType]: {
        ...prev[licenseType],
        cannotDo: prev[licenseType].cannotDo.map((item, i) => i === index ? value : item)
      }
    }));
  };

  const addCanDoItem = (licenseType: keyof LicenseTerms) => {
    setTerms(prev => ({
      ...prev,
      [licenseType]: {
        ...prev[licenseType],
        canDo: [...prev[licenseType].canDo, '']
      }
    }));
  };

  const addCannotDoItem = (licenseType: keyof LicenseTerms) => {
    setTerms(prev => ({
      ...prev,
      [licenseType]: {
        ...prev[licenseType],
        cannotDo: [...prev[licenseType].cannotDo, '']
      }
    }));
  };

  const removeCanDoItem = (licenseType: keyof LicenseTerms, index: number) => {
    setTerms(prev => ({
      ...prev,
      [licenseType]: {
        ...prev[licenseType],
        canDo: prev[licenseType].canDo.filter((_, i) => i !== index)
      }
    }));
  };

  const removeCannotDoItem = (licenseType: keyof LicenseTerms, index: number) => {
    setTerms(prev => ({
      ...prev,
      [licenseType]: {
        ...prev[licenseType],
        cannotDo: prev[licenseType].cannotDo.filter((_, i) => i !== index)
      }
    }));
  };

  const LicenseEditor = ({ licenseType }: { licenseType: keyof LicenseTerms }) => {
    const currentTerms = terms[licenseType];

    return (
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">License Name</label>
              <input
                type="text"
                value={currentTerms.name}
                onChange={(e) => updateTerm(licenseType, 'name', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Publishing Rights</label>
              <input
                type="text"
                value={currentTerms.publishing}
                onChange={(e) => updateTerm(licenseType, 'publishing', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="e.g., 50%"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={currentTerms.description}
              onChange={(e) => updateTerm(licenseType, 'description', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-20"
              placeholder="Brief description of this license type"
            />
          </div>
        </div>

        {/* Limits */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Usage Limits</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Streaming Limit</label>
              <input
                type="text"
                value={currentTerms.streams}
                onChange={(e) => updateTerm(licenseType, 'streams', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="e.g., 250,000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Digital Sales Limit</label>
              <input
                type="text"
                value={currentTerms.sales}
                onChange={(e) => updateTerm(licenseType, 'sales', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="e.g., 5,000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Music Videos</label>
              <input
                type="text"
                value={currentTerms.videos}
                onChange={(e) => updateTerm(licenseType, 'videos', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="e.g., 2 music videos"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Live Performances</label>
              <input
                type="text"
                value={currentTerms.performances}
                onChange={(e) => updateTerm(licenseType, 'performances', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                placeholder="e.g., Non-profit only"
              />
            </div>
          </div>
        </div>

        {/* What You CAN Do */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">✅ What You CAN Do</h3>
            <button
              onClick={() => addCanDoItem(licenseType)}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
            >
              Add Item
            </button>
          </div>
          
          <div className="space-y-2">
            {currentTerms.canDo.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateCanDoItem(licenseType, index, e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  placeholder="Enter permitted use"
                />
                <button
                  onClick={() => removeCanDoItem(licenseType, index)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* What You CANNOT Do */}
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">🚫 What You CANNOT Do</h3>
            <button
              onClick={() => addCannotDoItem(licenseType)}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
            >
              Add Item
            </button>
          </div>
          
          <div className="space-y-2">
            {currentTerms.cannotDo.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateCannotDoItem(licenseType, index, e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  placeholder="Enter restriction"
                />
                <button
                  onClick={() => removeCannotDoItem(licenseType, index)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/manage"
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Settings className="w-8 h-8" />
                License Terms Manager
              </h1>
              <p className="text-gray-400">Customize your lease license terms for each tier</p>
            </div>
          </div>
          
          <button
            onClick={saveTerms}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-gray-900 p-1 rounded-lg">
          {(['basic', 'premium', 'unlimited'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === type
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} License
            </button>
          ))}
        </div>

        {/* Editor */}
        <LicenseEditor licenseType={activeTab} />
      </div>
    </div>
  );
};

export default LicenseTermsPage;
