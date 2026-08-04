import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ReceiptText } from "lucide-react";

import DashboardLayout from "../layout/DashboardLayout";
import {
  getMyAccount,
  getMyTransactions,
} from "../service/userServices";

function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [accountsResponse, transactionsResponse] = await Promise.all([
        getMyAccount(),
        getMyTransactions(page, 10),
      ]);

      setAccounts(accountsResponse.data);
      setTransactions(transactionsResponse.data);
      setPagination(transactionsResponse.pagination);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load transactions."
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const accountIds = useMemo(() => {
    return new Set(accounts.map((account) => account._id));
  }, [accounts]);

  const displayedTransactions = useMemo(() => {
    return transactions.map((transaction) => {
      const myLedgerLine = transaction.lines.find((line) => {
        const accountId = line.accountId?._id || line.accountId;
        return accountIds.has(String(accountId));
      });

      const amount = myLedgerLine?.amount || 0;

      return {
        id: transaction._id,
        reference: transaction.reference,
        status: transaction.status,
        amount,
        direction: amount >= 0 ? "Received" : "Sent",
        date: transaction.createdAt,
      };
    });
  }, [transactions, accountIds]);

  const formatINR = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Math.abs(amount));
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  const totalPages = pagination?.totalPages || 1;

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <div className="flex items-center gap-3">
          <ReceiptText className="text-cyan-400" size={32} />

          <div>
            <h1 className="text-4xl font-bold">Transactions</h1>
            <p className="mt-2 text-slate-400">
              View your completed PayFlow transfers.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          {loading ? (
            <p className="p-6 text-slate-400">Loading transactions...</p>
          ) : displayedTransactions.length === 0 ? (
            <p className="p-6 text-slate-400">
              No completed transactions yet.
            </p>
          ) : (
            <div className="divide-y divide-slate-800">
              {displayedTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {transaction.direction}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      {transaction.reference}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(transaction.date)}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p
                      className={`text-lg font-bold ${
                        transaction.amount >= 0
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.amount >= 0 ? "+" : "-"}
                      {formatINR(transaction.amount)}
                    </p>

                    <span className="mt-1 inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!loading && pagination?.total > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Page {page} of {totalPages} · {pagination.total} transactions
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setPage((currentPage) => currentPage - 1)}
                disabled={page === 1}
                className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm transition hover:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={page >= totalPages}
                className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm transition hover:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Transactions;