import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

const API_BASE = "/api";

// Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "worker";
  rating: number;
  completedMissions: number;
  photoUrl?: string;
}

export interface Client {
  id: string;
  email: string;
  companyName?: string;
  role: "client";
  photoUrl?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  location?: string;
  estimatedDuration: string;
  status: string;
  isRemote: boolean;
  client?: {
    name: string;
    email: string;
    photoUrl?: string;
  };
}

// Auth API
export function useSignup() {
  const [, setLocation] = useLocation();
  
  return useMutation({
    mutationFn: async (data: { 
      email: string; 
      password: string; 
      firstName?: string;
      lastName?: string;
      age?: number;
      role: "worker" | "client";
      companyName?: string;
      userType?: string;
    }) => {
      const endpoint = data.role === "worker" ? "/auth/signup/worker" : "/auth/signup/client";
      const payload = data.role === "worker" ? {
        email: data.email,
        passwordHash: data.password,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        age: data.age || 18,
      } : {
        email: data.email,
        passwordHash: data.password,
        userType: data.userType || "individual",
        companyName: data.companyName,
      };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      
      return res.json();
    },
    onSuccess: (data, variables) => {
      if (variables.role === "worker") {
        setLocation("/dashboard");
      } else {
        setLocation("/client-dashboard");
      }
    },
  });
}

export function useLogin() {
  const [, setLocation] = useLocation();
  
  return useMutation({
    mutationFn: async (data: { email: string; password: string; role: "worker" | "client" }) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      
      return res.json();
    },
    onSuccess: (data, variables) => {
      if (variables.role === "worker") {
        setLocation("/dashboard");
      } else {
        setLocation("/client-dashboard");
      }
    },
  });
}

export function useLogout() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE}/auth/logout`, { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation("/");
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/auth/me`);
      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch user");
      }
      return res.json();
    },
    retry: false,
  });
}

// Missions API
export function useMissions(filters?: { status?: string; category?: string }) {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.category) params.append("category", filters.category);
  
  return useQuery({
    queryKey: ["missions", filters],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/missions?${params}`);
      if (!res.ok) throw new Error("Failed to fetch missions");
      return res.json() as Promise<Mission[]>;
    },
  });
}

export function useMission(id: string) {
  return useQuery({
    queryKey: ["mission", id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/missions/${id}`);
      if (!res.ok) throw new Error("Failed to fetch mission");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateMission() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`${API_BASE}/missions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      setLocation("/client-dashboard");
    },
  });
}

export function useClientMissions() {
  return useQuery({
    queryKey: ["clientMissions"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/clients/missions`);
      if (!res.ok) throw new Error("Failed to fetch client missions");
      return res.json();
    },
  });
}

// Assignment API
export function useAcceptMission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (missionId: string) => {
      const res = await fetch(`${API_BASE}/missions/${missionId}/accept`, {
        method: "POST",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      queryClient.invalidateQueries({ queryKey: ["workerAssignments"] });
    },
  });
}

export function useWorkerAssignments() {
  return useQuery({
    queryKey: ["workerAssignments"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/workers/assignments`);
      if (!res.ok) throw new Error("Failed to fetch assignments");
      return res.json();
    },
  });
}

// Payments API
export function useWorkerPayments() {
  return useQuery({
    queryKey: ["workerPayments"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/workers/payments`);
      if (!res.ok) throw new Error("Failed to fetch payments");
      return res.json();
    },
  });
}

// Ratings API
export function useCreateRating() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      missionId: string;
      ratedUserId: string;
      stars: number;
      comment?: string;
    }) => {
      const res = await fetch(`${API_BASE}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}
