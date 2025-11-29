import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import session from "express-session";
import { insertUserSchema, insertClientSchema, insertMissionSchema, insertMissionAssignmentSchema, insertRatingSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    clientId?: string;
    userType?: "worker" | "client";
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "quicktask-secret-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    })
  );

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId && !req.session.clientId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // ============ AUTHENTICATION ROUTES ============

  // Worker Signup
  app.post("/api/auth/signup/worker", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      // Check if email exists
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.passwordHash, 10);
      
      // Create user
      const user = await storage.createUser({
        ...data,
        passwordHash,
      });

      // Set session
      req.session.userId = user.id;
      req.session.userType = "worker";

      res.json({ 
        user: { 
          id: user.id, 
          firstName: user.firstName, 
          lastName: user.lastName, 
          email: user.email,
          role: "worker"
        } 
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: fromError(error).toString() });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Client Signup
  app.post("/api/auth/signup/client", async (req, res) => {
    try {
      const data = insertClientSchema.parse(req.body);
      
      const existingClient = await storage.getClientByEmail(data.email);
      if (existingClient) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const passwordHash = await bcrypt.hash(data.passwordHash, 10);
      
      const client = await storage.createClient({
        ...data,
        passwordHash,
      });

      req.session.clientId = client.id;
      req.session.userType = "client";

      res.json({ 
        client: { 
          id: client.id, 
          email: client.email,
          companyName: client.companyName,
          role: "client"
        } 
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: fromError(error).toString() });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password, role } = req.body;

      if (role === "worker") {
        const user = await storage.getUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        req.session.userId = user.id;
        req.session.userType = "worker";

        return res.json({
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: "worker",
            rating: user.rating,
            completedMissions: user.completedMissions,
          },
        });
      } else {
        const client = await storage.getClientByEmail(email);
        if (!client || !(await bcrypt.compare(password, client.passwordHash))) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        req.session.clientId = client.id;
        req.session.userType = "client";

        return res.json({
          client: {
            id: client.id,
            email: client.email,
            companyName: client.companyName,
            role: "client",
          },
        });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    try {
      if (req.session.userId) {
        const user = await storage.getUser(req.session.userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.json({
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: "worker",
            rating: user.rating,
            completedMissions: user.completedMissions,
            photoUrl: user.photoUrl,
          },
        });
      } else if (req.session.clientId) {
        const client = await storage.getClient(req.session.clientId);
        if (!client) {
          return res.status(404).json({ message: "Client not found" });
        }
        return res.json({
          client: {
            id: client.id,
            email: client.email,
            companyName: client.companyName,
            role: "client",
            photoUrl: client.photoUrl,
          },
        });
      }
      
      res.status(401).json({ message: "Not authenticated" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============ MISSIONS ROUTES ============

  // Get all missions (with filters)
  app.get("/api/missions", async (req, res) => {
    try {
      const { status, category } = req.query;
      const missions = await storage.getAllMissions({
        status: status as string | undefined,
        category: category as string | undefined,
      });

      // Get client info for each mission
      const missionsWithClients = await Promise.all(
        missions.map(async (mission) => {
          const client = await storage.getClient(mission.clientId);
          return {
            ...mission,
            client: client ? {
              name: client.companyName || "Client",
              email: client.email,
              photoUrl: client.photoUrl,
            } : null,
          };
        })
      );

      res.json(missionsWithClients);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single mission
  app.get("/api/missions/:id", async (req, res) => {
    try {
      const mission = await storage.getMission(req.params.id);
      if (!mission) {
        return res.status(404).json({ message: "Mission not found" });
      }

      const client = await storage.getClient(mission.clientId);
      const assignment = await storage.getAssignment(mission.id);

      res.json({
        ...mission,
        client: client ? {
          name: client.companyName || "Client",
          email: client.email,
          photoUrl: client.photoUrl,
        } : null,
        assignment: assignment || null,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create mission (clients only)
  app.post("/api/missions", requireAuth, async (req, res) => {
    try {
      if (!req.session.clientId) {
        return res.status(403).json({ message: "Only clients can create missions" });
      }

      const data = insertMissionSchema.parse({
        ...req.body,
        clientId: req.session.clientId,
      });

      const mission = await storage.createMission(data);
      res.status(201).json(mission);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: fromError(error).toString() });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Get client's missions
  app.get("/api/clients/missions", requireAuth, async (req, res) => {
    try {
      if (!req.session.clientId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const missions = await storage.getMissionsByClient(req.session.clientId);
      res.json(missions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============ MISSION ASSIGNMENTS ROUTES ============

  // Accept mission (workers only)
  app.post("/api/missions/:id/accept", requireAuth, async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(403).json({ message: "Only workers can accept missions" });
      }

      const mission = await storage.getMission(req.params.id);
      if (!mission) {
        return res.status(404).json({ message: "Mission not found" });
      }

      if (mission.status !== "open") {
        return res.status(400).json({ message: "Mission is not available" });
      }

      // Check if already assigned
      const existingAssignment = await storage.getAssignment(mission.id);
      if (existingAssignment) {
        return res.status(400).json({ message: "Mission already assigned" });
      }

      // Create assignment
      const assignment = await storage.createAssignment({
        missionId: mission.id,
        workerId: req.session.userId,
      });

      // Update mission status
      await storage.updateMissionStatus(mission.id, "assigned");

      res.status(201).json(assignment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Complete mission
  app.post("/api/missions/:id/complete", requireAuth, async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const assignment = await storage.getAssignment(req.params.id);
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      if (assignment.workerId !== req.session.userId) {
        return res.status(403).json({ message: "Not your assignment" });
      }

      await storage.completeAssignment(assignment.id);
      await storage.updateMissionStatus(req.params.id, "completed");
      await storage.incrementCompletedMissions(req.session.userId);

      res.json({ message: "Mission completed" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get worker's assignments
  app.get("/api/workers/assignments", requireAuth, async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const assignments = await storage.getAssignmentsByWorker(req.session.userId);
      
      // Get mission details for each assignment
      const assignmentsWithMissions = await Promise.all(
        assignments.map(async (assignment) => {
          const mission = await storage.getMission(assignment.missionId);
          return {
            ...assignment,
            mission,
          };
        })
      );

      res.json(assignmentsWithMissions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============ RATINGS ROUTES ============

  // Create rating
  app.post("/api/ratings", requireAuth, async (req, res) => {
    try {
      const raterId = req.session.userId || req.session.clientId;
      if (!raterId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data = insertRatingSchema.parse({
        ...req.body,
        raterId,
      });

      const rating = await storage.createRating(data);

      // Update user's average rating
      const allRatings = await storage.getRatingsByUser(data.ratedUserId);
      const avgRating = allRatings.reduce((sum, r) => sum + r.stars, 0) / allRatings.length;
      await storage.updateUserRating(data.ratedUserId, avgRating);

      res.status(201).json(rating);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: fromError(error).toString() });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Get user ratings
  app.get("/api/users/:id/ratings", async (req, res) => {
    try {
      const ratings = await storage.getRatingsByUser(req.params.id);
      res.json(ratings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============ PAYMENTS ROUTES ============

  // Get worker payments
  app.get("/api/workers/payments", requireAuth, async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const payments = await storage.getPaymentsByWorker(req.session.userId);
      res.json(payments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}
