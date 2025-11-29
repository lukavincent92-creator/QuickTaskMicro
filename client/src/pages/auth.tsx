import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Mail, Lock, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useSignup, useLogin } from "@/lib/api";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
});

const workerSignupSchema = loginSchema.extend({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  age: z.number().min(15, "Minimum 15 ans").max(25, "Maximum 25 ans"),
});

const clientSignupSchema = loginSchema.extend({
  companyName: z.string().optional(),
  userType: z.enum(["individual", "company"]),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<"worker" | "client">("worker");
  
  const signupMutation = useSignup();
  const loginMutation = useLogin();

  const schema = isLogin 
    ? loginSchema 
    : (role === "worker" ? workerSignupSchema : clientSignupSchema);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      age: 18,
      userType: "individual",
    }
  });

  const onSubmit = async (data: any) => {
    try {
      if (isLogin) {
        await loginMutation.mutateAsync({ ...data, role });
        toast.success("Connexion réussie !");
      } else {
        await signupMutation.mutateAsync({ ...data, role });
        toast.success("Compte créé avec succès !");
      }
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    }
  };

  const isLoading = signupMutation.isPending || loginMutation.isPending;

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
          <h2 className="text-3xl font-display font-bold mb-4">Rejoins la communauté</h2>
          <p className="text-muted-foreground">Connecte-toi avec des milliers de jeunes et de voisins qui s'entraident chaque jour.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center p-6 md:p-12 lg:p-24">
        <div className="max-w-md mx-auto w-full space-y-8">
          <Link href="/">
            <button className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft size={16} className="mr-2" /> Retour
            </button>
          </Link>

          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              {isLogin ? "Bon retour" : "Créer un compte"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? "Entre tes identifiants pour te connecter" : "Commence ton aventure QuickTask"}
            </p>
          </div>

          {/* Role Toggle (Only for Signup) */}
          {!isLogin && (
            <div className="bg-secondary p-1 rounded-xl flex">
              <button 
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'worker' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setRole('worker')}
                type="button"
              >
                Je veux Gagner
              </button>
              <button 
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'client' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setRole('client')}
                type="button"
              >
                Je veux Embaucher
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && role === "worker" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Prénom</label>
                    <input 
                      {...register("firstName")}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Alex"
                    />
                    {errors.firstName && <span className="text-red-500 text-xs ml-1">{errors.firstName.message as string}</span>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium ml-1">Nom</label>
                    <input 
                      {...register("lastName")}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Chen"
                    />
                    {errors.lastName && <span className="text-red-500 text-xs ml-1">{errors.lastName.message as string}</span>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1">Âge</label>
                  <input 
                    type="number"
                    {...register("age", { valueAsNumber: true })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="18"
                  />
                  {errors.age && <span className="text-red-500 text-xs ml-1">{errors.age.message as string}</span>}
                </div>
              </>
            )}

            {!isLogin && role === "client" && (
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Nom de l'entreprise (optionnel)</label>
                <input 
                  {...register("companyName")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Mon Entreprise"
                />
              </div>
            )}

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
              <label className="text-sm font-medium ml-1">Mot de passe</label>
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
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Chargement..." : (isLogin ? "Se connecter" : "Créer mon compte")}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-bold hover:underline"
              >
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
