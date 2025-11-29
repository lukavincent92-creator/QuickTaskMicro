import Layout from "@/components/layout";
import { MOCK_USERS } from "@/lib/mock-data";
import { Settings, LogOut, ChevronRight, Star, Award, CreditCard } from "lucide-react";

export default function Profile() {
  const user = MOCK_USERS.worker;

  return (
    <Layout>
      <div className="px-6 py-8 pb-24">
        <h1 className="text-2xl font-display font-bold mb-6">Profile</h1>

        {/* User Card */}
        <div className="flex items-center gap-4 mb-8">
           <div className="w-20 h-20 rounded-full bg-gray-200 p-1 border-2 border-primary">
             <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
           </div>
           <div>
             <h2 className="text-xl font-bold">{user.name}</h2>
             <div className="flex items-center gap-1 text-orange-500 font-bold text-sm">
               <Star size={16} fill="currentColor" />
               <span>{user.rating}</span>
               <span className="text-muted-foreground font-medium">• {user.completedMissions} missions</span>
             </div>
           </div>
        </div>

        {/* Premium Banner */}
        <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-primary/25 mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-bold font-display text-lg mb-1">Go Premium</h3>
            <p className="text-primary-foreground/80 text-sm mb-4 max-w-[80%]">Get access to exclusive missions and lower fees.</p>
            <button className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
              Upgrade Now
            </button>
          </div>
          <Award className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-white/10 rotate-12" />
        </div>

        {/* Settings List */}
        <div className="space-y-2">
          {[
            { icon: CreditCard, label: "Payment Methods" },
            { icon: Settings, label: "Preferences" },
            { icon: Award, label: "Skills & Badges" },
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground group-hover:text-primary transition-colors">
                  <item.icon size={20} />
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight size={20} className="text-gray-300" />
            </button>
          ))}
          
          <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:bg-red-50 transition-colors group mt-8 text-red-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                  <LogOut size={20} />
                </div>
                <span className="font-medium">Log Out</span>
              </div>
          </button>
        </div>
      </div>
    </Layout>
  );
}
