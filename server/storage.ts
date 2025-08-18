import {
  type User,
  type InsertUser,
  type EarlyAccessApplication,
  type InsertEarlyAccessApplication,
  type HostApplication,
  type InsertHostApplication,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Early access application operations
  createEarlyAccessApplication(application: InsertEarlyAccessApplication): Promise<EarlyAccessApplication>;
  getAllEarlyAccessApplications(): Promise<EarlyAccessApplication[]>;
  getEarlyAccessApplicationById(id: string): Promise<EarlyAccessApplication | undefined>;
  updateEarlyAccessApplicationStatus(id: string, status: string): Promise<EarlyAccessApplication>;
  
  // Host application operations
  createHostApplication(application: InsertHostApplication): Promise<HostApplication>;
  getAllHostApplications(): Promise<HostApplication[]>;
  getHostApplicationById(id: string): Promise<HostApplication | undefined>;
  updateHostApplicationStatus(id: string, status: string): Promise<HostApplication>;
}

// IN-MEMORY STORAGE - Pure memory storage for development and forms
export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private earlyAccessApps: Map<string, EarlyAccessApplication> = new Map();
  private hostApps: Map<string, HostApplication> = new Map();

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      username: insertUser.username || `user_${Date.now()}`,
      password: insertUser.password || 'placeholder_password',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;
    
    this.users.set(user.id, user);
    return user;
  }

  // Early access application operations
  async createEarlyAccessApplication(application: InsertEarlyAccessApplication): Promise<EarlyAccessApplication> {
    const app: EarlyAccessApplication = {
      id: `ea_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      ...application,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as EarlyAccessApplication;
    
    this.earlyAccessApps.set(app.id, app);
    return app;
  }

  async getAllEarlyAccessApplications(): Promise<EarlyAccessApplication[]> {
    return Array.from(this.earlyAccessApps.values());
  }

  async getEarlyAccessApplicationById(id: string): Promise<EarlyAccessApplication | undefined> {
    return this.earlyAccessApps.get(id);
  }

  async updateEarlyAccessApplicationStatus(id: string, status: string): Promise<EarlyAccessApplication> {
    const app = this.earlyAccessApps.get(id);
    if (!app) {
      throw new Error(`Early access application ${id} not found`);
    }
    
    app.status = status;
    app.updatedAt = new Date();
    this.earlyAccessApps.set(id, app);
    return app;
  }

  // Host application operations
  async createHostApplication(application: InsertHostApplication): Promise<HostApplication> {
    const app: HostApplication = {
      id: `host_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      ...application,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as HostApplication;
    
    this.hostApps.set(app.id, app);
    return app;
  }

  async getAllHostApplications(): Promise<HostApplication[]> {
    return Array.from(this.hostApps.values());
  }

  async getHostApplicationById(id: string): Promise<HostApplication | undefined> {
    return this.hostApps.get(id);
  }

  async updateHostApplicationStatus(id: string, status: string): Promise<HostApplication> {
    const app = this.hostApps.get(id);
    if (!app) {
      throw new Error(`Host application ${id} not found`);
    }
    
    app.status = status;
    app.updatedAt = new Date();
    this.hostApps.set(id, app);
    return app;
  }
}

export const storage = new MemStorage();