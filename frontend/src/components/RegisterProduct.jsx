/*  frontend/src/components/RegisterProduct.jsx  */
import React, { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { parseEther } from 'viem'

import { uploadFile } from '../lib/ipfs'
import { notify } from '../lib/toast'
import { ADDRESSES, EscrowABI } from '../lib/contracts'

export default function RegisterProduct() {
  /* ------------------------------------------------------------------ */
  /* Local component state                                               */
  /* ------------------------------------------------------------------ */
  const { address } = useAccount()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [cid, setCid] = useState('')
  const [price, setPrice] = useState('0.1')
  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')

  /* ------------------------------------------------------------------ */
  /* wagmi hooks                                                         */
  /* ------------------------------------------------------------------ */
  const {
    writeContract,
    data: txHash,
    isPending: txPending,
  } = useWriteContract()

  const { isLoading: txConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    enabled: Boolean(txHash),
  })

  /* ------------------------------------------------------------------ */
  /* Handlers                                                            */
  /* ------------------------------------------------------------------ */
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      notify('File selected successfully')
    }
  }

  const handleUploadToIPFS = async () => {
    if (!file) {
      notify('Please select a file first', 'error')
      return
    }

    setUploading(true)
    try {
      const fileCid = await uploadFile(file) // returns raw CID
      setCid(fileCid)
      notify('Image uploaded to IPFS ✔️')
    } catch (err) {
      console.error(err)
      notify('IPFS upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleCreateOrder = async () => {
    if (!cid || !productName || !description || !address) {
      notify('Fill all fields and upload an image first', 'error')
      return
    }

    try {
      /* --------- build & upload metadata JSON to IPFS ---------------- */
      const meta = {
        name: productName,
        description,
        image: `ipfs://${cid}`,
        attributes: [
          { trait_type: 'Farmer', value: address },
          { trait_type: 'Price', value: `${price} ETH` },
        ],
      }
      const metaBlob = new Blob([JSON.stringify(meta, null, 2)], {
        type: 'application/json',
      })
      const metaCid = await uploadFile(metaBlob)

      /* --------- call Escrow.createOrder ----------------------------- */
      writeContract({
        address: ADDRESSES.ESCROW,
        abi: EscrowABI,
        functionName: 'createOrder',
        args: [address, metaCid],
        value: parseEther(price),
      })
      notify('Transaction sent…')
    } catch (err) {
      console.error(err)
      notify('Failed to create order', 'error')
    }
  }

  /* ------------------------------------------------------------------ */
  /* Side-effect: reset form on success                                 */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (isSuccess) {
      notify('Order created successfully 🎉')
      setFile(null)
      setCid('')
      setProductName('')
      setDescription('')
      setPrice('0.1')
    }
  }, [isSuccess])

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">🌱 Register Product</h2>

      {/* ------------- product fields --------------------------- */}
      <div className="space-y-4">
        <input
          className="input w-full"
          placeholder="Product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />

        <input
          className="input w-full"
          type="number"
          min={0}
          step={0.01}
          placeholder="Price in ETH"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <textarea
          className="input w-full h-24 resize-none"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* ------------- image upload --------------------------- */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded
                     file:border-0 file:text-sm file:font-semibold file:bg-green-50
                     file:text-green-700 hover:file:bg-green-100"
        />

        {file && !cid && (
          <button
            className="btn"
            disabled={uploading}
            onClick={handleUploadToIPFS}
          >
            {uploading ? 'Uploading…' : 'Upload to IPFS'}
          </button>
        )}

        {/* ------------- QR code preview ----------------------- */}
        {cid && (
          <div className="flex flex-col items-center space-y-2">
            <QRCodeSVG
              value={`${window.location.origin}/verify/${cid}`}
              size={180}
            />
            <span className="text-xs break-all">{cid}</span>
          </div>
        )}

        {/* ------------- create order ------------------------- */}
        {cid && (
          <button
            className="btn"
            disabled={txPending || txConfirming}
            onClick={handleCreateOrder}
          >
            {txPending || txConfirming ? 'Creating order…' : 'Create Order'}
          </button>
        )}

        {!address && (
          <p className="text-amber-600 text-sm">
            Connect wallet to register a product
          </p>
        )}
      </div>
    </div>
  )
}
