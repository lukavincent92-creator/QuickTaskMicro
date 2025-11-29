import Layout from "@/components/layout";
import MissionCard from "@/components/mission-card";
import { MOCK_MISSIONS, MOCK_USERS } from "@/lib/mock-data";
import { Plus } from "lucide-react";
import { Link } from "wouter";

export default function ClientDashboard() {
  // Filter missions for "client" view (just reusing mock data for demo)
  const myMissions = MOCK_MISSIONS.slice(0, 3);

  return (
    <Layout role="client">
      <div className="px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              My Missions
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your active requests
            </p>
          </div>
          <Link href="/create-mission">
            <button className="bg-primary text-white px-4 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center gap-2">
              <Plus size={18} /> New Mission
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Active</p>
            <p className="text-3xl font-display font-bold text-foreground">2</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Completed</p>
            <p className="text-3xl font-display font-bold text-foreground">14</p>
          </div>
        </div>

        {/* Active Missions List */}
        <div>
          <h3 className="font-bold text-lg mb-4">Active Now</h3>
          <div className="space-y-4">
            {myMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} role="client" />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
