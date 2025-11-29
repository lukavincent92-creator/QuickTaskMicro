import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import { motion } from "framer-motion";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<"worker" | "client">("worker");
  const [, setLocation] = useLocation();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = (data: any) => {
    console.log(data);
    // Mock login redirect
    if (role === "worker") {
      setLocation("/dashboard");
    } else {
      setLocation("/client-dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Side - Visual */}
      <div className="hidden md:flex w-1/2 bg-secondary/30 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="relative z-10 max-w-md text-center">
          <img 
            src="/attached_assets/generated_images/abstract_3d_shapes_with_soft_neon_colors.png" 
            className="w-full rounded-3xl shadow-2xl shadow-primary/20 mb-8 rotate-3 hover:rotate-0 transition-all duration-700"
            alt="Auth Visual"
          />
          <h2 className="text-3xl font-display font-bold mb-4">Join the community</h2>
          <p className="text-muted-foreground">Connect with thousands of young people and neighbors helping each other every day.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center p-6 md:p-12 lg:p-24">
        <div className="max-w-md mx-auto w-full space-y-8">
          <Link href="/">
            <button className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft size={16} className="mr-2" /> Back to Home
            </button>
          </Link>

          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? "Enter your details to access your account" : "Start your journey with QuickTask today"}
            </p>
          </div>

          {/* Role Toggle (Only for Signup) */}
          {!isLogin && (
            <div className="bg-secondary p-1 rounded-xl flex">
              <button 
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'worker' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setRole('worker')}
              >
                I want to Earn
              </button>
              <button 
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'client' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setRole('client')}
              >
                I want to Hire
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-muted-foreground w-5 h-5" />
                <input 
                  {...register("email")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="hello@example.com"
                />
              </div>
              {errors.email && <span className="text-red-500 text-xs ml-1">{errors.email.message as string}</span>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-muted-foreground w-5 h-5" />
                <input 
                  type="password"
                  {...register("password")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <span className="text-red-500 text-xs ml-1">{errors.password.message as string}</span>}
            </div>

            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-bold hover:underline"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
