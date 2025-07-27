import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function Verify() {
  const { cid } = useParams()
  const [metadata, setMetadata] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (cid) {
      fetchMetadata()
    }
  }, [cid])

  const fetchMetadata = async () => {
    try {
      setLoading(true)
      // Try to fetch metadata from IPFS
      const response = await fetch(`https://ipfs.io/ipfs/${cid}`)
      if (response.ok) {
        const data = await response.json()
        setMetadata(data)
      } else {
        throw new Error('Failed to fetch metadata')
      }
    } catch (err) {
      console.error('Error fetching metadata:', err)
      setError('Failed to load product data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={fetchMetadata}
              className="btn mt-4"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 Product Verification
          </h1>
          <p className="text-gray-600">
            Authentic product data stored on IPFS
          </p>
        </div>

        {metadata ? (
          <div className="card">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div>
                {metadata.image && (
                  <img
                    src={metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                    alt={metadata.name}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'
                    }}
                  />
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {metadata.name || 'Unknown Product'}
                  </h2>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600">
                    {metadata.description || 'No description available'}
                  </p>
                </div>

                {/* Attributes */}
                {metadata.attributes && metadata.attributes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Product Details
                    </h3>
                    <div className="space-y-2">
                      {metadata.attributes.map((attr, index) => (
                        <div 
                          key={index}
                          className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded"
                        >
                          <span className="font-medium text-gray-700">
                            {attr.trait_type}:
                          </span>
                          <span className="text-gray-600">
                            {attr.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verification Status */}
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-green-500 text-2xl mr-3">✅</div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">
                        Verified Authentic
                      </h3>
                      <p className="text-green-600 text-sm">
                        This product is registered on KrishiChain blockchain
                      </p>
                    </div>
                  </div>
                </div>

                {/* IPFS Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Technical Details
                  </h3>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p><span className="font-medium">IPFS CID:</span> {cid}</p>
                    <p><span className="font-medium">Storage:</span> Decentralized (IPFS)</p>
                    <p><span className="font-medium">Blockchain:</span> Ethereum Compatible</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card text-center">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Raw IPFS Data
            </h2>
            <p className="text-gray-600 mb-4">
              IPFS CID: <code className="bg-gray-100 px-2 py-1 rounded">{cid}</code>
            </p>
            <a
              href={`https://ipfs.io/ipfs/${cid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              View Raw Data on IPFS
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
