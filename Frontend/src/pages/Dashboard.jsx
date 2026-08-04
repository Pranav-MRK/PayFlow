import DashboardLayout from "../layout/DashboardLayout";
import DashboardCard from "../components/DashboardCard";
import RecentTransactions from "../components/RecentTransactions";
import { useCallback,useState,useEffect,useMemo } from "react";
import {Wallet, IndianRupee,BadgeCheck} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getMyAccount } from "../service/userServices";
import { getMyTransactions } from "../service/userServices";

function Dashboard() {
    const { auth } = useAuth();

    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = useCallback(async () => {
    try {
        setLoading(true);
        setError("");

        const [accountsResponse, transactionsResponse] = await Promise.all([
            getMyAccount(),
            getMyTransactions(),
        ]);

        setAccounts(accountsResponse.data);
        setTransactions(transactionsResponse.data);
    } catch (err) {
        setError(
        err.response?.data?.message || "Unable to load dashboard data."
        );
    } finally {
        setLoading(false);
    }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const walletBalance = useMemo(() => {
        return accounts.reduce((total, account) => total + account.balance, 0);
    }, [accounts]);

    const accountIds = useMemo(() => {
        return new Set(accounts.map((account) => account._id));
    }, [accounts]);

    const recentTransactions = useMemo(() => {
        return transactions.map((transaction) => {
            const myLedgerLine = transaction.lines.find((line) => {
            const accountId = line.accountId?._id || line.accountId;
            return accountIds.has(String(accountId));
            });

            const amount = myLedgerLine?.amount || 0;

            return {
            id: transaction._id,
            reference: transaction.reference,
            amount,
            direction: amount >= 0 ? "Received" : "Sent",
            };
        });
    }, [transactions, accountIds]);

    const formatINR = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };
  



    return (

        <DashboardLayout>

            <h1 className="text-4xl font-bold">
                Welcome back, {auth.user.name} 👋
            </h1>

            <p className="text-slate-400 mt-2">
                Here's an overview of your PayFlow account.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                <DashboardCard
                    title="Wallet Balance"
                    value={loading? "Loading...":formatINR(walletBalance)}
                    icon={Wallet}
                    iconBg="bg-cyan-500/10"
                    iconColor="text-cyan-400"
                />

               

            </div>
            <div className="grid grid-cols-3 gap-6 mt-8">

                <div className="col-span-2">
                    <RecentTransactions transactions={recentTransactions} loading={loading} />
                </div>

            </div>

            
        </DashboardLayout>

    );
}

export default Dashboard;







