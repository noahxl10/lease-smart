import { pgTable, text, serial, integer, boolean, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const leaseAnalyses = pgTable("lease_analyses", {
  id: serial("id").primaryKey(),
  carModel: text("car_model").notNull(),
  state: text("state").notNull(),
  upfrontPayment: numeric("upfront_payment").notNull(),
  monthlyPayment: numeric("monthly_payment").notNull(),
  leaseDuration: integer("lease_duration").notNull(),
  buyoutPrice: numeric("buyout_price").notNull(),
  totalCost: numeric("total_cost").notNull(),
  marketValue: numeric("market_value").notNull(),
  savings: numeric("savings").notNull(),
  savingsPercentage: numeric("savings_percentage").notNull(),
  recommendation: text("recommendation").notNull(),
  analysisData: jsonb("analysis_data"),
  // New tax-related fields
  monthlyTax: numeric("monthly_tax").notNull(),
  totalTax: numeric("total_tax").notNull(),
  stateFees: numeric("state_fees").notNull(),
  // Vehicle API fields
  vehicleYear: integer("vehicle_year"),
  vehicleMake: text("vehicle_make"),
  vehicleModel: text("vehicle_model"),
  vehicleSource: text("vehicle_source"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLeaseAnalysisSchema = createInsertSchema(leaseAnalyses).omit({
  id: true,
  totalCost: true,
  marketValue: true,
  savings: true,
  savingsPercentage: true,
  recommendation: true,
  analysisData: true,
  monthlyTax: true,
  totalTax: true,
  stateFees: true,
  vehicleYear: true,
  vehicleMake: true,
  vehicleModel: true,
  vehicleSource: true,
});

export const leaseAnalysisRequestSchema = z.object({
  carModel: z.string().min(1, "Car model is required"),
  state: z.string().min(2, "State is required"),
  upfrontPayment: z.number().min(0, "Upfront payment must be positive"),
  monthlyPayment: z.number().min(0, "Monthly payment must be positive"),
  leaseDuration: z.number().min(12).max(60, "Lease duration must be between 12-60 months"),
  buyoutPrice: z.number().min(0, "Buyout price must be positive"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LeaseAnalysis = typeof leaseAnalyses.$inferSelect;
export type LeaseAnalysisRequest = z.infer<typeof leaseAnalysisRequestSchema>;

// Car valuation data interface
export interface CarValuationData {
  [carModel: string]: {
    baseValue: number;
    stateMultiplier: {
      [state: string]: number;
    };
  };
}
