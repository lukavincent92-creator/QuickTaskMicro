import Layout from "@/components/layout";
import { useRoute, Link } from "wouter";
import { useMission, useAcceptMission } from "@/lib/api";
import { ArrowLeft, MapPin, Clock, ShieldCheck, Share2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function MissionDetails() {
  const [, params] = useRoute("/mission/:id");
  const { data: missionData, isLoading } = useMission(params?.id || "");
  const acceptMutation = useAcceptMission();
  const [isAccepted, setIsAccepted] = useState(false);

  const mission = missionData;

  const handleAccept = async () => {
    if (!mission?.id) return;
    
    try {
      await acceptMutation.mutateAsync(mission.id);
      setIsAccepted(true);
      toast.success("Mission acceptée ! 🎉");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'acceptation");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!mission) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Mission introuvable</p>
        </div>
      </Layout>
    );
  }

  const isAlreadyAssigned = mission.status !== "open";

  return (
    <Layout>
      <div className="relative">
        {/* Header Image / Map Placeholder */}
        <div className="h-64 bg-gray-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
          <img 
             src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&h=400"
             alt="Map" 
             className="w-full h-full object-cover opacity-50 grayscale"
          />
          <Link href="/dashboard">
            <button className="absolute top-6 left-6 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm hover:bg-white transition-colors">
              <ArrowLeft size={24} />
            </button>
          </Link>
        </div>

        <div className="px-6 -mt-10 relative z-10 pb-24">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-2xl font-display font-bold leading-tight max-w-[70%]">
                {mission.title}
              </h1>
              <div className="flex flex-col items-end">
                <span className="text-3xl font-display font-bold text-primary">€{mission.price}</span>
                <span className="text-xs text-muted-foreground font-bold uppercase">Prix fixe</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                <img src={mission.client?.photoUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100"} alt={mission.client?.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-foreground">{mission.client?.name}</p>
                <div className="flex items-center gap-1 text-xs text-orange-500 font-bold">
                  <span>★ 4.9</span>
                  <span className="text-muted-foreground font-medium">• Client vérifié</span>
                </div>
              </div>
              <button className="ml-auto p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-muted-foreground">
                <Share2 size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Description</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {mission.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock size={16} />
                    <span className="text-xs font-bold uppercase">Durée</span>
                  </div>
                  <p className="font-bold">{mission.estimatedDuration}</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MapPin size={16} />
                    <span className="text-xs font-bold uppercase">Localisation</span>
                  </div>
                  <p className="font-bold">{mission.location || (mission.isRemote ? "En ligne" : "Paris")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100">
                <ShieldCheck size={24} />
                <div className="text-sm">
                  <p className="font-bold">Paiement sécurisé</p>
                  <p className="opacity-80">L'argent est gardé en dépôt jusqu'à la fin.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 z-40 flex items-center justify-center md:hidden">
           <button 
            onClick={handleAccept}
            disabled={isAlreadyAssigned || isAccepted || acceptMutation.isPending}
            className={`w-full max-w-md h-14 rounded-full font-bold text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              isAccepted || isAlreadyAssigned
              ? "bg-green-500 text-white shadow-green-500/30" 
              : "bg-primary text-white shadow-primary/30 hover:bg-primary/90"
            }`}
           >
             {acceptMutation.isPending ? (
               <>
                 <Loader2 className="w-5 h-5 animate-spin" />
                 Chargement...
               </>
             ) : isAccepted ? (
               "Mission acceptée !"
             ) : isAlreadyAssigned ? (
               "Déjà assignée"
             ) : (
               "Accepter la mission"
             )}
           </button>
        </div>
        
        {/* Desktop Action Bar (hidden on mobile) */}
         <div className="hidden md:flex justify-end px-6 py-8">
           <button 
            onClick={handleAccept}
            disabled={isAlreadyAssigned || isAccepted || acceptMutation.isPending}
            className={`px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              isAccepted || isAlreadyAssigned
              ? "bg-green-500 text-white shadow-green-500/30" 
              : "bg-primary text-white shadow-primary/30 hover:bg-primary/90"
            }`}
           >
             {acceptMutation.isPending ? (
               <>
                 <Loader2 className="w-5 h-5 inline animate-spin mr-2" />
                 Chargement...
               </>
             ) : isAccepted ? (
               "Mission acceptée !"
             ) : isAlreadyAssigned ? (
               "Déjà assignée"
             ) : (
               "Accepter la mission"
             )}
           </button>
        </div>
      </div>
    </Layout>
  );
}
