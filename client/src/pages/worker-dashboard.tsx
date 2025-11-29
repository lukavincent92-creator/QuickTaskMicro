import Layout from "@/components/layout";
import MissionCard from "@/components/mission-card";
import { useMissions, useCurrentUser, useWorkerPayments } from "@/lib/api";
import { Bell, Filter, MapPin, Loader2 } from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  { id: "all", label: "Tout" },
  { id: "pets", label: "Animaux" },
  { id: "moving", label: "Déménagement" },
  { id: "digital", label: "Digital" },
  { id: "garden", label: "Jardin" },
  { id: "cleaning", label: "Ménage" },
  { id: "handyman", label: "Bricolage" },
];

export default function WorkerDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: currentUserData, isLoading: userLoading } = useCurrentUser();
  const { data: missions, isLoading: missionsLoading } = useMissions({
    status: "open",
    category: selectedCategory === "all" ? undefined : selectedCategory,
  });
  const { data: payments } = useWorkerPayments();

  const user = currentUserData?.user;
  const totalEarnings = payments?.reduce((sum: number, p: any) => sum + p.amountToWorker, 0) || 0;

  if (userLoading) {
    return (
      <Layout role="worker">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="worker">
      <div className="px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Bonjour, {user?.firstName || "Worker"} 👋
            </h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin size={14} className="text-primary" />
              <span>Paris, France</span>
            </div>
          </div>
          <div className="relative p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
            <Bell size={24} className="text-foreground" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
        </div>

        {/* Earnings Card */}
        <div className="bg-primary text-white rounded-3xl p-6 shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="relative z-10">
            <p className="text-primary-foreground/80 text-sm font-medium mb-1">Gains totaux</p>
            <h2 className="text-4xl font-display font-bold">€{totalEarnings.toFixed(2)}</h2>
            <div className="mt-4 flex gap-3">
              <button className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition-colors">
                Retirer
              </button>
              <button className="bg-white text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/90 transition-colors shadow-sm">
                Historique
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Missions près de toi</h3>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Filter size={20} className="text-muted-foreground" />
            </button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                  selectedCategory === cat.id 
                    ? "bg-foreground text-white border-foreground shadow-md" 
                    : "bg-white text-muted-foreground border-gray-200 hover:border-gray-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mission Feed */}
        {missionsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {missions && missions.length > 0 ? (
              missions.map((mission: any) => (
                <MissionCard key={mission.id} mission={mission} />
              ))
            ) : (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                Aucune mission disponible pour le moment
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
