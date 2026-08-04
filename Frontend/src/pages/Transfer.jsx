import { useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, SendHorizontal } from "lucide-react";

import DashboardLayout from "../layout/DashboardLayout";
import { transferFunds } from "../service/transactionService";

function Transfer() {
  const navigate = useNavigate();

  const receiverIdInputId = useId();
  const amountInputId = useId();

  const idempotencyKeyRef = useRef(null);

  const [formData, setFormData] = useState({
    receiverUserId: "",
    amount: "",
    currency: "INR",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    idempotencyKeyRef.current = null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const idempotencyKey =
      idempotencyKeyRef.current || crypto.randomUUID();

    idempotencyKeyRef.current = idempotencyKey;

    try {
      const result = await transferFunds({
        ...formData,
        amount: Number(formData.amount),
        idempotencyKey,
      });

      setSuccess(
        result.data?.message || "Transfer completed successfully."
      );

      setFormData({
        receiverUserId: "",
        amount: "",
        currency: "INR",
      });

      idempotencyKeyRef.current = null;
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to complete transfer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold">Transfer Funds</h1>

        <p className="mt-2 text-slate-400">
          Send INR securely to another PayFlow merchant.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor={receiverIdInputId}
                className="text-sm text-slate-300"
              >
                Receiver User ID
              </label>

              <input
                id={receiverIdInputId}
                name="receiverUserId"
                value={formData.receiverUserId}
                onChange={handleChange}
                placeholder="MongoDB user ID of the receiver"
                required
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
              />
            </div>

            <div>
              <label
                htmlFor={amountInputId}
                className="text-sm text-slate-300"
              >
                Amount in INR
              </label>

              <input
                id={amountInputId}
                name="amount"
                type="number"
                min="1"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                placeholder="100"
                required
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Currency</label>

              <input
                value="INR"
                disabled
                className="mt-2 w-full cursor-not-allowed rounded-xl border border-slate-700 bg-slate-800 p-4 text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-4 font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                "Processing transfer..."
              ) : (
                <>
                  Send Funds
                  <SendHorizontal size={18} />
                </>
              )}
            </button>
          </form>

          {success && (
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300"
            >
              View updated dashboard
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Transfer;