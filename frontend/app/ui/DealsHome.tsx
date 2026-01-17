"use client";

import { useEffect, useMemo, useState } from "react";
import DealForm from "@/components/DealForm";
import DealTable from "@/components/DealTable";
import { api } from "@/lib/api";
import { Deal } from "@/lib/types";

export default function DealsHome() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    setErr(null);
    setLoading(true);
    try {
      const list = await api.listDeals();
      // sort latest first
      list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setDeals(list);
    } catch (e: any) {
      setErr(e?.message || "Failed to load deals");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const header = useMemo(() => {
    const ok = process.env.NEXT_PUBLIC_API_URL;
    return ok ? ok : "Missing NEXT_PUBLIC_API_URL";
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Escrow Admin Panel</h1>
          <p className="text-sm text-slate-600">
            API: <span className="rounded bg-white px-2 py-1 font-mono text-xs">{header}</span>
          </p>
        </div>

        {err ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{err}</div> : null}

        <div className="mt-6 grid gap-5 lg:grid-cols-[380px_1fr]">
          <DealForm
            onCreated={(d) => {
              setDeals((prev) => [d, ...prev]);
            }}
          />

          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <button
                onClick={refresh}
                className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>

              <div className="text-xs text-slate-500">
                Tip: `adminRelease` will revert unless deal is <b>COMPLETED</b> on-chain.
              </div>
            </div>

            <DealTable deals={deals} />
          </div>
        </div>
      </div>
    </main>
  );
}
