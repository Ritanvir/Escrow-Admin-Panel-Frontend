import { DealStatus } from "@/lib/types";

const cls: Record<DealStatus, string> = {
  CREATED: "bg-slate-100 text-slate-700 border-slate-200",
  FUNDED: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-amber-50 text-amber-700 border-amber-200",
  RELEASED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REFUNDED: "bg-rose-50 text-rose-700 border-rose-200",
  DISPUTED: "bg-purple-50 text-purple-700 border-purple-200",
};

export function StatusBadge({ status }: { status: DealStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cls[status]}`}>
      {status}
    </span>
  );
}
