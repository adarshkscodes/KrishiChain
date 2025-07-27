import { Routes, Route } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Toaster } from 'react-hot-toast';
import RegisterProduct from './components/RegisterProduct';
import Orders from './components/Orders';
import Verify from './components/Verify';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto p-4 flex justify-between">
          <h1 className="font-bold text-xl">🌾 KrishiChain</h1>
          <ConnectButton />
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify/:cid" element={<Verify />} />
      </Routes>
      <Toaster position="bottom-right" />
    </div>
  );
}

function Home() {
  return (
    <main className="max-w-7xl mx-auto p-6 space-y-8">
      <RegisterProduct />
      <Orders />
    </main>
  );
}
