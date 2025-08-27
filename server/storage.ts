import {
  users,
  partners,
  projects,
  tickets,
  notifications,
  referrals,
  payments,
  portfolio,
  projectMessages,
  projectFiles,
  projectTimeline,
  ticketResponses, // Import ticketResponses
  type User,
  type InsertUser,
  type Partner,
  type InsertPartner,
  type Project,
  type InsertProject,
  type Ticket,
  type InsertTicket,
  type Notification,
  type InsertNotification,
  type Referral,
  type InsertReferral,
  type Payment,
  type InsertPayment,
  type Portfolio,
  type InsertPortfolio,
  type ProjectMessage,
  type InsertProjectMessage,
  type ProjectFile,
  type InsertProjectFile,
  type ProjectTimeline,
  type InsertProjectTimeline,
  type TicketResponse, // Import TicketResponse type
  type InsertTicketResponse, // Import InsertTicketResponse type
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;

  // Partner operations
  getPartner(userId: number): Promise<Partner | undefined>;
  getPartnerByReferralCode(code: string): Promise<Partner | undefined>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  updatePartner(id: number, updates: Partial<Partner>): Promise<Partner>;
  getPartnerStats(partnerId: number): Promise<any>;

  // Project operations
  getProjects(userId: number, role: string): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project>;

  // Referral operations
  getReferrals(partnerId: number): Promise<any[]>;
  createReferral(referral: InsertReferral): Promise<Referral>;

  // Ticket operations
  getTickets(userId: number): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: number, updates: Partial<Ticket>): Promise<Ticket>;
  // Ticket response operations
  createTicketResponse(responseData: InsertTicketResponse): Promise<TicketResponse>;
  getTicketResponses(ticketId: number): Promise<(TicketResponse & { author: string; role: string })[]>;


  // Notification operations
  getNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<void>;

  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, updates: Partial<Payment>): Promise<Payment>;

  // Admin operations
  getAllUsers(): Promise<User[]>;
  getAdminStats(): Promise<any>;

  // Portfolio operations
  getPortfolio(): Promise<Portfolio[]>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: number, updates: Partial<Portfolio>): Promise<Portfolio>;
  deletePortfolio(id: number): Promise<void>;

  // Project management operations
  getProjectMessages(projectId: number): Promise<ProjectMessage[]>;
  createProjectMessage(message: InsertProjectMessage): Promise<ProjectMessage>;
  getProjectFiles(projectId: number): Promise<ProjectFile[]>;
  createProjectFile(file: InsertProjectFile): Promise<ProjectFile>;
  deleteProjectFile(id: number): Promise<void>;
  getProjectTimeline(projectId: number): Promise<ProjectTimeline[]>;
  createProjectTimeline(timeline: InsertProjectTimeline): Promise<ProjectTimeline>;
  updateProjectTimeline(id: number, updates: Partial<ProjectTimeline>): Promise<ProjectTimeline>;

  // Seed data
  seedUsers(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Removed db instance from here as it's already imported at the top level.

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getPartner(userId: number): Promise<Partner | undefined> {
    const [partner] = await db
      .select()
      .from(partners)
      .where(eq(partners.userId, userId));
    return partner;
  }

  async getPartnerByReferralCode(code: string): Promise<Partner | undefined> {
    const [partner] = await db
      .select()
      .from(partners)
      .where(eq(partners.referralCode, code));
    return partner;
  }

  async createPartner(insertPartner: InsertPartner): Promise<Partner> {
    const [partner] = await db
      .insert(partners)
      .values(insertPartner)
      .returning();
    return partner;
  }

  async updatePartner(id: number, updates: Partial<Partner>): Promise<Partner> {
    const [partner] = await db
      .update(partners)
      .set(updates)
      .where(eq(partners.id, id))
      .returning();
    return partner;
  }

  async getPartnerStats(partnerId: number): Promise<any> {
    const [stats] = await db
      .select({
        totalEarnings: partners.totalEarnings,
        activeReferrals: sql<number>`COUNT(DISTINCT ${referrals.id})`,
        closedSales: sql<number>`COUNT(DISTINCT CASE WHEN ${referrals.status} = 'paid' THEN ${referrals.id} END)`,
      })
      .from(partners)
      .leftJoin(referrals, eq(partners.id, referrals.partnerId))
      .where(eq(partners.id, partnerId))
      .groupBy(partners.id);

    return {
      totalEarnings: stats?.totalEarnings || "0.00",
      activeReferrals: stats?.activeReferrals || 0,
      closedSales: stats?.closedSales || 0,
      conversionRate: stats?.activeReferrals > 0 
        ? Math.round((stats.closedSales / stats.activeReferrals) * 100) 
        : 0,
    };
  }

  async getProjects(userId: number, role: string): Promise<Project[]> {
    const query = db.select().from(projects);

    if (role === "client") {
      return await query.where(eq(projects.clientId, userId)).orderBy(desc(projects.createdAt));
    } else if (role === "partner") {
      const partner = await this.getPartner(userId);
      if (!partner) return [];
      return await query.where(eq(projects.partnerId, partner.id)).orderBy(desc(projects.createdAt));
    } else if (role === "admin") {
      return await query.orderBy(desc(projects.createdAt));
    }

    return [];
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db
      .insert(projects)
      .values(insertProject)
      .returning();
    return project;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project> {
    const [project] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async getReferrals(partnerId: number): Promise<any[]> {
    return await db
      .select({
        id: referrals.id,
        status: referrals.status,
        commissionAmount: referrals.commissionAmount,
        createdAt: referrals.createdAt,
        clientName: users.fullName,
        clientEmail: users.email,
        projectName: projects.name,
        projectPrice: projects.price,
      })
      .from(referrals)
      .leftJoin(users, eq(referrals.clientId, users.id))
      .leftJoin(projects, eq(referrals.projectId, projects.id))
      .where(eq(referrals.partnerId, partnerId))
      .orderBy(desc(referrals.createdAt));
  }

  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const [referral] = await db
      .insert(referrals)
      .values(insertReferral)
      .returning();
    return referral;
  }

  async getTickets(userId: number): Promise<(Ticket & { responses?: (TicketResponse & { author: string; role: string })[]; })[]> {
    const ticketList = await db
      .select({
        id: tickets.id,
        title: tickets.title,
        description: tickets.description,
        status: tickets.status,
        priority: tickets.priority,
        createdAt: tickets.createdAt,
        updatedAt: tickets.updatedAt,
        projectName: projects.name,
        projectId: tickets.projectId,
      })
      .from(tickets)
      .leftJoin(projects, eq(tickets.projectId, projects.id))
      .where(eq(tickets.userId, userId))
      .orderBy(desc(tickets.createdAt));

    // Get responses for each ticket
    const ticketsWithResponses = await Promise.all(
      ticketList.map(async (ticket) => {
        const responses = await this.getTicketResponses(ticket.id);
        return {
          ...ticket,
          responses,
        };
      })
    );

    return ticketsWithResponses;
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const [ticket] = await db
      .insert(tickets)
      .values(insertTicket)
      .returning();
    return ticket;
  }

  async updateTicket(id: number, updates: Partial<Ticket>): Promise<Ticket> {
    const [ticket] = await db
      .update(tickets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tickets.id, id))
      .returning();
    return ticket;
  }

  async createTicketResponse(responseData: InsertTicketResponse): Promise<TicketResponse> {
    const [response] = await db
      .insert(ticketResponses)
      .values({
        ...responseData,
        createdAt: new Date(), // Store as Date object
      })
      .returning();
    return response;
  }

  async getTicketResponses(ticketId: number): Promise<(TicketResponse & { author: string; role: string })[]> {
    return await db
      .select({
        id: ticketResponses.id,
        message: ticketResponses.message,
        author: users.fullName,
        role: users.role,
        createdAt: ticketResponses.createdAt,
        isFromSupport: ticketResponses.isFromSupport,
      })
      .from(ticketResponses)
      .leftJoin(users, eq(ticketResponses.userId, users.id))
      .where(eq(ticketResponses.ticketId, ticketId))
      .orderBy(ticketResponses.createdAt);
  }


  async getNotifications(userId: number): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(20);
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(insertNotification)
      .returning();
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db
      .insert(payments)
      .values(insertPayment)
      .returning();
    return payment;
  }

  async updatePayment(id: number, updates: Partial<Payment>): Promise<Payment> {
    const [payment] = await db
      .update(payments)
      .set(updates)
      .where(eq(payments.id, id))
      .returning();
    return payment;
  }

  async getAllUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));
  }

  // Portfolio operations (Implemented)
  async getPortfolio(): Promise<Portfolio[]> {
    try {
      const result = await db.select().from(portfolio).where(eq(portfolio.isActive, true)).orderBy(desc(portfolio.createdAt));
      return result;
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      // Return empty array instead of throwing to prevent 500 errors
      return [];
    }
  }

  async createPortfolio(data: InsertPortfolio): Promise<Portfolio> {
    try {
      // Convert string date to Date object if needed
      const portfolioData = {
        ...data,
        completedAt: typeof data.completedAt === 'string' ? new Date(data.completedAt) : data.completedAt
      };

      const [newPortfolio] = await db.insert(portfolio).values(portfolioData).returning();
      return newPortfolio;
    } catch (error) {
      console.error("Error creating portfolio:", error);
      throw error;
    }
  }

  async updatePortfolio(id: number, updates: Partial<Portfolio>): Promise<Portfolio> {
    try {
      // Convert string date to Date object if needed
      const portfolioUpdates = {
        ...updates,
        completedAt: updates.completedAt && typeof updates.completedAt === 'string' 
          ? new Date(updates.completedAt) 
          : updates.completedAt,
        updatedAt: new Date()
      };

      const [updatedPortfolio] = await db
        .update(portfolio)
        .set(portfolioUpdates)
        .where(eq(portfolio.id, id))
        .returning();
      return updatedPortfolio;
    } catch (error) {
      console.error("Error updating portfolio:", error);
      throw error;
    }
  }

  async deletePortfolio(id: number): Promise<void> {
    try {
      await db.delete(portfolio).where(eq(portfolio.id, id));
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      throw error;
    }
  }

  async getAdminStats(): Promise<any> {
    const [users, projects, partners] = await Promise.all([
      db.select().from(users),
      db.select().from(projects),
      db.select().from(partners),
    ]);

    const totalUsers = users.length;
    const activePartners = partners.length;
    const activeProjects = projects.filter(p => p.status === 'in_progress').length;
    const monthlyRevenue = projects
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + parseFloat(p.price), 0);

    return {
      totalUsers,
      activePartners,
      activeProjects,
      monthlyRevenue: `$${monthlyRevenue.toLocaleString()}`,
    };
  }

  // Project management operations
  async getProjectMessages(projectId: number): Promise<ProjectMessage[]> {
    return await db
      .select({
        id: projectMessages.id,
        projectId: projectMessages.projectId,
        userId: projectMessages.userId,
        message: projectMessages.message,
        createdAt: projectMessages.createdAt,
        author: users.fullName,
        role: users.role,
      })
      .from(projectMessages)
      .leftJoin(users, eq(projectMessages.userId, users.id))
      .where(eq(projectMessages.projectId, projectId))
      .orderBy(desc(projectMessages.createdAt));
  }

  async createProjectMessage(message: InsertProjectMessage): Promise<ProjectMessage> {
    const [newMessage] = await db
      .insert(projectMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getProjectFiles(projectId: number): Promise<ProjectFile[]> {
    return await db
      .select({
        id: projectFiles.id,
        projectId: projectFiles.projectId,
        fileName: projectFiles.fileName,
        fileUrl: projectFiles.fileUrl,
        fileType: projectFiles.fileType,
        uploadedBy: projectFiles.uploadedBy,
        uploadedAt: projectFiles.uploadedAt,
        uploaderName: users.fullName,
      })
      .from(projectFiles)
      .leftJoin(users, eq(projectFiles.uploadedBy, users.id))
      .where(eq(projectFiles.projectId, projectId))
      .orderBy(desc(projectFiles.uploadedAt));
  }

  async createProjectFile(file: InsertProjectFile): Promise<ProjectFile> {
    const [newFile] = await db
      .insert(projectFiles)
      .values(file)
      .returning();
    return newFile;
  }

  async deleteProjectFile(id: number): Promise<void> {
    await db.delete(projectFiles).where(eq(projectFiles.id, id));
  }

  async getProjectTimeline(projectId: number): Promise<ProjectTimeline[]> {
    return await db
      .select()
      .from(projectTimeline)
      .where(eq(projectTimeline.projectId, projectId))
      .orderBy(projectTimeline.createdAt);
  }

  async createProjectTimeline(timeline: InsertProjectTimeline): Promise<ProjectTimeline> {
    const [newTimeline] = await db
      .insert(projectTimeline)
      .values(timeline)
      .returning();
    return newTimeline;
  }

  async updateProjectTimeline(id: number, updates: Partial<ProjectTimeline>): Promise<ProjectTimeline> {
    const [updated] = await db
      .update(projectTimeline)
      .set(updates)
      .where(eq(projectTimeline.id, id))
      .returning();
    return updated;
  }

  async seedUsers(): Promise<void> {
    const bcrypt = await import("bcryptjs");

    const seedUsers = [
      {
        email: "admin@softwarepar.lat",
        password: await bcrypt.hash("admin123", 10),
        fullName: "Administrador SoftwarePar",
        role: "admin" as const,
      },
      {
        email: "cliente@test.com",
        password: await bcrypt.hash("cliente123", 10),
        fullName: "Cliente Test",
        role: "client" as const,
      },
      {
        email: "partner@test.com",
        password: await bcrypt.hash("partner123", 10),
        fullName: "Partner Test",
        role: "partner" as const,
      },
    ];

    for (const userData of seedUsers) {
      const existingUser = await this.getUserByEmail(userData.email);
      if (!existingUser) {
        const user = await this.createUser(userData);

        // Create partner for partner user
        if (userData.role === "partner") {
          await this.createPartner({
            userId: user.id,
            referralCode: "ABC123",
            commissionRate: "25.00",
            totalEarnings: "0.00",
          });
        }
      }
    }
  }
}

export const storage = new DatabaseStorage();