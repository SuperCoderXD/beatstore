'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, AlertCircle, FileText, Mail, User, Calendar, DollarSign } from 'lucide-react';

const ContractContent = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [contractData, setContractData] = useState<any>(null);
  const [licenseTerms, setLicenseTerms] = useState<any>(null);
  const [signingUrl, setSigningUrl] = useState('');
  const [isSigning, setIsSigning] = useState(false);

  useEffect(() => {
    const beat = searchParams.get('beat');
    const license = searchParams.get('license');
    const price = searchParams.get('price');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const transactionId = searchParams.get('transaction_id') || searchParams.get('id');

    if (beat && license && name && email) {
      loadContractData(beat, license, price, name, email, transactionId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const loadContractData = async (beat: string, license: string, price: string, name: string, email: string, transactionId?: string) => {
    try {
      // Load license terms
      const termsResponse = await fetch('/api/license-terms');
      const termsData = await termsResponse.json();
      setLicenseTerms(termsData);

      // Set contract data
      setContractData({
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
      console.error('Error loading contract data:', error);
      setLoading(false);
    }
  };

  const handleSignContract = async () => {
    if (!contractData || !licenseTerms) return;

    setIsSigning(true);
    try {
      // Create contract with OpenSign
      const response = await fetch('/api/create-contract-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractData,
          licenseTerms
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSigningUrl(data.signingUrl);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('Error creating contract. Please try again.');
    } finally {
      setIsSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading your contract...</p>
        </div>
      </div>
    );
  }

  if (!contractData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Contract Information Missing</h1>
          <p className="text-gray-400 mb-6">
            We couldn't find all the required information to generate your contract.
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

  if (signingUrl) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Sign Your Contract</h1>
            <p className="text-gray-400">Please review and sign your beat license agreement</p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4">
            <iframe
              src={signingUrl}
              className="w-full h-screen min-h-[600px] border-0 rounded"
              title="Contract Signing"
            />
          </div>
        </div>
      </div>
    );
  }

  const { beat, license, price, name, email, transactionId, date, producerName, producerEmail } = contractData;
  const currentTerms = licenseTerms?.[license as keyof typeof licenseTerms] || licenseTerms?.basic;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-gray-900 rounded-lg shadow-2xl">
          {/* Header */}
          <div className="border-b border-gray-800 p-8">
            <h1 className="text-3xl font-bold text-center mb-2">BEAT LICENSE AGREEMENT</h1>
            <p className="text-center text-gray-400">Non-Exclusive License Contract</p>
          </div>

          {/* Contract Content */}
          <div className="p-8 space-y-8">
            {/* Transaction Details */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Transaction Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Transaction ID</p>
                  <p className="font-medium">{transactionId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Date</p>
                  <p className="font-medium">{date}</p>
                </div>
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
              </div>
            </div>

            {/* Parties */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
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
                  <p className="font-medium">{name}</p>
                  <p className="text-sm text-gray-400">{email}</p>
                </div>
              </div>
            </div>

            {/* License Terms */}
            {currentTerms && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  License Terms
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

            {/* Agreement */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Agreement</h2>
              <p className="text-gray-300 leading-relaxed">
                By signing this contract, you agree to abide by all terms and conditions outlined above. 
                This license grants you the rights specified in the "What You CAN Do" section, 
                subject to the restrictions in the "What You CANNOT Do" section. 
                Violation of these terms may result in legal action and termination of this license.
              </p>
            </div>

            {/* Sign Contract Button */}
            <div className="text-center">
              <button
                onClick={handleSignContract}
                disabled={isSigning}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center gap-2 mx-auto"
              >
                {isSigning ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Contract...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Sign Contract
                  </>
                )}
              </button>
              <p className="text-sm text-gray-400 mt-4">
                You'll receive a signed PDF copy via email after signing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContractPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading contract page...</p>
        </div>
      </div>
    }>
      <ContractContent />
    </Suspense>
  );
};

export default ContractPage;
