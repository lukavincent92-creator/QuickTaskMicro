import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white selection:bg-primary selection:text-white font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full absolute top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold font-display text-xl shadow-lg shadow-primary/20">
            Q
          </div>
          <span className="text-xl font-bold font-display tracking-tight text-foreground">QuickTask</span>
        </div>
        <Link href="/auth">
          <button className="px-5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition-all">
            Sign In
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-secondary-foreground/5 text-secondary-foreground/80 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              Live in Paris, Lyon & Bordeaux
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight text-foreground">
              Make money <br />
              <span className="text-primary">doing simple tasks.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              The easiest way for students to earn cash. Help neighbors with groceries, cleaning, or tech support. No resume needed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth?role=worker">
                <button className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                  Start Earning <ArrowRight size={20} />
                </button>
              </Link>
              <Link href="/auth?role=client">
                <button className="h-14 px-8 rounded-full bg-white border-2 border-gray-100 hover:border-gray-200 text-foreground font-bold text-lg transition-all hover:bg-gray-50 flex items-center justify-center">
                  Post a Mission
                </button>
              </Link>
            </div>

            <div className="pt-8 flex items-center gap-4 text-sm text-muted-foreground font-medium">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <span>Trusted by 10,000+ users</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20 border-8 border-white rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <img 
                src="/attached_assets/generated_images/abstract_3d_shapes_with_soft_neon_colors.png" 
                alt="App Preview" 
                className="w-full h-auto object-cover"
              />
              
              {/* Floating UI Card Mockup */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100" alt="Sarah" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Walk my Golden Retriever</h4>
                    <p className="text-sm text-muted-foreground">Central Park • 0.8km away</p>
                  </div>
                  <div className="ml-auto text-xl font-bold text-primary">$15</div>
                </div>
                <div className="flex gap-2">
                   <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">Pets</span>
                   <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold">Instant Pay</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Why QuickTask?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">We built the safest and fastest way to get things done in your neighborhood.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Instant Payments",
                desc: "Get paid immediately after completing a mission. No waiting for end of month.",
                color: "text-yellow-500",
                bg: "bg-yellow-50"
              },
              {
                icon: Shield,
                title: "Verified & Secure",
                desc: "Every user is verified. Payments are held in escrow until the job is done.",
                color: "text-primary",
                bg: "bg-primary/10"
              },
              {
                icon: CheckCircle2,
                title: "No Paperwork",
                desc: "Forget about status updates and taxes. We handle the administrative boring stuff.",
                color: "text-accent",
                bg: "bg-accent/10"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className={`w-12 h-12 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold font-display mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
