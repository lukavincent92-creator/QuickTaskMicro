import { Link } from "wouter";
import { MapPin, Clock, ChevronRight, Dog, Truck, Laptop, Sprout, Sparkles, Wrench } from "lucide-react";

const CATEGORY_ICONS: Record<string, any> = {
  pets: Dog,
  moving: Truck,
  digital: Laptop,
  garden: Sprout,
  cleaning: Sparkles,
  handyman: Wrench,
};

interface MissionCardProps {
  mission: any;
  role?: "worker" | "client";
}

export default function MissionCard({ mission, role = "worker" }: MissionCardProps) {
  const CategoryIcon = CATEGORY_ICONS[mission.category] || Sparkles;
  const distance = mission.isRemote ? "En ligne" : "2.5km";

  return (
    <Link href={`/mission/${mission.id}`}>
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary shrink-0`}>
              <CategoryIcon size={20} />
            </div>
            <div>
              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{mission.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{mission.client?.name || "Client"}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-lg font-bold font-display text-primary">€{mission.price}</span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              {mission.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
            <MapPin size={14} className="text-accent" />
            {distance}
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
            <Clock size={14} className="text-blue-400" />
            {mission.estimatedDuration}
          </div>
        </div>
        
        <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
          <ChevronRight size={20} />
        </div>
      </div>
    </Link>
  );
}
