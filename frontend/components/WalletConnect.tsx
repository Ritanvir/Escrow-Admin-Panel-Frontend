"use client";

import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function WalletConnect({
  onConnected,
}: {
  onConnected?: (address: string) => void;
}) {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const targetChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

  async function connect() {
    if (!window.ethereum) {
      alert("No EVM wallet found. Install MetaMask or Phantom (EVM).");
      return;
    }
    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();
    const net = await provider.getNetwork();

    setAddress(addr);
    setChainId(Number(net.chainId));
    onConnected?.(addr);
  }

  useEffect(() => {
    if (!window.ethereum) return;

    const onAcc = (accs: string[]) => setAddress(accs?.[0] ?? null);
    const onChain = () => window.location.reload();

    window.ethereum.on?.("accountsChanged", onAcc);
    window.ethereum.on?.("chainChanged", onChain);

    return () => {
      window.ethereum.removeListener?.("accountsChanged", onAcc);
      window.ethereum.removeListener?.("chainChanged", onChain);
    };
  }, []);

  const wrongNetwork = chainId !== null && chainId !== targetChainId;

  return (
    <div className="flex items-center gap-3">
      {address ? (
        <>
          <div className="text-xs font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          {wrongNetwork ? (
            <div className="text-xs text-rose-600">Wrong network</div>
          ) : (
            <div className="text-xs text-emerald-600">Connected</div>
          )}
        </>
      ) : (
        <button
          className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
          onClick={connect}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
