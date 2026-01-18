import DealDetails from "./ui";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dealIdOnChain = Number(id);

  if (!Number.isFinite(dealIdOnChain) || dealIdOnChain <= 0) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h1 className="text-xl font-bold">Invalid deal id</h1>
            <p className="mt-2 text-sm text-slate-600">
              URL id must be a positive number. Example: <code>/deals/1</code>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return <DealDetails dealIdOnChain={dealIdOnChain} />;
}
