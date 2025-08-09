import { z } from 'zod';

// Vehicle API response schemas
const VehicleApiResponseSchema = z.object({
  make: z.string(),
  model: z.string(),
  year: z.number(),
  trim: z.string().optional(),
  marketValue: z.number(),
  msrp: z.number(),
  source: z.string(),
  lastUpdated: z.string()
});

export type VehicleApiResponse = z.infer<typeof VehicleApiResponseSchema>;

// CarAPI.app response schemas
interface CarApiVehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  trim?: string;
  body?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  fuel_type?: string;
  highway_mpg?: number;
  city_mpg?: number;
  msrp?: number;
}

// Vehicle Databases API response
interface VehicleDatabasesResponse {
  make: string;
  model: string;
  year: number;
  trim: string;
  msrp: number;
  invoice_price: number;
  market_value: {
    excellent: number;
    good: number;
    fair: number;
    average: number;
  };
}

// Vehicle lookup service
export class VehicleApiService {
  private readonly CAR_API_BASE_URL = 'https://carapi.app/api';
  private readonly VEHICLE_DB_BASE_URL = 'https://api.vehicledatabases.com';
  
  // Parse vehicle string into components
  private parseVehicleString(vehicleString: string): {
    make: string;
    model: string;
    year?: number;
    trim?: string;
  } {
    const parts = vehicleString.trim().split(/\s+/);
    
    // Try to find year (4-digit number)
    const yearMatch = vehicleString.match(/\b(19|20)\d{2}\b/);
    const year = yearMatch ? parseInt(yearMatch[0]) : undefined;
    
    // Clean up make and model
    let make = '';
    let model = '';
    let trim = '';
    
    if (year) {
      // Remove year from string and parse remaining parts
      const withoutYear = vehicleString.replace(/\b(19|20)\d{2}\b/, '').trim();
      const remainingParts = withoutYear.split(/\s+/);
      
      if (remainingParts.length >= 2) {
        make = remainingParts[0];
        model = remainingParts.slice(1).join(' ');
      }
    } else {
      // No year found, assume first part is make
      if (parts.length >= 2) {
        make = parts[0];
        model = parts.slice(1).join(' ');
      }
    }
    
    return {
      make: make.charAt(0).toUpperCase() + make.slice(1).toLowerCase(),
      model: model.charAt(0).toUpperCase() + model.slice(1).toLowerCase(),
      year: year || new Date().getFullYear(),
      trim: trim || undefined
    };
  }

  // Get vehicle data from CarAPI.app
  private async getVehicleFromCarAPI(make: string, model: string, year: number): Promise<CarApiVehicle | null> {
    try {
      // First, search for the vehicle by make, model, and year
      const searchUrl = `${this.CAR_API_BASE_URL}/vehicles?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&year=${year}&limit=10`;
      
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        console.warn(`CarAPI error: ${response.status} ${response.statusText}`);
        return null;
      }
      
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        // Find the best match - prefer exact matches
        const exactMatch = data.data.find((vehicle: CarApiVehicle) => 
          vehicle.make.toLowerCase() === make.toLowerCase() && 
          vehicle.model.toLowerCase() === model.toLowerCase() &&
          vehicle.year === year
        );
        
        if (exactMatch) {
          return exactMatch;
        }
        
        // Return first result if no exact match
        return data.data[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching from CarAPI:', error);
      return null;
    }
  }

  // Get vehicle data from Vehicle Databases API (backup with MSRP)
  private async getVehicleFromVehicleDB(make: string, model: string, year: number): Promise<VehicleDatabasesResponse | null> {
    try {
      // Note: This would require an API key in production
      // For demo purposes, we'll simulate the API structure
      console.log(`VehicleDB API call would be made for: ${year} ${make} ${model}`);
      return null;
    } catch (error) {
      console.error('Error fetching from Vehicle Databases API:', error);
      return null;
    }
  }

  // Estimate MSRP based on make, model, year (improved algorithm)
  private estimateMSRP(make: string, model: string, year: number = new Date().getFullYear()): number {
    const currentYear = new Date().getFullYear();
    
    // Brand-based MSRP estimates (2024/2025 baseline)
    const brandMSRP: Record<string, number> = {
      // Luxury brands
      'BMW': 55000, 'Mercedes': 58000, 'Audi': 52000, 'Lexus': 48000, 
      'Acura': 42000, 'Infiniti': 45000, 'Cadillac': 50000, 'Lincoln': 46000,
      'Jaguar': 65000, 'Porsche': 85000, 'Maserati': 120000, 'Bentley': 250000,
      
      // Electric/Premium brands  
      'Tesla': 50000, 'Volvo': 45000, 'Genesis': 48000, 'Alfa Romeo': 52000,
      'Rivian': 75000, 'Lucid': 95000, 'Polestar': 55000,
      
      // Mainstream brands
      'Toyota': 32000, 'Honda': 30000, 'Nissan': 28000, 'Hyundai': 27000,
      'Kia': 26000, 'Mazda': 29000, 'Subaru': 31000, 'Mitsubishi': 25000,
      
      // American brands
      'Ford': 33000, 'Chevrolet': 31000, 'Dodge': 35000, 'Chrysler': 34000,
      'Jeep': 36000, 'RAM': 42000, 'Buick': 35000, 'GMC': 38000,
      
      // Specialty brands
      'Mini': 35000, 'Fiat': 22000, 'Volkswagen': 32000, 'Saab': 30000,
    };
    
    // Get base MSRP for brand
    const baseMSRP = brandMSRP[make] || 30000;
    
    // Model type adjustments
    const modelLower = model.toLowerCase();
    let multiplier = 1.0;
    
    // Vehicle type multipliers
    if (modelLower.includes('suv') || modelLower.includes('crossover') || 
        modelLower.includes('cx') || modelLower.includes('rx') || modelLower.includes('x')) {
      multiplier = 1.25; // SUVs cost more
    } else if (modelLower.includes('truck') || modelLower.includes('f-150') || 
               modelLower.includes('silverado') || modelLower.includes('ram') || 
               modelLower.includes('tundra') || modelLower.includes('titan')) {
      multiplier = 1.4; // Trucks are expensive
    } else if (modelLower.includes('coupe') || modelLower.includes('convertible') || 
               modelLower.includes('roadster') || modelLower.includes('gt')) {
      multiplier = 1.3; // Sports cars premium
    } else if (modelLower.includes('sedan') || modelLower.includes('class') || 
               modelLower.includes('series') || modelLower.includes('accord') || 
               modelLower.includes('camry') || modelLower.includes('altima')) {
      multiplier = 1.0; // Sedans baseline
    } else if (modelLower.includes('hatchback') || modelLower.includes('compact') || 
               modelLower.includes('civic') || modelLower.includes('corolla') || 
               modelLower.includes('forte') || modelLower.includes('elantra')) {
      multiplier = 0.8; // Compact cars less expensive
    } else if (modelLower.includes('wagon') || modelLower.includes('van') || 
               modelLower.includes('minivan') || modelLower.includes('carnival') || 
               modelLower.includes('odyssey') || modelLower.includes('sienna')) {
      multiplier = 1.15; // Wagons/vans moderate premium
    }
    
    // Year adjustments (newer models cost more)
    const yearDifference = year - currentYear;
    let yearMultiplier = 1.0;
    
    if (yearDifference > 0) {
      // Future model year (2025, 2026, etc.)
      yearMultiplier = 1.0 + (yearDifference * 0.03); // 3% increase per future year
    } else if (yearDifference < 0) {
      // Past model year
      yearMultiplier = 1.0 + (yearDifference * 0.05); // 5% decrease per past year
    }
    
    // Calculate final MSRP
    const estimatedMSRP = Math.round(baseMSRP * multiplier * yearMultiplier);
    
    // Ensure reasonable bounds
    return Math.max(Math.min(estimatedMSRP, 300000), 15000);
  }

  // Calculate market value from MSRP (accounting for depreciation)
  private calculateMarketValue(msrp: number, year: number): number {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    
    if (age <= 0) {
      // New or future model - market value close to MSRP
      return Math.round(msrp * 0.95); // 5% discount from MSRP
    }
    
    // Depreciation schedule (more accurate)
    let depreciationRate = 0;
    if (age === 1) depreciationRate = 0.20; // 20% first year
    else if (age === 2) depreciationRate = 0.35; // 35% second year
    else if (age === 3) depreciationRate = 0.45; // 45% third year
    else if (age <= 5) depreciationRate = 0.55; // 55% 4-5 years
    else depreciationRate = Math.min(0.7, 0.55 + (age - 5) * 0.05); // Cap at 70%
    
    return Math.round(msrp * (1 - depreciationRate));
  }

  // Main method to get vehicle market value and MSRP
  async getVehicleMarketValue(vehicleString: string): Promise<VehicleApiResponse | null> {
    try {
      const parsed = this.parseVehicleString(vehicleString);
      
      if (!parsed.make || !parsed.model) {
        console.warn('Unable to parse vehicle string:', vehicleString);
        return null;
      }
      
      const make = parsed.make;
      const model = parsed.model;
      const year = parsed.year || new Date().getFullYear();
      
      // Try to get real data from CarAPI.app first
      let carApiData: CarApiVehicle | null = null;
      try {
        carApiData = await this.getVehicleFromCarAPI(make, model, year);
      } catch (error) {
        console.warn('CarAPI.app not available, using estimation');
      }
      
      // Get MSRP and market value
      let msrp: number;
      let marketValue: number;
      let source: string;
      
      if (carApiData && carApiData.msrp) {
        // Use real MSRP from CarAPI
        msrp = carApiData.msrp;
        marketValue = this.calculateMarketValue(msrp, year);
        source = 'CarAPI.app (Real MSRP)';
      } else {
        // Use our improved estimation
        msrp = this.estimateMSRP(make, model, year);
        marketValue = this.calculateMarketValue(msrp, year);
        source = 'Enhanced MSRP Estimation';
      }
      
      return {
        make,
        model,
        year,
        trim: carApiData?.trim || parsed.trim,
        marketValue,
        msrp,
        source,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting vehicle market value:', error);
      return null;
    }
  }

  // Batch lookup for multiple vehicles
  async getMultipleVehicleValues(vehicleStrings: string[]): Promise<Record<string, VehicleApiResponse | null>> {
    const results: Record<string, VehicleApiResponse | null> = {};
    
    // Process in parallel but limit concurrency
    const chunks = [];
    for (let i = 0; i < vehicleStrings.length; i += 3) {
      chunks.push(vehicleStrings.slice(i, i + 3));
    }
    
    for (const chunk of chunks) {
      const promises = chunk.map(async (vehicle) => {
        const result = await this.getVehicleMarketValue(vehicle);
        return [vehicle, result] as const;
      });
      
      const chunkResults = await Promise.all(promises);
      for (const [vehicle, result] of chunkResults) {
        results[vehicle] = result;
      }
    }
    
    return results;
  }
}

// Export singleton instance
export const vehicleApi = new VehicleApiService();

// Utility function to format vehicle for display
export function formatVehicleDisplay(vehicle: VehicleApiResponse): string {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`;
}