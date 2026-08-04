import { useCallback, useEffect, useMemo, useState } from "react";
import { CircleDollarSign, WalletCards } from "lucide-react";

import DashboardLayout from "../layout/DashboardLayout";
import { getMyAccount } from "../service/userServices";

function Wallet() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWallets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyAccount();
      setAccounts(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load wallet details."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWallets();
  }, [loadWallets]);

  const totalBalance = useMemo(() => {
    return accounts.reduce((total, account) => {
      return total + account.balance;
    }, 0);
  }, [accounts]);

  const formatMoney = (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <div className="flex items-center gap-3">
          <WalletCards className="text-cyan-400" size={32} />

          <div>
            <h1 className="text-4xl font-bold">Wallet</h1>
            <p className="mt-2 text-slate-400">
              View your PayFlow wallet balances.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-6 md:col-span-2">
            <p className="text-sm font-medium text-cyan-200">
              Total Balance
            </p>

            <h2 className="mt-3 text-4xl font-bold text-white">
              {loading ? "Loading..." : formatMoney(totalBalance)}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Across {accounts.length} wallet
              {accounts.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Wallet status</p>

            <p className="mt-3 text-2xl font-bold text-emerald-400">
              Active
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Your wallets are available for transfers.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold">Your accounts</h2>

          {loading ? (
            <p className="mt-4 text-slate-400">Loading accounts...</p>
          ) : accounts.length === 0 ? (
            <p className="mt-4 text-slate-400">No wallets found.</p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
              {accounts.map((account) => (
                <div
                  key={account._id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-semibold">
                        {account.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        {account.currency} · {account.type}
                      </p>
                    </div>

                    <CircleDollarSign className="text-cyan-400" size={28} />
                  </div>

                  <p className="mt-8 text-3xl font-bold">
                    {formatMoney(account.balance, account.currency)}
                  </p>

                  <span
                    className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      account.Status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {account.Status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Wallet;