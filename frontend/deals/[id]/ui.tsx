"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Deal } from "@/lib/types";
import { StatusBadge } from "@/components/sb";

export default function DealDetails({ dealIdOnChain }: { dealIdOnChain: number }) {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<"release" | "refund" | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const d = await api.getDeal(dealIdOnChain);
      setDeal(d);
    } catch (e: any) {
      setErr(e?.message || "Failed to load deal");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealIdOnChain]);

  async function release() {
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

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center justify-between">
          <Link className="text-sm font-semibold text-slate-700 hover:underline" href="/">
            ← Back
          </Link>
          <button className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50" onClick={load}>
            Refresh
          </button>
        </div>

        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold">Deal #{dealIdOnChain}</h1>
              <p className="mt-1 text-sm text-slate-600">DB record + Admin actions</p>
            </div>
            {deal ? <StatusBadge status={deal.status} /> : null}
          </div>

          {err ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{err}</div> : null}

          {loading ? (
            <div className="mt-6 text-sm text-slate-500">Loading...</div>
          ) : !deal ? (
            <div className="mt-6 text-sm text-slate-500">Deal not found.</div>
          ) : (
            <div className="mt-6 grid gap-4">
              <KV label="clientWallet" value={deal.clientWallet} mono />
              <KV label="sellerWallet" value={deal.sellerWallet} mono />
              <KV label="token" value={deal.token} mono />
              <KV label="amount" value={deal.amount} />
              <KV label="txCreate" value={deal.txCreate || "-"} mono />
              <KV label="txFund" value={deal.txFund || "-"} mono />
              <KV label="txComplete" value={deal.txComplete || "-"} mono />
              <KV label="txRelease" value={deal.txRelease || "-"} mono />
              <KV label="txRefund" value={deal.txRefund || "-"} mono />

              <div className="mt-2 rounded-xl border bg-slate-50 p-4 text-sm text-slate-700">
                <div className="font-semibold">Admin actions</div>
                <div className="mt-1 text-xs text-slate-600">
                  Release requires on-chain deal to be <b>COMPLETED</b>. If you see “not completed”, you still need
                  on-chain <code>fund()</code> + <code>markCompleted()</code>.
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={release}
                    disabled={busy !== null}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    {busy === "release" ? "Releasing..." : "Admin Release"}
                  </button>

                  <button
                    onClick={refund}
                    disabled={busy !== null}
                    className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-white disabled:opacity-60"
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

function KV({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="grid gap-1">
      <div className="text-xs font-medium text-slate-600">{label}</div>
      <div className={`rounded-xl border bg-white px-3 py-2 text-sm ${mono ? "font-mono text-xs" : ""}`}>{value}</div>
    </div>
  );
}
