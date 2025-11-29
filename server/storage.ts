import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq, and, desc, sql } from "drizzle-orm";
import ws from "ws";
import * as schema from "@shared/schema";
import type {
  User,
  InsertUser,
  Client,
  InsertClient,
  Mission,
  InsertMission,
  MissionAssignment,
  InsertMissionAssignment,
  Payment,
  InsertPayment,
  Rating,
  InsertRating,
  PremiumSubscription,
  InsertPremiumSubscription,
  Notification,
  InsertNotification,
} from "@shared/schema";

neonConfig.webSocketConstructor = ws;

export interface IStorage {
  // Users (Workers)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRating(userId: string, newRating: number): Promise<void>;
  incrementCompletedMissions(userId: string): Promise<void>;
  
  // Clients
  getClient(id: string): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  
  // Missions
  getMission(id: string): Promise<Mission | undefined>;
  getAllMissions(filters?: { status?: string; category?: string }): Promise<Mission[]>;
  getMissionsByClient(clientId: string): Promise<Mission[]>;
  createMission(mission: InsertMission): Promise<Mission>;
  updateMissionStatus(id: string, status: string): Promise<void>;
  
  // Mission Assignments
  getAssignment(missionId: string): Promise<MissionAssignment | undefined>;
  getAssignmentsByWorker(workerId: string): Promise<MissionAssignment[]>;
  createAssignment(assignment: InsertMissionAssignment): Promise<MissionAssignment>;
  completeAssignment(id: string): Promise<void>;
  
  // Payments
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: string, status: string, transactionId?: string): Promise<void>;
  getPaymentsByWorker(workerId: string): Promise<Payment[]>;
  
  // Ratings
  createRating(rating: InsertRating): Promise<Rating>;
  getRatingsByUser(userId: string): Promise<Rating[]>;
  
  // Premium Subscriptions
  createSubscription(subscription: InsertPremiumSubscription): Promise<PremiumSubscription>;
  getActiveSubscription(userId: string): Promise<PremiumSubscription | undefined>;
  
  // Notifications
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  private db;

  constructor(connectionString: string) {
    const pool = new Pool({ connectionString });
    this.db = drizzle(pool, { schema });
  }

  // Users (Workers)
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(schema.users).where(eq(schema.users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(schema.users).where(eq(schema.users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.insert(schema.users).values(user).returning();
    return result[0];
  }

  async updateUserRating(userId: string, newRating: number): Promise<void> {
    await this.db.update(schema.users).set({ rating: newRating }).where(eq(schema.users.id, userId));
  }

  async incrementCompletedMissions(userId: string): Promise<void> {
    await this.db
      .update(schema.users)
      .set({ completedMissions: sql`${schema.users.completedMissions} + 1` })
      .where(eq(schema.users.id, userId));
  }

  // Clients
  async getClient(id: string): Promise<Client | undefined> {
    const result = await this.db.select().from(schema.clients).where(eq(schema.clients.id, id));
    return result[0];
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    const result = await this.db.select().from(schema.clients).where(eq(schema.clients.email, email));
    return result[0];
  }

  async createClient(client: InsertClient): Promise<Client> {
    const result = await this.db.insert(schema.clients).values(client).returning();
    return result[0];
  }

  // Missions
  async getMission(id: string): Promise<Mission | undefined> {
    const result = await this.db.select().from(schema.missions).where(eq(schema.missions.id, id));
    return result[0];
  }

  async getAllMissions(filters?: { status?: string; category?: string }): Promise<Mission[]> {
    let query = this.db.select().from(schema.missions);
    
    const conditions = [];
    if (filters?.status) {
      conditions.push(eq(schema.missions.status, filters.status));
    }
    if (filters?.category) {
      conditions.push(eq(schema.missions.category, filters.category));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return query.orderBy(desc(schema.missions.createdAt));
  }

  async getMissionsByClient(clientId: string): Promise<Mission[]> {
    return this.db
      .select()
      .from(schema.missions)
      .where(eq(schema.missions.clientId, clientId))
      .orderBy(desc(schema.missions.createdAt));
  }

  async createMission(mission: InsertMission): Promise<Mission> {
    const result = await this.db.insert(schema.missions).values(mission).returning();
    return result[0];
  }

  async updateMissionStatus(id: string, status: string): Promise<void> {
    await this.db.update(schema.missions).set({ status }).where(eq(schema.missions.id, id));
  }

  // Mission Assignments
  async getAssignment(missionId: string): Promise<MissionAssignment | undefined> {
    const result = await this.db
      .select()
      .from(schema.missionAssignments)
      .where(eq(schema.missionAssignments.missionId, missionId));
    return result[0];
  }

  async getAssignmentsByWorker(workerId: string): Promise<MissionAssignment[]> {
    return this.db
      .select()
      .from(schema.missionAssignments)
      .where(eq(schema.missionAssignments.workerId, workerId))
      .orderBy(desc(schema.missionAssignments.assignedAt));
  }

  async createAssignment(assignment: InsertMissionAssignment): Promise<MissionAssignment> {
    const result = await this.db.insert(schema.missionAssignments).values(assignment).returning();
    return result[0];
  }

  async completeAssignment(id: string): Promise<void> {
    await this.db
      .update(schema.missionAssignments)
      .set({ 
        completedAt: new Date(),
        status: 'completed'
      })
      .where(eq(schema.missionAssignments.id, id));
  }

  // Payments
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const result = await this.db.insert(schema.payments).values(payment).returning();
    return result[0];
  }

  async updatePaymentStatus(id: string, status: string, transactionId?: string): Promise<void> {
    const updateData: any = { status };
    if (transactionId) {
      updateData.transactionId = transactionId;
    }
    await this.db.update(schema.payments).set(updateData).where(eq(schema.payments.id, id));
  }

  async getPaymentsByWorker(workerId: string): Promise<Payment[]> {
    return this.db
      .select()
      .from(schema.payments)
      .where(eq(schema.payments.workerId, workerId))
      .orderBy(desc(schema.payments.createdAt));
  }

  // Ratings
  async createRating(rating: InsertRating): Promise<Rating> {
    const result = await this.db.insert(schema.ratings).values(rating).returning();
    return result[0];
  }

  async getRatingsByUser(userId: string): Promise<Rating[]> {
    return this.db
      .select()
      .from(schema.ratings)
      .where(eq(schema.ratings.ratedUserId, userId))
      .orderBy(desc(schema.ratings.createdAt));
  }

  // Premium Subscriptions
  async createSubscription(subscription: InsertPremiumSubscription): Promise<PremiumSubscription> {
    const result = await this.db.insert(schema.premiumSubscriptions).values(subscription).returning();
    return result[0];
  }

  async getActiveSubscription(userId: string): Promise<PremiumSubscription | undefined> {
    const result = await this.db
      .select()
      .from(schema.premiumSubscriptions)
      .where(
        and(
          eq(schema.premiumSubscriptions.userId, userId),
          eq(schema.premiumSubscriptions.status, 'active')
        )
      );
    return result[0];
  }

  // Notifications
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const result = await this.db.insert(schema.notifications).values(notification).returning();
    return result[0];
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return this.db
      .select()
      .from(schema.notifications)
      .where(eq(schema.notifications.userId, userId))
      .orderBy(desc(schema.notifications.createdAt));
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await this.db.update(schema.notifications).set({ isRead: true }).where(eq(schema.notifications.id, id));
  }
}

export const storage = new DatabaseStorage(process.env.DATABASE_URL!);
