"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Deal } from "@/lib/types";

export default function DealForm({ onCreated }: { onCreated: (d: Deal) => void }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [dealIdOnChain, setDealIdOnChain] = useState(1);
  const [clientWallet, setClientWallet] = useState("0x1111111111111111111111111111111111111111");
  const [sellerWallet, setSellerWallet] = useState("0x2222222222222222222222222222222222222222");
  const [token, setToken] = useState("0x3333333333333333333333333333333333333333");
  const [amount, setAmount] = useState("1000000000000000000"); // 1e18
  const [txCreate, setTxCreate] = useState("0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

  async function submit() {
    setErr(null);
    setLoading(true);
    try {
      const d = await api.createDeal({ dealIdOnChain, clientWallet, sellerWallet, token, amount, txCreate });
      onCreated(d);
      // auto increment convenience
      setDealIdOnChain((x) => x + 1);
    } catch (e: any) {
      setErr(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Create Deal (DB)</h2>
        <span className="text-xs text-slate-500">Talks to backend only</span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Field label="dealIdOnChain">
          <input className="input" type="number" value={dealIdOnChain} onChange={(e) => setDealIdOnChain(Number(e.target.value))} />
        </Field>

        <Field label="amount (wei)">
          <input className="input" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>

        <Field label="clientWallet">
          <input className="input" value={clientWallet} onChange={(e) => setClientWallet(e.target.value)} />
        </Field>

        <Field label="sellerWallet">
          <input className="input" value={sellerWallet} onChange={(e) => setSellerWallet(e.target.value)} />
        </Field>

        <Field label="token">
          <input className="input" value={token} onChange={(e) => setToken(e.target.value)} />
        </Field>

        <Field label="txCreate (optional)">
          <input className="input" value={txCreate} onChange={(e) => setTxCreate(e.target.value)} />
        </Field>
      </div>

      {err ? <p className="mt-3 text-sm text-rose-600">{err}</p> : null}

      <button
        onClick={submit}
        disabled={loading}
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create Deal"}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}
