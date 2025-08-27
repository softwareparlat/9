import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  integer,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

// Sessions table for session storage
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("client"), // 'admin', 'client', 'partner'
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Partners table
export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  referralCode: varchar("referral_code", { length: 50 }).unique().notNull(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).notNull().default("25.00"),
  totalEarnings: decimal("total_earnings", { precision: 12, scale: 2 }).notNull().default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // 'pending', 'in_progress', 'completed', 'cancelled'
  progress: integer("progress").notNull().default(0), // 0-100
  clientId: integer("client_id").references(() => users.id).notNull(),
  partnerId: integer("partner_id").references(() => partners.id),
  deliveryDate: timestamp("delivery_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Referrals table
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id").references(() => partners.id).notNull(),
  clientId: integer("client_id").references(() => users.id).notNull(),
  projectId: integer("project_id").references(() => projects.id),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // 'pending', 'converted', 'paid'
  commissionAmount: decimal("commission_amount", { precision: 12, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tickets table
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("open"), // 'open', 'in_progress', 'resolved', 'closed'
  priority: varchar("priority", { length: 50 }).notNull().default("medium"), // 'low', 'medium', 'high', 'urgent'
  userId: integer("user_id").references(() => users.id).notNull(),
  projectId: integer("project_id").references(() => projects.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payments table
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // 'pending', 'completed', 'failed'
  paymentMethod: varchar("payment_method", { length: 100 }),
  transactionId: varchar("transaction_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Portfolio table
export const portfolio = pgTable("portfolio", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(), // 'E-commerce', 'Dashboard', 'Mobile App', etc.
  technologies: text("technologies").notNull(), // JSON string with tech stack
  imageUrl: text("image_url").notNull(),
  demoUrl: text("demo_url"),
  completedAt: timestamp("completed_at").notNull(),
  featured: boolean("featured").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull().default("info"), // 'info', 'success', 'warning', 'error'
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Project messages table
export const projectMessages = pgTable("project_messages", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Project files table
export const projectFiles = pgTable("project_files", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: varchar("file_type", { length: 100 }).notNull(),
  uploadedBy: integer("uploaded_by").references(() => users.id).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Project timeline table
export const projectTimeline = pgTable("project_timeline", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("pending"),
  estimatedDate: timestamp("estimated_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Ticket responses table
export const ticketResponses = pgTable("ticket_responses", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").references(() => tickets.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  isFromSupport: boolean("is_from_support").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  partner: one(partners, {
    fields: [users.id],
    references: [partners.userId],
  }),
  projects: many(projects),
  tickets: many(tickets),
  referrals: many(referrals),
  notifications: many(notifications),
}));

export const partnersRelations = relations(partners, ({ one, many }) => ({
  user: one(users, {
    fields: [partners.userId],
    references: [users.id],
  }),
  projects: many(projects),
  referrals: many(referrals),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(users, {
    fields: [projects.clientId],
    references: [users.id],
  }),
  partner: one(partners, {
    fields: [projects.partnerId],
    references: [partners.id],
  }),
  payments: many(payments),
  tickets: many(tickets),
  referrals: many(referrals),
  projectMessages: many(projectMessages),
  projectTimeline: many(projectTimeline),
  projectFiles: many(projectFiles),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  partner: one(partners, {
    fields: [referrals.partnerId],
    references: [partners.id],
  }),
  client: one(users, {
    fields: [referrals.clientId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [referrals.projectId],
    references: [projects.id],
  }),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  user: one(users, {
    fields: [tickets.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [tickets.projectId],
    references: [projects.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  project: one(projects, {
    fields: [payments.projectId],
    references: [projects.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const projectMessagesRelations = relations(projectMessages, ({ one }) => ({
  project: one(projects, {
    fields: [projectMessages.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectMessages.userId],
    references: [users.id],
  }),
}));

export const projectFilesRelations = relations(projectFiles, ({ one }) => ({
  project: one(projects, {
    fields: [projectFiles.projectId],
    references: [projects.id],
  }),
  uploadedBy: one(users, {
    fields: [projectFiles.uploadedBy],
    references: [users.id],
  }),
}));

export const projectTimelineRelations = relations(projectTimeline, ({ one }) => ({
  project: one(projects, {
    fields: [projectTimeline.projectId],
    references: [projects.id],
  }),
}));

export const ticketResponsesRelations = relations(ticketResponses, ({ one }) => ({
  ticket: one(tickets, {
    fields: [ticketResponses.ticketId],
    references: [tickets.id],
  }),
  user: one(users, {
    fields: [ticketResponses.userId],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectUserSchema = createSelectSchema(users);

export const insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
  createdAt: true,
});

export const selectPartnerSchema = createSelectSchema(partners);

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectProjectSchema = createSelectSchema(projects);

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectTicketSchema = createSelectSchema(tickets);

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const selectNotificationSchema = createSelectSchema(notifications);

export const insertProjectMessageSchema = createInsertSchema(projectMessages).omit({
  id: true,
  createdAt: true,
});

export const selectProjectMessageSchema = createSelectSchema(projectMessages);

export const insertProjectFileSchema = createInsertSchema(projectFiles).omit({
  id: true,
  uploadedAt: true,
});

export const selectProjectFileSchema = createSelectSchema(projectFiles);

export const insertProjectTimelineSchema = createInsertSchema(projectTimeline).omit({
  id: true,
  createdAt: true,
});

export const selectProjectTimelineSchema = createSelectSchema(projectTimeline);

export const insertTicketResponseSchema = createInsertSchema(ticketResponses).omit({
  id: true,
  createdAt: true,
});

export const selectTicketResponseSchema = createSelectSchema(ticketResponses);

// Types
export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;
export type Partner = InferSelectModel<typeof partners>;
export type InsertPartner = InferInsertModel<typeof partners>;
export type Project = InferSelectModel<typeof projects>;
export type InsertProject = InferInsertModel<typeof projects>;
export type Referral = InferSelectModel<typeof referrals>;
export type InsertReferral = InferInsertModel<typeof referrals>;
export type Ticket = InferSelectModel<typeof tickets>;
export type InsertTicket = InferInsertModel<typeof tickets>;
export type Payment = InferSelectModel<typeof payments>;
export type InsertPayment = InferInsertModel<typeof payments>;
export type Notification = InferSelectModel<typeof notifications>;
export type InsertNotification = InferInsertModel<typeof notifications>;

export type InsertPortfolio = InferInsertModel<typeof portfolio>;
export type Portfolio = InferSelectModel<typeof portfolio>;

export type ProjectMessage = InferSelectModel<typeof projectMessages>;
export type InsertProjectMessage = InferInsertModel<typeof projectMessages>;

export type ProjectFile = InferSelectModel<typeof projectFiles>;
export type InsertProjectFile = InferInsertModel<typeof projectFiles>;

export type ProjectTimeline = InferSelectModel<typeof projectTimeline>;
export type InsertProjectTimeline = InferInsertModel<typeof projectTimeline>;

export type TicketResponse = InferSelectModel<typeof ticketResponses>;
export type InsertTicketResponse = InferInsertModel<typeof ticketResponses>;

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  role: z.enum(["client", "partner"]),
});

export const contactSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  company: z.string().optional(),
  serviceType: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
  acceptTerms: z.boolean().refine(val => val === true, "Debes aceptar los términos"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ContactInput = z.infer<typeof contactSchema>;