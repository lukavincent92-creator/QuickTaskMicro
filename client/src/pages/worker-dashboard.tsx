import Layout from "@/components/layout";
import MissionCard from "@/components/mission-card";
import { MOCK_MISSIONS, MOCK_USERS, CATEGORIES } from "@/lib/mock-data";
import { Bell, Filter, MapPin } from "lucide-react";
import { useState } from "react";

export default function WorkerDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredMissions = selectedCategory === "all" 
    ? MOCK_MISSIONS 
    : MOCK_MISSIONS.filter(m => m.category === selectedCategory);

  return (
    <Layout role="worker">
      <div className="px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Hello, {MOCK_USERS.worker.name.split(' ')[0]} 👋
            </h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin size={14} className="text-primary" />
              <span>Brooklyn, NY</span>
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
            <p className="text-primary-foreground/80 text-sm font-medium mb-1">Total Earnings</p>
            <h2 className="text-4xl font-display font-bold">${MOCK_USERS.worker.earnings}</h2>
            <div className="mt-4 flex gap-3">
              <button className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30 transition-colors">
                Withdraw
              </button>
              <button className="bg-white text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/90 transition-colors shadow-sm">
                History
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Missions near you</h3>
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
        <div className="grid md:grid-cols-2 gap-4">
          {filteredMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
