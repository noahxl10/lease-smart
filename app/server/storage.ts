import { users, leaseAnalyses, type User, type InsertUser, type LeaseAnalysis, type CarValuationData } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createLeaseAnalysis(analysis: Omit<LeaseAnalysis, 'id'>): Promise<LeaseAnalysis>;
  getCarValuationData(): Promise<CarValuationData>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leaseAnalyses: Map<number, LeaseAnalysis>;
  private carValuationData: CarValuationData;
  currentUserId: number;
  currentAnalysisId: number;

  constructor() {
    this.users = new Map();
    this.leaseAnalyses = new Map();
    this.currentUserId = 1;
    this.currentAnalysisId = 1;
    
    // Initialize mock car valuation data
    this.carValuationData = {
      'BMW X5': { 
        baseValue: 65000, 
        stateMultiplier: { 
          'CA': 1.1, 'NY': 1.05, 'TX': 0.95, 'FL': 1.0, 'IL': 1.02, 
          'PA': 0.98, 'OH': 0.96, 'GA': 0.97, 'NC': 0.95, 'MI': 0.94 
        }
      },
      'Tesla Model 3': { 
        baseValue: 45000, 
        stateMultiplier: { 
          'CA': 1.15, 'NY': 1.1, 'TX': 0.9, 'FL': 1.0, 'IL': 1.05, 
          'PA': 1.0, 'OH': 0.95, 'GA': 0.98, 'NC': 0.96, 'MI': 0.93 
        }
      },
      'Honda Civic': { 
        baseValue: 25000, 
        stateMultiplier: { 
          'CA': 1.05, 'NY': 1.0, 'TX': 0.95, 'FL': 0.98, 'IL': 1.0, 
          'PA': 0.97, 'OH': 0.94, 'GA': 0.96, 'NC': 0.94, 'MI': 0.92 
        }
      },
      'Mercedes C-Class': { 
        baseValue: 50000, 
        stateMultiplier: { 
          'CA': 1.12, 'NY': 1.08, 'TX': 0.92, 'FL': 1.0, 'IL': 1.03, 
          'PA': 0.99, 'OH': 0.95, 'GA': 0.97, 'NC': 0.94, 'MI': 0.93 
        }
      },
      'Toyota Camry': { 
        baseValue: 30000, 
        stateMultiplier: { 
          'CA': 1.03, 'NY': 1.0, 'TX': 0.97, 'FL': 0.99, 'IL': 1.01, 
          'PA': 0.98, 'OH': 0.95, 'GA': 0.97, 'NC': 0.95, 'MI': 0.93 
        }
      },
      'Audi A4': { 
        baseValue: 48000, 
        stateMultiplier: { 
          'CA': 1.08, 'NY': 1.06, 'TX': 0.94, 'FL': 1.0, 'IL': 1.02, 
          'PA': 0.98, 'OH': 0.96, 'GA': 0.97, 'NC': 0.95, 'MI': 0.94 
        }
      },
      'Lexus RX': { 
        baseValue: 55000, 
        stateMultiplier: { 
          'CA': 1.09, 'NY': 1.04, 'TX': 0.96, 'FL': 1.01, 'IL': 1.01, 
          'PA': 0.99, 'OH': 0.97, 'GA': 0.98, 'NC': 0.96, 'MI': 0.95 
        }
      }
    };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createLeaseAnalysis(analysis: Omit<LeaseAnalysis, 'id'>): Promise<LeaseAnalysis> {
    const id = this.currentAnalysisId++;
    const leaseAnalysis: LeaseAnalysis = { ...analysis, id };
    this.leaseAnalyses.set(id, leaseAnalysis);
    return leaseAnalysis;
  }

  async getCarValuationData(): Promise<CarValuationData> {
    return this.carValuationData;
  }
}

export const storage = new MemStorage();
