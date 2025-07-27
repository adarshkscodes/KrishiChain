🌾 KrishiChain: A Decentralized Agricultural Supply Chain

KrishiChain is a full-stack decentralized application (dApp) built to bring transparency, traceability, and trust to the agricultural supply chain. By leveraging blockchain technology, it connects farmers directly with buyers, ensuring fair and secure transactions through smart contract-based escrow and rewarding participants with a native ERC-20 token.


✨ Core Features
📦 Decentralized Escrow System: Securely holds a buyer's payment in a smart contract, which is automatically released to the farmer upon confirmation of delivery.

🪙 ERC-20 Reward Tokens (KCT): Farmers are automatically minted "KrishiChain Tokens" (KCT) as a reward for every successful and verified transaction, incentivizing participation and good conduct.

🔍 QR Code Verification: Every product registered generates a unique QR code. Anyone can scan it to view the product's on-chain metadata, verifying its authenticity and origin.

📁 IPFS for Data Integrity: Product images and metadata are stored on the InterPlanetary File System (IPFS), ensuring that the data is decentralized, immutable, and permanently accessible.

🔒 Modern Wallet Integration: Seamlessly connect with various Web3 wallets like MetaMask and WalletConnect through RainbowKit for a smooth user experience.

📱 Responsive & Clean UI: A user-friendly interface built with React and styled with TailwindCSS for a great experience on any device.


🛠️ Technology Stack
Our platform is built with a modern, robust, and scalable technology stack.

Area	Technology
Blockchain	
Frontend	
Web3	
Storage	![IPFS](https://img.shields.io/badge/
DevOps	
🚀 Getting Started
Follow these instructions to set up and run the project on your local machine.

Prerequisites
Node.js (>=18.0.0)

Git

A Web3 wallet (e.g., MetaMask)

Installation
Clone the repository:

bash
git clone https://github.com/adarshkscodes/KrishiChain.git
cd KrishiChain
Install root dependencies:

bash
npm install
Install frontend dependencies:

bash
cd frontend
npm install
cd .. 

Environment Setup
You need to set up your environment variables for the backend and frontend.

Create the backend .env file:

In the root directory, copy the example file: cp .env.example .env

Open the new .env file and add your secret keys (Ethereum Private Key, Alchemy RPC URL).

Create the frontend .env file:

In the frontend directory, copy the example file: cp .env.example .env

Open the new frontend/.env file and add your client-side keys (WalletConnect Project ID, NFT.Storage API Key).

Note: Never commit your .env files to Git. They are already included in the .gitignore file to prevent this.

Running the Application
Run the following command from the root directory of the project:

bash
npm run dev
This single command will concurrently:

Start a local Hardhat blockchain node.

Compile and deploy the smart contracts to the local node.

Export the contract ABIs to the frontend.

Start the Vite development server for the React frontend.

Your KrishiChain dApp will be running at http://localhost:5173.

📖 Usage Flow
Connect Your Wallet: Use the "Connect Wallet" button to link your MetaMask or other wallet.

Register a Product (Farmer):

Fill in the product details (name, price, description).

Upload a product image, which gets sent to IPFS.

A QR code is generated for verification.

Click "Create Order" and approve the transaction to lock the product details in the escrow contract.

Verify a Product (Anyone):

Scan the generated QR code.

This will open a verification page displaying the authentic, on-chain product details.

Manage an Order (Buyer & Seller):

Look up an order using its ID.

Buyer: After receiving the product, click "I Received the Product" and confirm the transaction.

Seller: Once delivery is confirmed, click "Release Payment" to receive the ETH and your 10 KCT reward tokens.

🤝 Contributing
Contributions are welcome! If you have suggestions or want to improve the project, please feel free to fork the repository, make your changes, and open a pull request.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📜 License
This project is distributed under the MIT License. See LICENSE for more information.

📬 Contact
Adarsh - Email] - adarshkscodes@gmail.com

Project Link: https://github.com/adarshkscodes/KrishiChain
