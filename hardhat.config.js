require('@nomicfoundation/hardhat-toolbox');
require('hardhat-abi-exporter');
require('dotenv').config();

module.exports = {
  solidity: '0.8.24',
  networks: {
    localhost: { url: 'http://127.0.0.1:8545' },
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_RPC || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  abiExporter: {
    path: './frontend/src/abis',  // ← Ensure this path is correct
    runOnCompile: true,           // ← Auto-export on compile
    clear: true,
    flat: true,
    spacing: 2
  }
};
