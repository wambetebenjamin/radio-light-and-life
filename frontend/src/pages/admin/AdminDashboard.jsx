import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import AdminPresenters from "./AdminPresenters";
import AdminSchedule from "./AdminSchedule";
import AdminNews from "./AdminNews";
import AdminSiteImages from "./AdminSiteImages";
import AdminApplications from "./AdminApplications";
import AdminEncouragements from "./AdminEncouragements";
import AdminSongRequests from "./AdminSongRequests";

const TABS = [
  { id: "presenters", label: "Presenters" },
  { id: "schedule", label: "Schedule" },
  { id: "news", label: "News" },
  { id: "images", label: "Site Images" },
  { id: "applications", label: "Applications" },
  { id: "encouragements", label: "Word of the Day" },
  { id: "songs", label: "Song Requests" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("presenters");

  const logout = () => {
    api.logout();
    navigate("/admin/login");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-clay">Station admin</p>
          <h1 className="font-display text-3xl font-bold text-forest mt-1">Content dashboard</h1>
        </div>
        <button onClick={logout} className="text-sm font-medium text-clay hover:underline">Log out</button>
      </div>

      <div className="flex gap-2 mb-8 border-b border-forest/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id ? "border-forest text-forest" : "border-transparent text-ink/60 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "presenters" && <AdminPresenters />}
      {tab === "schedule" && <AdminSchedule />}
      {tab === "news" && <AdminNews />}
      {tab === "images" && <AdminSiteImages />}
      {tab === "applications" && <AdminApplications />}
      {tab === "encouragements" && <AdminEncouragements />}
      {tab === "songs" && <AdminSongRequests />}
    </div>
  );
}
