import { Deal } from "./types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

if (!baseUrl) {
  // Next dev will show this in console if missing
  console.warn("Missing NEXT_PUBLIC_API_URL in .env.local");
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!baseUrl) throw new Error("Missing NEXT_PUBLIC_API_URL in .env.local");

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      msg = data?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  return res.json() as Promise<T>;
}

export type DealRisk = {
  dealIdOnChain: number;
  riskScore: number | null;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | null;
  riskReasons: string[] | null; // backend Json field
  riskUpdatedAt: string | null;
};

export const api = {
  // Deals
  listDeals: () => apiFetch<Deal[]>("/deals"),
  getDeal: (dealIdOnChain: number) => apiFetch<Deal>(`/deals/${dealIdOnChain}`),

  createDeal: (body: {
    dealIdOnChain: number;
    clientWallet: string;
    sellerWallet: string;
    token: string;
    amount: string;
    txCreate?: string;
  }) =>
    apiFetch<Deal>("/deals", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // Admin (backend signs tx)
  adminRelease: (dealIdOnChain: number) =>
    apiFetch<{ ok: boolean; txHash?: string }>(`/admin/release`, {
      method: "POST",
      body: JSON.stringify({ dealIdOnChain }),
    }),

  adminRefund: (dealIdOnChain: number) =>
    apiFetch<{ ok: boolean; txHash?: string }>(`/admin/refund`, {
      method: "POST",
      body: JSON.stringify({ dealIdOnChain }),
    }),

  // ✅ Risk scoring
  getRisk: (dealIdOnChain: number) => apiFetch<DealRisk>(`/deals/${dealIdOnChain}/risk`),

  rescoreRisk: (dealIdOnChain: number) =>
    apiFetch<any>(`/deals/${dealIdOnChain}/risk/rescore`, {
      method: "POST",
      body: JSON.stringify({}),
    }),
};
