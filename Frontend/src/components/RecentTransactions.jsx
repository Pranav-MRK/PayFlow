function RecentTransactions({ transactions, loading }) {
  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Math.abs(amount));

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-6 text-xl font-semibold">Recent Transactions</h2>
        <p className="text-slate-400">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-semibold">Recent Transactions</h2>

      {transactions.length === 0 ? (
        <p className="text-slate-400">No completed transactions yet.</p>
      ) : (
        <div className="space-y-5">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-none"
            >
              <div>
                <p
                  className={`font-semibold ${
                    tx.direction === "Received"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {tx.direction}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {tx.reference}
                </p>
              </div>

              <span
                className={`font-semibold ${
                  tx.amount >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {tx.amount >= 0 ? "+" : "-"}
                {formatINR(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentTransactions;