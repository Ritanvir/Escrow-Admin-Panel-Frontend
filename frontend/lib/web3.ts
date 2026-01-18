import { BrowserProvider, Contract, ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
];

export const ESCROW_ABI = [
  "function fund(uint256 dealId) external",
  "function markCompleted(uint256 dealId) external",
  "function dispute(uint256 dealId) external",
];

export function cfg() {
  const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID);
  const escrow = (process.env.NEXT_PUBLIC_ESCROW_ADDRESS || "").toLowerCase();
  const token = (process.env.NEXT_PUBLIC_TOKEN_ADDRESS || "").toLowerCase();
  return { chainId, escrow, token };
}

export async function getSigner() {
  if (!window.ethereum) throw new Error("No wallet found");
  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}

export async function getTokenContract() {
  const { token } = cfg();
  if (!token) throw new Error("TOKEN address missing in .env.local");
  const signer = await getSigner();
  return new Contract(ethers.getAddress(token), ERC20_ABI, signer);
}

export async function getEscrowContract() {
  const { escrow } = cfg();
  if (!escrow) throw new Error("ESCROW address missing in .env.local");
  const signer = await getSigner();
  return new Contract(ethers.getAddress(escrow), ESCROW_ABI, signer);
}
