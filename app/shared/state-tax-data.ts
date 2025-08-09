// State tax information for lease payments
export interface StateTaxInfo {
  code: string;
  name: string;
  salesTaxRate: number; // Base sales tax rate
  leaseTaxRate: number; // Tax rate specifically for lease payments
  leaseTaxType: 'monthly' | 'upfront' | 'total'; // How lease tax is calculated
  additionalFees: number; // Additional state fees for leases
  description: string;
}

export const STATE_TAX_DATA: Record<string, StateTaxInfo> = {
  'AL': {
    code: 'AL',
    name: 'Alabama',
    salesTaxRate: 0.04,
    leaseTaxRate: 0.04,
    leaseTaxType: 'monthly',
    additionalFees: 75,
    description: 'Tax applied to monthly lease payments'
  },
  'AK': {
    code: 'AK',
    name: 'Alaska',
    salesTaxRate: 0.00,
    leaseTaxRate: 0.00,
    leaseTaxType: 'monthly',
    additionalFees: 0,
    description: 'No state sales tax'
  },
  'AZ': {
    code: 'AZ',
    name: 'Arizona',
    salesTaxRate: 0.056,
    leaseTaxRate: 0.056,
    leaseTaxType: 'monthly',
    additionalFees: 85,
    description: 'Tax applied to monthly lease payments'
  },
  'AR': {
    code: 'AR',
    name: 'Arkansas',
    salesTaxRate: 0.065,
    leaseTaxRate: 0.065,
    leaseTaxType: 'monthly',
    additionalFees: 60,
    description: 'Tax applied to monthly lease payments'
  },
  'CA': {
    code: 'CA',
    name: 'California',
    salesTaxRate: 0.0725,
    leaseTaxRate: 0.0725,
    leaseTaxType: 'monthly',
    additionalFees: 125,
    description: 'Tax applied to monthly lease payments'
  },
  'CO': {
    code: 'CO',
    name: 'Colorado',
    salesTaxRate: 0.029,
    leaseTaxRate: 0.029,
    leaseTaxType: 'monthly',
    additionalFees: 90,
    description: 'Tax applied to monthly lease payments'
  },
  'CT': {
    code: 'CT',
    name: 'Connecticut',
    salesTaxRate: 0.0635,
    leaseTaxRate: 0.0635,
    leaseTaxType: 'monthly',
    additionalFees: 100,
    description: 'Tax applied to monthly lease payments'
  },
  'DE': {
    code: 'DE',
    name: 'Delaware',
    salesTaxRate: 0.00,
    leaseTaxRate: 0.00,
    leaseTaxType: 'monthly',
    additionalFees: 40,
    description: 'No state sales tax'
  },
  'FL': {
    code: 'FL',
    name: 'Florida',
    salesTaxRate: 0.06,
    leaseTaxRate: 0.06,
    leaseTaxType: 'monthly',
    additionalFees: 95,
    description: 'Tax applied to monthly lease payments'
  },
  'GA': {
    code: 'GA',
    name: 'Georgia',
    salesTaxRate: 0.04,
    leaseTaxRate: 0.04,
    leaseTaxType: 'monthly',
    additionalFees: 70,
    description: 'Tax applied to monthly lease payments'
  },
  'HI': {
    code: 'HI',
    name: 'Hawaii',
    salesTaxRate: 0.04,
    leaseTaxRate: 0.04,
    leaseTaxType: 'monthly',
    additionalFees: 80,
    description: 'Tax applied to monthly lease payments'
  },
  'ID': {
    code: 'ID',
    name: 'Idaho',
    salesTaxRate: 0.06,
    leaseTaxRate: 0.06,
    leaseTaxType: 'monthly',
    additionalFees: 65,
    description: 'Tax applied to monthly lease payments'
  },
  'IL': {
    code: 'IL',
    name: 'Illinois',
    salesTaxRate: 0.0625,
    leaseTaxRate: 0.0625,
    leaseTaxType: 'monthly',
    additionalFees: 110,
    description: 'Tax applied to monthly lease payments'
  },
  'IN': {
    code: 'IN',
    name: 'Indiana',
    salesTaxRate: 0.07,
    leaseTaxRate: 0.07,
    leaseTaxType: 'monthly',
    additionalFees: 85,
    description: 'Tax applied to monthly lease payments'
  },
  'IA': {
    code: 'IA',
    name: 'Iowa',
    salesTaxRate: 0.06,
    leaseTaxRate: 0.06,
    leaseTaxType: 'monthly',
    additionalFees: 75,
    description: 'Tax applied to monthly lease payments'
  },
  'KS': {
    code: 'KS',
    name: 'Kansas',
    salesTaxRate: 0.065,
    leaseTaxRate: 0.065,
    leaseTaxType: 'monthly',
    additionalFees: 80,
    description: 'Tax applied to monthly lease payments'
  },
  'KY': {
    code: 'KY',
    name: 'Kentucky',
    salesTaxRate: 0.06,
    leaseTaxRate: 0.06,
    leaseTaxType: 'monthly',
    additionalFees: 70,
    description: 'Tax applied to monthly lease payments'
  },
  'LA': {
    code: 'LA',
    name: 'Louisiana',
    salesTaxRate: 0.045,
    leaseTaxRate: 0.045,
    leaseTaxType: 'monthly',
    additionalFees: 85,
    description: 'Tax applied to monthly lease payments'
  },
  'ME': {
    code: 'ME',
    name: 'Maine',
    salesTaxRate: 0.055,
    leaseTaxRate: 0.055,
    leaseTaxType: 'monthly',
    additionalFees: 90,
    description: 'Tax applied to monthly lease payments'
  },
  'MD': {
    code: 'MD',
    name: 'Maryland',
    salesTaxRate: 0.06,
    leaseTaxRate: 0.06,
    leaseTaxType: 'monthly',
    additionalFees: 105,
    description: 'Tax applied to monthly lease payments'
  },
  'MA': {
    code: 'MA',
    name: 'Massachusetts',
    salesTaxRate: 0.0625,
    leaseTaxRate: 0.0625,
    leaseTaxType: 'monthly',
    additionalFees: 115,
    description: 'Tax applied to monthly lease payments'
  },
  'MI': {
    code: 'MI',
    name: 'Michigan',
    salesTaxRate: 0.06,
    leaseTaxRate: 0.06,
    leaseTaxType: 'monthly',
    additionalFees: 95,
    description: 'Tax applied to monthly lease payments'
  },
  'MN': {
    code: 'MN',
    name: 'Minnesota',
    salesTaxRate: 0.06875,
    leaseTaxRate: 0.06875,
    leaseTaxType: 'monthly',
    additionalFees: 100,
    description: 'Tax applied to monthly lease payments'
  },
  'MS': {
    code: 'MS',
    name: 'Mississippi',
    salesTaxRate: 0.07,
    leaseTaxRate: 0.07,
    leaseTaxType: 'monthly',
    additionalFees: 65,
    description: 'Tax applied to monthly lease payments'
  },
  'MO': {
    code: 'MO',
    name: 'Missouri',
    salesTaxRate: 0.04225,
    leaseTaxRate: 0.04225,
    leaseTaxType: 'monthly',
    additionalFees: 75,
    description: 'Tax applied to monthly lease payments'
  },
  'MT': {
    code: 'MT',
    name: 'Montana',
    salesTaxRate: 0.00,
    leaseTaxRate: 0.00,
    leaseTaxType: 'monthly',
    additionalFees: 50,
    description: 'No state sales tax'
  },
  'NE': {
    code: 'NE',
    name: 'Nebraska',
    salesTaxRate: 0.055,
    leaseTaxRate: 0.055,
    leaseTaxType: 'monthly',
    additionalFees: 80,
    description: 'Tax applied to monthly lease payments'
  },
  'NV': {
    code: 'NV',
    name: 'Nevada',
    salesTaxRate: 0.0685,
    leaseTaxRate: 0.0685,
    leaseTaxType: 'monthly',
    additionalFees: 85,
    description: 'Tax applied to monthly lease payments'
  },
  'NH': {
    code: 'NH',
    name: 'New Hampshire',
    salesTaxRate: 0.00,
    leaseTaxRate: 0.00,
    leaseTaxType: 'monthly',
    additionalFees: 60,
    description: 'No state sales tax'
  },
  'NJ': {
    code: 'NJ',
    name: 'New Jersey',
    salesTaxRate: 0.06625,
    leaseTaxRate: 0.06625,
    leaseTaxType: 'monthly',
    additionalFees: 120,
    description: 'Tax applied to monthly lease payments'
  },
  'NM': {
    code: 'NM',
    name: 'New Mexico',
    salesTaxRate: 0.05125,
    leaseTaxRate: 0.05125,
    leaseTaxType: 'monthly',
    additionalFees: 70,
    description: 'Tax applied to monthly lease payments'
  },
  'NY': {
    code: 'NY',
    name: 'New York',
    salesTaxRate: 0.08,
    leaseTaxRate: 0.08,
    leaseTaxType: 'monthly',
    additionalFees: 135,
    description: 'Tax applied to monthly lease payments'
  },
  'NC': {
    code: 'NC',
    name: 'North Carolina',
    salesTaxRate: 0.0475,
    leaseTaxRate: 0.0475,
    leaseTaxType: 'monthly',
    additionalFees: 80,
    description: 'Tax applied to monthly lease payments'
  },
  'ND': {
    code: 'ND',
    name: 'North Dakota',
    salesTaxRate: 0.05,
    leaseTaxRate: 0.05,
    leaseTaxType: 'monthly',
    additionalFees: 65,
    description: 'Tax applied to monthly lease payments'
  },
  'OH': {
    code: 'OH',
    name: 'Ohio',
    salesTaxRate: 0.0575,
    leaseTaxRate: 0.0575,
    leaseTaxType: 'monthly',
    additionalFees: 90,
    description: 'Tax applied to monthly lease payments'
  },
  'OK': {
    code: 'OK',
    name: 'Oklahoma',
    salesTaxRate: 0.045,
    leaseTaxRate: 0.045,
    leaseTaxType: 'monthly',
    additionalFees: 75,
    description: 'Tax applied to monthly lease payments'
  },
  'OR': {
    code: 'OR',
    name: 'Oregon',
    salesTaxRate: 0.00,
    leaseTaxRate: 0.00,
    leaseTaxType: 'monthly',
    additionalFees: 55,
    description: 'No state sales tax'
  },
  'PA': {
    code: 'PA',
    name: 'Pennsylvania',
    salesTaxRate: 0.06,
    leaseTaxRate: 0.06,
    leaseTaxType: 'monthly',
    additionalFees: 105,
    description: 'Tax applied to monthly lease payments'
  },
  'RI': {
    code: 'RI',
    name: 'Rhode Island',
    salesTaxRate: 0.07,
    leaseTaxRate: 0.07,
    leaseTaxType: 'monthly',
    additionalFees: 95,
    description: 'Tax applied to monthly lease payments'
  },
  'SC': {
    code: 'SC',
    name: 'South Carolina',
    salesTaxRate: 0.06,
    leaseTaxRate: 0.06,
    leaseTaxType: 'monthly',
    additionalFees: 80,
    description: 'Tax applied to monthly lease payments'
  },
  'SD': {
    code: 'SD',
    name: 'South Dakota',
    salesTaxRate: 0.045,
    leaseTaxRate: 0.045,
    leaseTaxType: 'monthly',
    additionalFees: 70,
    description: 'Tax applied to monthly lease payments'
  },
  'TN': {
    code: 'TN',
    name: 'Tennessee',
    salesTaxRate: 0.07,
    leaseTaxRate: 0.07,
    leaseTaxType: 'monthly',
    additionalFees: 85,
    description: 'Tax applied to monthly lease payments'
  },
  'TX': {
    code: 'TX',
    name: 'Texas',
    salesTaxRate: 0.0625,
    leaseTaxRate: 0.0625,
    leaseTaxType: 'monthly',
    additionalFees: 100,
    description: 'Tax applied to monthly lease payments'
  },
  'UT': {
    code: 'UT',
    name: 'Utah',
    salesTaxRate: 0.0485,
    leaseTaxRate: 0.0485,
    leaseTaxType: 'monthly',
    additionalFees: 75,
    description: 'Tax applied to monthly lease payments'
  },
  'VT': {
    code: 'VT',
    name: 'Vermont',
    salesTaxRate: 0.06,
    leaseTaxRate: 0.06,
    leaseTaxType: 'monthly',
    additionalFees: 90,
    description: 'Tax applied to monthly lease payments'
  },
  'VA': {
    code: 'VA',
    name: 'Virginia',
    salesTaxRate: 0.053,
    leaseTaxRate: 0.053,
    leaseTaxType: 'monthly',
    additionalFees: 95,
    description: 'Tax applied to monthly lease payments'
  },
  'WA': {
    code: 'WA',
    name: 'Washington',
    salesTaxRate: 0.065,
    leaseTaxRate: 0.065,
    leaseTaxType: 'monthly',
    additionalFees: 110,
    description: 'Tax applied to monthly lease payments'
  },
  'WV': {
    code: 'WV',
    name: 'West Virginia',
    salesTaxRate: 0.06,
    leaseTaxRate: 0.06,
    leaseTaxType: 'monthly',
    additionalFees: 75,
    description: 'Tax applied to monthly lease payments'
  },
  'WI': {
    code: 'WI',
    name: 'Wisconsin',
    salesTaxRate: 0.05,
    leaseTaxRate: 0.05,
    leaseTaxType: 'monthly',
    additionalFees: 85,
    description: 'Tax applied to monthly lease payments'
  },
  'WY': {
    code: 'WY',
    name: 'Wyoming',
    salesTaxRate: 0.04,
    leaseTaxRate: 0.04,
    leaseTaxType: 'monthly',
    additionalFees: 65,
    description: 'Tax applied to monthly lease payments'
  },
  'DC': {
    code: 'DC',
    name: 'District of Columbia',
    salesTaxRate: 0.06,
    leaseTaxRate: 0.06,
    leaseTaxType: 'monthly',
    additionalFees: 100,
    description: 'Tax applied to monthly lease payments'
  }
};

// Get all states as array for dropdown
export const US_STATES = Object.values(STATE_TAX_DATA).map(state => ({
  value: state.code,
  label: state.name,
  taxRate: state.leaseTaxRate,
  additionalFees: state.additionalFees
})).sort((a, b) => a.label.localeCompare(b.label));

// Helper function to get state tax info
export function getStateTaxInfo(stateCode: string): StateTaxInfo | null {
  return STATE_TAX_DATA[stateCode.toUpperCase()] || null;
}

// Helper function to calculate tax on lease payments
export function calculateLeaseTax(
  monthlyPayment: number,
  leaseDuration: number,
  stateCode: string
): {
  monthlyTax: number;
  totalTax: number;
  additionalFees: number;
  totalTaxAndFees: number;
} {
  const taxInfo = getStateTaxInfo(stateCode);
  
  if (!taxInfo) {
    return {
      monthlyTax: 0,
      totalTax: 0,
      additionalFees: 0,
      totalTaxAndFees: 0
    };
  }

  const monthlyTax = monthlyPayment * taxInfo.leaseTaxRate;
  const totalTax = monthlyTax * leaseDuration;
  const additionalFees = taxInfo.additionalFees;
  const totalTaxAndFees = totalTax + additionalFees;

  return {
    monthlyTax,
    totalTax,
    additionalFees,
    totalTaxAndFees
  };
}