import React from "react";

function DashboardCard({
    title,
    value,
    icon: Icon,
    iconBg = "bg-cyan-500/10",
    iconColor = "text-cyan-400",
}) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm hover:border-cyan-500/50 transition-all duration-300">

            <div className="flex items-center justify-between">

                <div>
                    <p className="text-sm text-slate-400 font-medium">
                        {title}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-white">
                        {value}
                    </h2>
                </div>

                {Icon && (
                    <div
                        className={`h-14 w-14 rounded-xl flex items-center justify-center ${iconBg}`}
                    >
                        <Icon className={iconColor} size={28} />
                    </div>
                )}

            </div>

        </div>
    );
}

export default DashboardCard;