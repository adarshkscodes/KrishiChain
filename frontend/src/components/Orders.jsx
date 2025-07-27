import React, { useState } from 'react'
import { 
  useAccount, 
  useReadContract, 
  useWriteContract,
  useWaitForTransactionReceipt 
} from 'wagmi'
import { formatEther } from 'viem'

import { notify } from '../lib/toast'
import { ADDRESSES, EscrowABI, TokenABI } from '../lib/contracts'

export default function Orders() {
  const { address } = useAccount()
  const [orderId, setOrderId] = useState(1)

  // Read order details
  const { data: order, refetch: refetchOrder } = useReadContract({
    address: ADDRESSES.ESCROW,
    abi: EscrowABI,
    functionName: 'orders',
    args: [BigInt(orderId)],
  })

  // Read token balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: ADDRESSES.TOKEN,
    abi: TokenABI,
    functionName: 'balanceOf',
    args: address ? [address] : ['0x0000000000000000000000000000000000000000'],
    query: { enabled: !!address }
  })

  // Write functions
  const { writeContract: confirmDelivery, data: confirmHash, isPending: isConfirmPending } = useWriteContract()
  const { writeContract: releasePayment, data: releaseHash, isPending: isReleasePending } = useWriteContract()

  // Wait for transactions
  const { isLoading: isConfirmLoading, isSuccess: isConfirmSuccess } = useWaitForTransactionReceipt({
    hash: confirmHash,
  })
  const { isLoading: isReleaseLoading, isSuccess: isReleaseSuccess } = useWaitForTransactionReceipt({
    hash: releaseHash,
  })

  // Handle buyer confirmation
  const handleConfirmDelivery = async () => {
    try {
      confirmDelivery({
        address: ADDRESSES.ESCROW,
        abi: EscrowABI,
        functionName: 'confirmDelivery',
        args: [BigInt(orderId)],
      })
      notify('Confirming delivery...')
    } catch (error) {
      notify('Failed to confirm delivery', 'error')
      console.error(error)
    }
  }

  // Handle seller release
  const handleReleasePayment = async () => {
    try {
      releasePayment({
        address: ADDRESSES.ESCROW,
        abi: EscrowABI,
        functionName: 'release',
        args: [BigInt(orderId)],
      })
      notify('Releasing payment...')
    } catch (error) {
      notify('Failed to release payment', 'error')
      console.error(error)
    }
  }

  // Refetch data when transactions succeed
  React.useEffect(() => {
    if (isConfirmSuccess) {
      notify('Delivery confirmed successfully! 🚚')
      refetchOrder()
    }
  }, [isConfirmSuccess, refetchOrder])

  React.useEffect(() => {
    if (isReleaseSuccess) {
      notify('Payment released & KCT rewards minted! 🎉')
      refetchOrder()
      refetchBalance()
    }
  }, [isReleaseSuccess, refetchOrder, refetchBalance])

  const getStatusText = (status) => {
    const statuses = ['Pending', 'Delivered', 'Released', 'Refunded']
    return statuses[status] || 'Unknown'
  }

  const getStatusColor = (status) => {
    const colors = {
      0: 'bg-yellow-100 text-yellow-800', // Pending
      1: 'bg-blue-100 text-blue-800',     // Delivered
      2: 'bg-green-100 text-green-800',   // Released
      3: 'bg-red-100 text-red-800'        // Refunded
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Order Lookup */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          📦 Manage Orders
        </h2>

        <div className="flex items-center space-x-4 mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Order ID:
          </label>
          <input
            type="number"
            className="input w-24"
            value={orderId}
            onChange={(e) => setOrderId(Number(e.target.value))}
            min="1"
          />
          <button 
            onClick={refetchOrder}
            className="btn"
          >
            Lookup Order
          </button>
        </div>

        {/* Order Details */}
        {order && (
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">Order #{orderId} Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Buyer:</span>
                <p className="font-mono text-sm break-all">{order.buyer}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Seller:</span>
                <p className="font-mono text-sm break-all">{order.seller}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Amount:</span>
                <p className="text-lg font-semibold">
                  {order?.amount ? formatEther(order.amount) : '0.0'} ETH
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="text-sm font-medium text-gray-500">IPFS CID:</span>
                <p className="font-mono text-sm break-all">{order.ipfsCid}</p>
                {order.ipfsCid && (
                  <a 
                    href={`/verify/${order.ipfsCid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 text-sm"
                  >
                    View Product Details →
                  </a>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4 border-t">
              {/* Buyer Actions */}
              {address === order.buyer && order.status === 0 && (
                <button
                  onClick={handleConfirmDelivery}
                  disabled={isConfirmPending || isConfirmLoading}
                  className="btn disabled:opacity-50"
                >
                  {isConfirmPending || isConfirmLoading 
                    ? 'Confirming...' 
                    : '✅ I Received the Product'
                  }
                </button>
              )}

              {/* Seller Actions */}
              {address === order.seller && order.status === 1 && (
                <button
                  onClick={handleReleasePayment}
                  disabled={isReleasePending || isReleaseLoading}
                  className="btn disabled:opacity-50"
                >
                  {isReleasePending || isReleaseLoading 
                    ? 'Releasing...' 
                    : '💰 Release Payment & Claim Rewards'
                  }
                </button>
              )}

              {/* Status Messages */}
              {order.status === 0 && (
                <p className="text-amber-600 text-sm">
                  ⏳ Waiting for buyer to confirm receipt
                </p>
              )}
              {order.status === 1 && (
                <p className="text-blue-600 text-sm">
                  🚀 Ready for seller to release payment
                </p>
              )}
              {order.status === 2 && (
                <p className="text-green-600 text-sm">
                  ✅ Order completed successfully!
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Token Balance Display */}
      {address && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            🪙 Your KCT Rewards
          </h3>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            {balance !== undefined ? (
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {formatEther(balance)} KCT
                </p>
                <p className="text-gray-600 mt-2">
                  Earned from successful deliveries
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Loading balance...</p>
            )}
          </div>
        </div>
      )}

      {!address && (
        <div className="card">
          <p className="text-amber-600 text-center">
            🔐 Please connect your wallet to manage orders and view rewards
          </p>
        </div>
      )}
    </div>
  )
}
