import Layout from "@/components/layout";
import MissionCard from "@/components/mission-card";
import { useClientMissions } from "@/lib/api";
import { Plus, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function ClientDashboard() {
  const { data: missions, isLoading } = useClientMissions();

  const activeMissions = missions?.filter((m: any) => m.status !== "completed" && m.status !== "cancelled") || [];
  const completedCount = missions?.filter((m: any) => m.status === "completed").length || 0;

  return (
    <Layout role="client">
      <div className="px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Mes Missions
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gère tes demandes actives
            </p>
          </div>
          <Link href="/create-mission">
            <button className="bg-primary text-white px-4 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center gap-2">
              <Plus size={18} /> Nouvelle Mission
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Actives</p>
            <p className="text-3xl font-display font-bold text-foreground">{activeMissions.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Terminées</p>
            <p className="text-3xl font-display font-bold text-foreground">{completedCount}</p>
          </div>
        </div>

        {/* Active Missions List */}
        <div>
          <h3 className="font-bold text-lg mb-4">Actives maintenant</h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : activeMissions.length > 0 ? (
            <div className="space-y-4">
              {activeMissions.map((mission: any) => (
                <MissionCard key={mission.id} mission={mission} role="client" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Aucune mission active. Crée ta première mission !
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
