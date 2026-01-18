"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Deal } from "@/lib/types";
import { StatusBadge } from "@/components/sb";
import WalletConnect from "@/components/WalletConnect";
import { cfg, getEscrowContract, getTokenContract } from "@/lib/web3";

type Busy = "release" | "refund" | "fund" | "complete" | null;

export default function DealDetails({ dealIdOnChain }: { dealIdOnChain: number }) {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<Busy>(null);
  const [err, setErr] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const load = useCallback(async () => {
    // Guard: invalid id হলে API call করবে না
    if (!Number.isFinite(dealIdOnChain) || dealIdOnChain <= 0) {
      setDeal(null);
      setErr("Invalid deal id");
      setLoading(false);
      return;
    }

    setErr(null);
    setLoading(true);
    try {
      const d = await api.getDeal(dealIdOnChain);
      setDeal(d);
    } catch (e: any) {
      setDeal(null);
      setErr(e?.message || "Failed to load deal");
    } finally {
      setLoading(false);
    }
  }, [dealIdOnChain]);

  useEffect(() => {
    load();
  }, [load]);

  async function fund() {
    if (!deal) return;

    setErr(null);
    setBusy("fund");
    try {
      // amount already stored as wei string in DB (example: "1000000....")
      const amountWei = BigInt(deal.amount);

      const { escrow } = cfg();
      if (!escrow) throw new Error("Missing NEXT_PUBLIC_ESCROW_ADDRESS in .env.local");

      const token = await getTokenContract();
      const escrowC = await getEscrowContract();

      // 1) approve escrow to spend tokens
      const tx1 = await token.approve(escrow, amountWei);
      await tx1.wait();

      // 2) fund(dealId)
      const tx2 = await escrowC.fund(dealIdOnChain);
      await tx2.wait();

      await load();
    } catch (e: any) {
      setErr(e?.shortMessage || e?.message || "Fund failed");
    } finally {
      setBusy(null);
    }
  }

  async function markCompleted() {
    setErr(null);
    setBusy("complete");
    try {
      const escrowC = await getEscrowContract();
      const tx = await escrowC.markCompleted(dealIdOnChain);
      await tx.wait();
      await load();
    } catch (e: any) {
      setErr(e?.shortMessage || e?.message || "markCompleted failed");
    } finally {
      setBusy(null);
    }
  }

  async function release() {
    if (!Number.isFinite(dealIdOnChain) || dealIdOnChain <= 0) {
      setErr("Invalid deal id");
      return;
    }

    setErr(null);
    setBusy("release");
    try {
      await api.adminRelease(dealIdOnChain);
      await load();
    } catch (e: any) {
      setErr(e?.message || "Release failed");
    } finally {
      setBusy(null);
    }
  }

  async function refund() {
    if (!Number.isFinite(dealIdOnChain) || dealIdOnChain <= 0) {
      setErr("Invalid deal id");
      return;
    }

    setErr(null);
    setBusy("refund");
    try {
      await api.adminRefund(dealIdOnChain);
      await load();
    } catch (e: any) {
      setErr(e?.message || "Refund failed");
    } finally {
      setBusy(null);
    }
  }

  const disabled = loading || busy !== null;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center justify-between gap-3">
          <Link className="text-sm font-semibold text-slate-700 hover:underline" href="/">
            ← Back
          </Link>

          <div className="flex items-center gap-3">
            <WalletConnect onConnected={setWalletAddress} />
            <button
              className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
              onClick={load}
              disabled={disabled}
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold">Deal #{dealIdOnChain}</h1>
              <p className="mt-1 text-sm text-slate-600">DB record + actions</p>
              {walletAddress ? (
                <p className="mt-1 text-xs text-slate-500">
                  Wallet: <span className="font-mono">{walletAddress}</span>
                </p>
              ) : null}
            </div>

            {deal ? <StatusBadge status={deal.status} /> : null}
          </div>

          {err ? (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{err}</div>
          ) : null}

          {loading ? (
            <div className="mt-6 text-sm text-slate-500">Loading...</div>
          ) : !deal ? (
            <div className="mt-6 text-sm text-slate-500">Deal not found.</div>
          ) : (
            <div className="mt-6 grid gap-4">
              <KV label="clientWallet" value={deal.clientWallet} mono />
              <KV label="sellerWallet" value={deal.sellerWallet} mono />
              <KV label="token" value={deal.token} mono />
              <KV label="amount (wei)" value={deal.amount} />
              <KV label="txCreate" value={deal.txCreate || "-"} mono />
              <KV label="txFund" value={deal.txFund || "-"} mono />
              <KV label="txComplete" value={deal.txComplete || "-"} mono />
              <KV label="txRelease" value={deal.txRelease || "-"} mono />
              <KV label="txRefund" value={deal.txRefund || "-"} mono />

              {/* On-chain actions */}
              <div className="mt-2 rounded-xl border bg-slate-50 p-4 text-sm text-slate-700">
                <div className="font-semibold">On-chain actions (Wallet)</div>
                <div className="mt-1 text-xs text-slate-600">
                  Client does <code>approve</code> + <code>fund()</code>. Seller does <code>markCompleted()</code>.
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={fund}
                    disabled={disabled}
                    className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
                  >
                    {busy === "fund" ? "Funding..." : "Fund (Client)"}
                  </button>

                  <button
                    onClick={markCompleted}
                    disabled={disabled}
                    className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
                  >
                    {busy === "complete" ? "Completing..." : "Mark Completed (Seller)"}
                  </button>
                </div>
              </div>

              {/* Admin actions */}
              <div className="mt-2 rounded-xl border bg-slate-50 p-4 text-sm text-slate-700">
                <div className="font-semibold">Admin actions (Backend)</div>

                <div className="mt-1 text-xs text-slate-600">
                  Release requires on-chain deal to be <b>COMPLETED</b>. If you see “not completed”, you still need
                  on-chain <code>fund()</code> + <code>markCompleted()</code>.
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={release}
                    disabled={disabled}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    {busy === "release" ? "Releasing..." : "Admin Release"}
                  </button>

                  <button
                    onClick={refund}
                    disabled={disabled}
                    className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
                  >
                    {busy === "refund" ? "Refunding..." : "Admin Refund"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function KV({ label, value, mono }: { label: string; value: any; mono?: boolean }) {
  const str = value === null || value === undefined ? "-" : String(value);
  return (
    <div className="grid gap-1">
      <div className="text-xs font-medium text-slate-600">{label}</div>
      <div className={`rounded-xl border bg-white px-3 py-2 text-sm ${mono ? "font-mono text-xs" : ""}`}>{str}</div>
    </div>
  );
}
