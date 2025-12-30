'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, AlertCircle, Download, Mail, FileText } from 'lucide-react';

const ThankYouPage = () => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [purchaseData, setPurchaseData] = useState<any>(null);
  const [contractGenerated, setContractGenerated] = useState(false);
  const [contractUrl, setContractUrl] = useState('');

  useEffect(() => {
    const status = searchParams.get('status');
    const beatId = searchParams.get('beatId');
    const licenseType = searchParams.get('license');
    const buyerName = searchParams.get('buyerName');
    const email = searchParams.get('email');

    if (status === 'success' && beatId && licenseType) {
      handleSuccessfulPurchase(beatId, licenseType, buyerName || '', email || '');
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  const handleSuccessfulPurchase = async (beatId: string, licenseType: string, buyerName: string, email: string) => {
    try {
      // Get beat details
      const beatResponse = await fetch('/api/save-beat');
      const beatData = await beatResponse.json();
      
      if (beatData.success) {
        const beat = beatData.beats.find((b: any) => b.id === beatId);
        
        if (beat) {
          setPurchaseData({
            beat,
            licenseType,
            buyerName,
            email,
            price: beat.prices[licenseType as keyof typeof beat.prices]
          });

          // Generate personalized contract
          await generateContract(beat, licenseType, buyerName, email);
          setStatus('success');
        }
      }
    } catch (error) {
      console.error('Error processing purchase:', error);
      setStatus('error');
    }
  };

  const generateContract = async (beat: any, licenseType: string, buyerName: string, email: string) => {
    try {
      const response = await fetch('/api/generate-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyerName,
          beatTitle: beat.title,
          licenseType,
          price: beat.prices[licenseType as keyof typeof beat.prices],
          purchaseDate: new Date().toLocaleDateString(),
          producerName: 'Your Name', // TODO: Make this configurable
          producerEmail: 'your@email.com' // TODO: Make this configurable
        })
      });

      const contractData = await response.json();
      
      if (contractData.success) {
        setContractGenerated(true);
        // In a real implementation, you'd get a PDF URL
        setContractUrl('data:text/html;charset=utf-8,' + encodeURIComponent(contractData.contractHTML));
      }
    } catch (error) {
      console.error('Error generating contract:', error);
    }
  };

  const downloadContract = () => {
    if (contractUrl) {
      const link = document.createElement('a');
      link.href = contractUrl;
      link.download = `${purchaseData?.beat.title}_${purchaseData?.licenseType}_License.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Processing your purchase...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Payment Failed</h1>
          <p className="text-gray-400 mb-6">
            There was an issue processing your payment. Please try again or contact support.
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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Purchase Successful! 🎉</h1>
          <p className="text-xl text-gray-300">
            Thank you {purchaseData?.buyerName}! Your license has been generated.
          </p>
        </div>

        {/* Purchase Details */}
        <div className="bg-gray-900 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Purchase Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Beat Information</h3>
              <p className="text-gray-400"><strong>Title:</strong> {purchaseData?.beat.title}</p>
              <p className="text-gray-400"><strong>License:</strong> {purchaseData?.licenseType}</p>
              <p className="text-gray-400"><strong>Price:</strong> ${purchaseData?.price}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Licensee Information</h3>
              <p className="text-gray-400"><strong>Name:</strong> {purchaseData?.buyerName}</p>
              <p className="text-gray-400"><strong>Email:</strong> {purchaseData?.email}</p>
              <p className="text-gray-400"><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Contract Section */}
        <div className="bg-gray-900 rounded-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your License Contract</h2>
            {contractGenerated && (
              <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">
                Generated
              </span>
            )}
          </div>

          {contractGenerated ? (
            <div>
              <div className="bg-green-900 bg-opacity-30 border border-green-600 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">Contract Ready</h4>
                    <p className="text-sm text-gray-300">
                      Your personalized license contract has been generated with your name and purchase details.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={downloadContract}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Download size={20} />
                  Download Contract
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <FileText size={20} />
                  Print Contract
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">Generating Contract...</h4>
                  <p className="text-sm text-gray-300">
                    Your personalized license contract is being prepared.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-gray-900 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">What's Next? 🚀</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">📧</span>
              </div>
              <h3 className="font-semibold mb-2">Check Your Email</h3>
              <p className="text-sm text-gray-400">
                You'll receive a copy of this license and download instructions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🎵</span>
              </div>
              <h3 className="font-semibold mb-2">Download Beat Files</h3>
              <p className="text-sm text-gray-400">
                Access your beat files through the Whop platform
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🎤</span>
              </div>
              <h3 className="font-semibold mb-2">Start Creating</h3>
              <p className="text-sm text-gray-400">
                Use your beat following the license terms
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Questions about your license? Contact us at support@yourbeatstore.com
          </p>
          <a
            href="/"
            className="inline-block bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Return to Store
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
