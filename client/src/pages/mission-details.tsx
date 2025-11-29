import Layout from "@/components/layout";
import { useRoute, Link } from "wouter";
import { MOCK_MISSIONS } from "@/lib/mock-data";
import { ArrowLeft, MapPin, Clock, ShieldCheck, Share2 } from "lucide-react";
import { useState } from "react";

export default function MissionDetails() {
  const [, params] = useRoute("/mission/:id");
  const mission = MOCK_MISSIONS.find(m => m.id === params?.id) || MOCK_MISSIONS[0];
  const [isAccepted, setIsAccepted] = useState(false);

  return (
    <Layout>
      <div className="relative">
        {/* Header Image / Map Placeholder */}
        <div className="h-64 bg-gray-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
          <img 
             src="https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=13&size=600x300&maptype=roadmap&style=feature:all|saturation:-100&key=YOUR_API_KEY_HERE" 
             alt="Map" 
             className="w-full h-full object-cover opacity-50 grayscale"
             onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&h=400"}
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
                <span className="text-3xl font-display font-bold text-primary">${mission.price}</span>
                <span className="text-xs text-muted-foreground font-bold uppercase">Fixed Price</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                <img src={mission.client.avatar} alt={mission.client.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-foreground">{mission.client.name}</p>
                <div className="flex items-center gap-1 text-xs text-orange-500 font-bold">
                  <span>★ 4.9</span>
                  <span className="text-muted-foreground font-medium">• Verified Client</span>
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
                    <span className="text-xs font-bold uppercase">Duration</span>
                  </div>
                  <p className="font-bold">{mission.duration}</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MapPin size={16} />
                    <span className="text-xs font-bold uppercase">Distance</span>
                  </div>
                  <p className="font-bold">{mission.distance}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100">
                <ShieldCheck size={24} />
                <div className="text-sm">
                  <p className="font-bold">Payment Secured</p>
                  <p className="opacity-80">Money is held in escrow until completion.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 z-40 flex items-center justify-center md:hidden">
           <button 
            onClick={() => setIsAccepted(true)}
            disabled={isAccepted}
            className={`w-full max-w-md h-14 rounded-full font-bold text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
              isAccepted 
              ? "bg-green-500 text-white shadow-green-500/30" 
              : "bg-primary text-white shadow-primary/30 hover:bg-primary/90"
            }`}
           >
             {isAccepted ? "Mission Accepted!" : "Accept Mission"}
           </button>
        </div>
        
        {/* Desktop Action Bar (hidden on mobile) */}
         <div className="hidden md:flex justify-end px-6 py-8">
           <button 
            onClick={() => setIsAccepted(true)}
            disabled={isAccepted}
            className={`px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all hover:scale-105 active:scale-95 ${
              isAccepted 
              ? "bg-green-500 text-white shadow-green-500/30" 
              : "bg-primary text-white shadow-primary/30 hover:bg-primary/90"
            }`}
           >
             {isAccepted ? "Mission Accepted!" : "Accept Mission"}
           </button>
        </div>
      </div>
    </Layout>
  );
}
