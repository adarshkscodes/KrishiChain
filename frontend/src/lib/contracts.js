// Replace these with your actual deployed contract addresses from hardhat deployment
export const ADDRESSES = {
  ESCROW: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', // Replace with your KCEscrow address
  TOKEN: '0x5FbDB2315678afecb367f032d93F642f64180aa3'   // Replace with your KCToken address
}

// Import ABIs (these should be auto-generated after compilation)
export { default as EscrowABI } from '../abis/KCEscrow.json'
export { default as TokenABI } from '../abis/KCToken.json'
