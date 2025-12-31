'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, AlertCircle, FileText, Calendar, Music, DollarSign } from 'lucide-react';

const AgreementContent = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [agreementData, setAgreementData] = useState<any>(null);
  const [licenseTerms, setLicenseTerms] = useState<any>(null);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [hasDisagreed, setHasDisagreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const beat = searchParams.get('beat');
    const license = searchParams.get('license');
    const price = searchParams.get('price');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const transactionId = searchParams.get('transaction_id') || searchParams.get('id') || undefined;

    if (beat && license) {
      loadAgreementData(beat, license, price || '0', name || '', email || '', transactionId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const loadAgreementData = async (beat: string, license: string, price: string, name: string, email: string, transactionId?: string) => {
    try {
      // Load license terms
      const termsResponse = await fetch('/api/license-terms');
      const termsData = await termsResponse.json();
      setLicenseTerms(termsData);

      // Set agreement data
      setAgreementData({
        beat,
        license,
        price,
        name,
        email,
        transactionId,
        date: new Date().toLocaleDateString(),
        producerName: "Your Producer Name", // Update this
        producerEmail: "your-email@example.com" // Update this
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading agreement data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (agreed: boolean) => {
    if (!agreementData) return;

    setSubmitted(true);
    
    // Log the agreement for your records
    console.log('License Agreement:', {
      ...agreementData,
      agreed,
      timestamp: new Date().toISOString()
    });

    // You could also send this to your backend for record keeping
    try {
      await fetch('/api/log-agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...agreementData,
          agreed,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to log agreement:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your license agreement...</p>
        </div>
      </div>
    );
  }

  if (!agreementData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Agreement Information Missing</h1>
          <p className="text-gray-400 mb-6">
            We couldn't find all the required information to generate your license agreement.
            Please return to the store and try again.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Return to Store
          </a>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">
            {hasAgreed ? 'Thank You!' : 'Understood'}
          </h1>
          <p className="text-gray-300 mb-6">
            {hasAgreed 
              ? 'Your license agreement has been recorded. You can now use the beat for profit use according to the terms.'
              : 'Thank you for reviewing the terms. The beat will remain for non-commercial use only.'
            }
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Return to Store
          </a>
        </div>
      </div>
    );
  }

  const { beat, license, price, name, email, transactionId, date, producerName, producerEmail } = agreementData;
  const currentTerms = licenseTerms?.[license as keyof typeof licenseTerms] || licenseTerms?.basic;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-gray-900 rounded-lg shadow-2xl">
          {/* Header */}
          <div className="border-b border-gray-800 p-8">
            <h1 className="text-3xl font-bold text-center mb-2">BEAT LICENSE AGREEMENT</h1>
            <p className="text-center text-gray-400">Non-Exclusive License Terms</p>
          </div>

          {/* Agreement Content */}
          <div className="p-8 space-y-8">
            {/* Important Notice */}
            <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-3 text-yellow-300 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                IMPORTANT NOTICE
              </h2>
              <p className="text-yellow-100">
                <strong>By using the following beat for profit use, you agree to the following terms:</strong><br/>
                I (the producer) keep the rights, other artists are using it, and there are specific limitations 
                based on your license type. Please read all terms carefully before making your decision.
              </p>
            </div>

            {/* Transaction Details */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                License Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Beat Title</p>
                  <p className="font-medium">{beat}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">License Type</p>
                  <p className="font-medium capitalize">{license}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">License Fee</p>
                  <p className="font-medium">${price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Agreement Date</p>
                  <p className="font-medium">{date}</p>
                </div>
              </div>
            </div>

            {/* Parties */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Music className="w-5 h-5" />
                Parties
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Licensor (Producer)</p>
                  <p className="font-medium">{producerName}</p>
                  <p className="text-sm text-gray-400">{producerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Licensee (Artist)</p>
                  <p className="font-medium">{name || 'Customer'}</p>
                  <p className="text-sm text-gray-400">{email || 'Customer Email'}</p>
                </div>
              </div>
            </div>

            {/* License Terms */}
            {currentTerms && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  License Terms - {license.charAt(0).toUpperCase() + license.slice(1)} License
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-green-400">✅ What You CAN Do</h3>
                    <ul className="space-y-2">
                      {currentTerms.canDo.map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-red-400">🚫 What You CANNOT Do</h3>
                    <ul className="space-y-2">
                      {currentTerms.cannotDo.map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-400 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Agreement Statement */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Agreement Statement</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>Producer Rights:</strong> I (the producer) retain all rights to the instrumental 
                  and maintain ownership of the underlying composition. Other artists may also be licensed 
                  to use this beat under similar terms.
                </p>
                <p>
                  <strong>License Limitations:</strong> Your usage is limited to the specific terms outlined 
                  above based on your license type ({license.charAt(0).toUpperCase() + license.slice(1)} License). 
                  Exceeding these limitations requires additional licensing.
                </p>
                <p>
                  <strong>Profit Use:</strong> This agreement specifically covers your use of the beat 
                  for profit-making activities. Non-profit use may have different terms.
                </p>
              </div>
            </div>

            {/* Decision Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6 text-center">Your Decision</h2>
              
              <div className="space-y-4">
                {/* Agree Option */}
                <label className="block cursor-pointer">
                  <div className="bg-green-900 border border-green-700 rounded-lg p-6 hover:bg-green-800 transition-colors">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={hasAgreed}
                        onChange={(e) => {
                          setHasAgreed(e.target.checked);
                          setHasDisagreed(false);
                        }}
                        className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-300 mb-2">
                          ✅ I AGREE - I am ready to use the beat for profit use
                        </h3>
                        <p className="text-green-100 text-sm">
                          I have read and understand all the terms above. I agree to abide by these 
                          limitations and I am ready to use this beat for commercial/profit activities 
                          according to the {license.charAt(0).toUpperCase() + license.slice(1)} License terms.
                        </p>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Disagree Option */}
                <label className="block cursor-pointer">
                  <div className="bg-red-900 border border-red-700 rounded-lg p-6 hover:bg-red-800 transition-colors">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={hasDisagreed}
                        onChange={(e) => {
                          setHasDisagreed(e.target.checked);
                          setHasAgreed(false);
                        }}
                        className="mt-1 w-5 h-5 text-red-600 rounded focus:ring-red-500"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-red-300 mb-2">
                          ❌ I DON'T AGREE - I won't use it for profit use
                        </h3>
                        <p className="text-red-100 text-sm">
                          I do not agree to these terms or I am not ready to use the beat for profit use. 
                          I understand that I can only use this beat for non-commercial purposes or I will 
                          need to seek different licensing terms.
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => handleSubmit(hasAgreed)}
                  disabled={!hasAgreed && !hasDisagreed}
                  className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${
                    hasAgreed 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : hasDisagreed
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {hasAgreed ? (
                    <>
                      <Check className="inline w-5 h-5 mr-2" />
                      Confirm Agreement
                    </>
                  ) : hasDisagreed ? (
                    <>
                      <AlertCircle className="inline w-5 h-5 mr-2" />
                      Confirm Disagreement
                    </>
                  ) : (
                    'Please select an option above'
                  )}
                </button>
                <p className="text-sm text-gray-400 mt-4">
                  Your choice will be recorded for our records
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AgreementPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading agreement page...</p>
        </div>
      </div>
    }>
      <AgreementContent />
    </Suspense>
  );
};

export default AgreementPage;
