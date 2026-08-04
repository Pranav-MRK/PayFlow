import { useCallback, useEffect, useState } from "react";
import { BadgeCheck, Mail, User } from "lucide-react";

import DashboardLayout from "../layout/DashboardLayout";
import { getMyProfile } from "../service/userServices";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyProfile();
      setProfile(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "long",
    }).format(new Date(date));
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold">Profile</h1>

        <p className="mt-2 text-slate-400">
          View your PayFlow account details.
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
            Loading profile...
          </div>
        ) : (
          profile && (
            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-2xl font-bold text-cyan-400">
                  {profile.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  <p className="mt-1 text-slate-400">{profile.email}</p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-4">
                  <User className="text-cyan-400" size={20} />

                  <div>
                    <p className="text-sm text-slate-400">Full name</p>
                    <p className="font-medium">{profile.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Mail className="text-cyan-400" size={20} />

                  <div>
                    <p className="text-sm text-slate-400">Email address</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <BadgeCheck className="text-cyan-400" size={20} />

                  <div>
                    <p className="text-sm text-slate-400">Account role</p>
                    <p className="font-medium">{profile.role}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-400">Member since</p>
                  <p className="mt-1 font-medium">
                    {formatDate(profile.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
}

export default Profile;