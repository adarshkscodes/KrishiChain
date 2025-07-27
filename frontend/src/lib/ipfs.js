import { NFTStorage } from 'nft.storage'

const client = new NFTStorage({
  token: import.meta.env.VITE_NFT_STORAGE   // ← exactly this
})

export async function uploadFile(file) {
  return client.storeBlob(file)            // use storeBlob for “just a file”
}
