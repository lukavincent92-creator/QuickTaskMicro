import Layout from "@/components/layout";
import { useForm } from "react-hook-form";
import { ArrowLeft, MapPin, DollarSign, Clock } from "lucide-react";
import { Link, useLocation } from "wouter";
import { CATEGORIES } from "@/lib/mock-data";

export default function CreateMission() {
  const [, setLocation] = useLocation();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Creating mission:", data);
    setLocation("/client-dashboard");
  };

  return (
    <Layout role="client">
      <div className="px-6 py-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/client-dashboard">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
          </Link>
          <h1 className="text-2xl font-display font-bold">New Mission</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <label className="block font-bold text-lg">What needs to be done?</label>
            <input 
              {...register("title")}
              placeholder="e.g. Walk my dog, Assemble table..."
              className="w-full text-xl font-medium border-b-2 border-gray-200 py-2 focus:outline-none focus:border-primary bg-transparent placeholder:text-gray-300 transition-colors"
            />
            <textarea 
              {...register("description")}
              placeholder="Describe the task in detail..."
              rows={4}
              className="w-full bg-gray-50 rounded-xl p-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>

          <div className="space-y-4">
            <label className="block font-bold text-lg">Category</label>
            <div className="grid grid-cols-3 gap-3">
              {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                <label key={cat.id} className="cursor-pointer">
                  <input type="radio" value={cat.id} {...register("category")} className="peer sr-only" />
                  <div className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-100 bg-white peer-checked:border-primary peer-checked:bg-primary/5 transition-all hover:bg-gray-50">
                    {/* Icon placeholder since we can't dynamically render string icons easily here without mapping */}
                    <span className="text-sm font-medium">{cat.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-bold">Price ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-3.5 text-muted-foreground w-5 h-5" />
                <input 
                  type="number"
                  {...register("price")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="25"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-bold">Duration</label>
              <div className="relative">
                <Clock className="absolute left-4 top-3.5 text-muted-foreground w-5 h-5" />
                <input 
                  {...register("duration")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="2 hours"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-bold">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 text-muted-foreground w-5 h-5" />
              <input 
                {...register("location")}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                defaultValue="Current Location"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 rounded-full shadow-xl shadow-primary/30 transition-all active:scale-95"
            >
              Post Mission
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
