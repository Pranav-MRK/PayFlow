import {
    LayoutDashboard,
    User,
    Wallet,
    SendHorizontal,
    ReceiptText,
    LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("auth");
        navigate("/login");
    };

    const menu = [
        {
            title: "Overview",
            icon: LayoutDashboard,
            path: "/dashboard",
        },
        {
            title: "Profile",
            icon: User,
            path: "/profile",
        },
        {
            title: "Wallet",
            icon: Wallet,
            path: "/wallet",
        },
        {
            title: "Transfer",
            icon: SendHorizontal,
            path: "/transfer",
        },
        {
            title: "Transactions",
            icon: ReceiptText,
            path: "/transactions",
        },
    ];

    return (
        <aside className="w-64 border-r border-slate-800 bg-slate-950">

            <div className="p-6 space-y-2">

                {menu.map((item) => {

                    const Icon = item.icon;

                    return (

                        <NavLink
                            key={item.title}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-4 py-3 transition
                                ${
                                    isActive
                                        ? "bg-cyan-600 text-white"
                                        : "text-slate-300 hover:bg-slate-900"
                                }`
                            }
                        >
                            <Icon size={20} />
                            {item.title}
                        </NavLink>

                    );

                })}

            </div>

            <div className="absolute bottom-8 w-64 px-6">

                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-400 hover:bg-red-500/10"
                >
                    <LogOut size={20} />
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;