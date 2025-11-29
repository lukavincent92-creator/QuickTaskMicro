import { sql } from "drizzle-orm";
import { pgTable, text, integer, real, timestamp, varchar, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// 1. Users Table (Jeunes / Workers)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  age: integer("age").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phone: text("phone"),
  photoUrl: text("photo_url"),
  bio: text("bio"),
  locationLat: real("location_lat"),
  locationLng: real("location_lng"),
  skills: jsonb("skills").$type<string[]>().default([]),
  rating: real("rating").default(0),
  completedMissions: integer("completed_missions").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  rating: true,
  completedMissions: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// 2. Clients Table (Particuliers / Entreprises)
export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userType: text("user_type").notNull(), // 'individual' or 'company'
  companyName: text("company_name"),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phone: text("phone"),
  photoUrl: text("photo_url"),
  billingInfo: jsonb("billing_info").$type<{
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
});
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

// 3. Missions Table
export const missions = pgTable("missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  estimatedDuration: text("estimated_duration").notNull(),
  price: real("price").notNull(),
  location: text("location"),
  locationLat: real("location_lat"),
  locationLng: real("location_lng"),
  isRemote: boolean("is_remote").default(false),
  requiredSkills: jsonb("required_skills").$type<string[]>().default([]),
  status: text("status").notNull().default("open"), // 'open', 'assigned', 'in_progress', 'completed', 'cancelled'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMissionSchema = createInsertSchema(missions).omit({
  id: true,
  createdAt: true,
  status: true,
});
export type InsertMission = z.infer<typeof insertMissionSchema>;
export type Mission = typeof missions.$inferSelect;

// 4. Mission Assignments Table
export const missionAssignments = pgTable("mission_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  missionId: varchar("mission_id").notNull().references(() => missions.id, { onDelete: "cascade" }),
  workerId: varchar("worker_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  status: text("status").notNull().default("assigned"), // 'assigned', 'in_progress', 'completed', 'disputed'
});

export const insertMissionAssignmentSchema = createInsertSchema(missionAssignments).omit({
  id: true,
  assignedAt: true,
  status: true,
});
export type InsertMissionAssignment = z.infer<typeof insertMissionAssignmentSchema>;
export type MissionAssignment = typeof missionAssignments.$inferSelect;

// 5. Payments Table
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  missionId: varchar("mission_id").notNull().references(() => missions.id, { onDelete: "cascade" }),
  clientId: varchar("client_id").notNull().references(() => clients.id, { onDelete: "cascade" }),
  workerId: varchar("worker_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amountTotal: real("amount_total").notNull(),
  amountToWorker: real("amount_to_worker").notNull(),
  platformFee: real("platform_fee").notNull(),
  paymentProvider: text("payment_provider").notNull().default("stripe"),
  transactionId: text("transaction_id"),
  status: text("status").notNull().default("pending"), // 'pending', 'held', 'released', 'refunded'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// 6. Ratings Table
export const ratings = pgTable("ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  missionId: varchar("mission_id").notNull().references(() => missions.id, { onDelete: "cascade" }),
  raterId: varchar("rater_id").notNull(), // Can be client or user
  ratedUserId: varchar("rated_user_id").notNull(), // User being rated
  stars: integer("stars").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
  createdAt: true,
});
export type InsertRating = z.infer<typeof insertRatingSchema>;
export type Rating = typeof ratings.$inferSelect;

// 7. Premium Subscriptions Table
export const premiumSubscriptions = pgTable("premium_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  plan: text("plan").notNull(), // 'monthly', 'yearly'
  status: text("status").notNull().default("active"), // 'active', 'cancelled', 'expired'
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endsAt: timestamp("ends_at"),
  providerTransactionId: text("provider_transaction_id"),
});

export const insertPremiumSubscriptionSchema = createInsertSchema(premiumSubscriptions).omit({
  id: true,
  startedAt: true,
  status: true,
});
export type InsertPremiumSubscription = z.infer<typeof insertPremiumSubscriptionSchema>;
export type PremiumSubscription = typeof premiumSubscriptions.$inferSelect;

// 8. Notifications Table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'mission_accepted', 'payment_received', 'new_message', etc.
  payload: jsonb("payload").$type<Record<string, any>>().default({}),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  isRead: true,
});
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
