import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { leaseAnalysisRequestSchema } from "@shared/schema";
import { vehicleApi } from "./vehicle-api";
import { calculateLeaseTax, getStateTaxInfo } from "@shared/state-tax-data";

export async function registerRoutes(app: Express): Promise<Server> {
  // Lease analysis endpoint
  app.post("/api/lease-analysis", async (req, res) => {
    try {
      const validationResult = leaseAnalysisRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid input data", 
          errors: validationResult.error.errors 
        });
      }

      const { carModel, state, upfrontPayment, monthlyPayment, leaseDuration, buyoutPrice } = validationResult.data;

      // Get vehicle market value from API
      const vehicleData = await vehicleApi.getVehicleMarketValue(carModel);
      let marketValue = 35000; // Default fallback value
      let vehicleYear = new Date().getFullYear();
      let vehicleMake = "";
      let vehicleModel = "";
      let vehicleSource = "Fallback Estimate";
      let vehicleMSRP = 0;

      if (vehicleData) {
        marketValue = vehicleData.marketValue;
        vehicleYear = vehicleData.year;
        vehicleMake = vehicleData.make;
        vehicleModel = vehicleData.model;
        vehicleSource = vehicleData.source;
        vehicleMSRP = vehicleData.msrp;
      } else {
        // Fall back to legacy car valuation data
        const carValuationData = await storage.getCarValuationData();
        if (carValuationData[carModel]) {
          const carData = carValuationData[carModel];
          const stateMultiplier = carData.stateMultiplier[state] || 1.0;
          marketValue = carData.baseValue * stateMultiplier;
          vehicleSource = "Legacy Market Data";
          vehicleMSRP = Math.round(marketValue * 1.15); // Estimate MSRP as 15% above market value
        }
      }

      // Calculate tax information
      const taxInfo = calculateLeaseTax(monthlyPayment, leaseDuration, state);
      
      // Calculate total cost including taxes
      const totalCost = upfrontPayment + (monthlyPayment * leaseDuration) + buyoutPrice + taxInfo.totalTaxAndFees;

      // Calculate savings and percentage
      const savings = marketValue - totalCost;
      const savingsPercentage = (savings / marketValue) * 100;

      // Determine deal quality and recommendation
      let dealQuality: string;
      let recommendation: string;
      
      if (savingsPercentage >= 15) {
        dealQuality = "Excellent";
        recommendation = "This is an excellent lease deal! You're getting significant value compared to the market price. Consider proceeding with this lease agreement.";
      } else if (savingsPercentage >= 5) {
        dealQuality = "Good";
        recommendation = "This is a good lease deal. You're saving money compared to market value, making it a reasonable choice.";
      } else if (savingsPercentage >= -5) {
        dealQuality = "Fair";
        recommendation = "This lease deal is roughly in line with market value. Consider if the convenience and terms meet your needs.";
      } else if (savingsPercentage >= -15) {
        dealQuality = "Poor";
        recommendation = "This lease deal is above market value. You might want to negotiate better terms or look for alternative offers.";
      } else {
        dealQuality = "Very Poor";
        recommendation = "This lease deal is significantly overpriced compared to market value. We recommend looking for better alternatives.";
      }

      // Create analysis record
      const analysisData = {
        dealQuality,
        calculationDate: new Date().toISOString(),
        marketDataSource: "internal_valuation_model"
      };

      const leaseAnalysis = await storage.createLeaseAnalysis({
        carModel,
        state,
        upfrontPayment: upfrontPayment.toString(),
        monthlyPayment: monthlyPayment.toString(),
        leaseDuration,
        buyoutPrice: buyoutPrice.toString(),
        totalCost: totalCost.toString(),
        marketValue: marketValue.toString(),
        savings: savings.toString(),
        savingsPercentage: savingsPercentage.toString(),
        recommendation,
        analysisData,
        monthlyTax: taxInfo.monthlyTax.toString(),
        totalTax: taxInfo.totalTax.toString(),
        stateFees: taxInfo.additionalFees.toString(),
        vehicleYear,
        vehicleMake,
        vehicleModel,
        vehicleSource
      });

      // Return analysis results
      res.json({
        id: leaseAnalysis.id,
        carModel,
        state,
        upfrontPayment,
        monthlyPayment: monthlyPayment * leaseDuration,
        leaseDuration,
        buyoutPrice,
        totalCost,
        marketValue,
        savings,
        savingsPercentage: Math.round(savingsPercentage * 10) / 10,
        dealQuality,
        recommendation,
        isGoodDeal: savings > 0,
        taxInfo: {
          monthlyTax: taxInfo.monthlyTax,
          totalTax: taxInfo.totalTax,
          stateFees: taxInfo.additionalFees,
          taxRate: getStateTaxInfo(state)?.leaseTaxRate || 0,
          stateName: getStateTaxInfo(state)?.name || state
        },
        vehicleInfo: {
          year: vehicleYear,
          make: vehicleMake,
          model: vehicleModel,
          source: vehicleSource,
          msrp: vehicleMSRP
        }
      });

    } catch (error) {
      console.error("Lease analysis error:", error);
      res.status(500).json({ message: "Internal server error during lease analysis" });
    }
  });

  // Get available car models
  app.get("/api/car-models", async (req, res) => {
    try {
      const carValuationData = await storage.getCarValuationData();
      const carModels = Object.keys(carValuationData);
      res.json({ carModels });
    } catch (error) {
      console.error("Error fetching car models:", error);
      res.status(500).json({ message: "Error fetching car models" });
    }
  });

  // Get state tax information
  app.get("/api/state-tax/:stateCode", async (req, res) => {
    try {
      const { stateCode } = req.params;
      const taxInfo = getStateTaxInfo(stateCode);
      
      if (!taxInfo) {
        return res.status(404).json({ message: "State tax information not found" });
      }
      
      res.json(taxInfo);
    } catch (error) {
      console.error("Error fetching state tax info:", error);
      res.status(500).json({ message: "Error fetching state tax information" });
    }
  });

  // Get vehicle market value
  app.get("/api/vehicle-value/:vehicleModel", async (req, res) => {
    try {
      const { vehicleModel } = req.params;
      const vehicleData = await vehicleApi.getVehicleMarketValue(vehicleModel);
      
      if (!vehicleData) {
        return res.status(404).json({ message: "Vehicle market value not found" });
      }
      
      res.json(vehicleData);
    } catch (error) {
      console.error("Error fetching vehicle value:", error);
      res.status(500).json({ message: "Error fetching vehicle market value" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
