"use client";

import Link from "next/link";
import { Deal } from "@/lib/types";
import { StatusBadge } from "./sb";

export default function DealTable({ deals }: { deals: Deal[] }) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center justify-between p-5">
        <h2 className="text-lg font-semibold">Deals</h2>
        <span className="text-xs text-slate-500">{deals.length} total</span>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-t bg-slate-50 text-xs text-slate-600">
            <tr>
              <th className="px-5 py-3">dealIdOnChain</th>
              <th className="px-5 py-3">status</th>
              <th className="px-5 py-3">amount</th>
              <th className="px-5 py-3">token</th>
              <th className="px-5 py-3">updated</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {deals.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="px-5 py-3 font-medium">{d.dealIdOnChain}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={d.status} />
                </td>
                <td className="px-5 py-3">{d.amount}</td>
                <td className="px-5 py-3 font-mono text-xs">{short(d.token)}</td>
                <td className="px-5 py-3 text-slate-500">{new Date(d.updatedAt).toLocaleString()}</td>
                <td className="px-5 py-3 text-right">
                  <Link
                    className="rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
                    href={`/deals/${d.dealIdOnChain}`}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {deals.length === 0 ? (
              <tr>
                <td className="px-5 py-10 text-center text-slate-500" colSpan={6}>
                  No deals yet. Create one from the left panel.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function short(addr: string) {
  if (!addr?.startsWith("0x") || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
