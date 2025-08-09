import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Calculator, CheckCircle, AlertCircle, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { leaseAnalysisRequestSchema, type LeaseAnalysisRequest } from "@shared/schema";
import { US_STATES, getStateTaxInfo } from "@shared/state-tax-data";

interface AnalysisResult {
  id: number;
  carModel: string;
  state: string;
  upfrontPayment: number;
  monthlyPayment: number;
  leaseDuration: number;
  buyoutPrice: number;
  totalCost: number;
  marketValue: number;
  savings: number;
  savingsPercentage: number;
  dealQuality: string;
  recommendation: string;
  isGoodDeal: boolean;
  taxInfo: {
    monthlyTax: number;
    totalTax: number;
    stateFees: number;
    taxRate: number;
    stateName: string;
  };
  vehicleInfo: {
    year: number;
    make: string;
    model: string;
    source: string;
    msrp: number;
  };
}

const LEASE_DURATIONS = [
  { value: 24, label: "24 months" },
  { value: 36, label: "36 months" },
  { value: 48, label: "48 months" },
];

export default function LeaseAnalyzer() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const form = useForm<LeaseAnalysisRequest>({
    resolver: zodResolver(leaseAnalysisRequestSchema),
    defaultValues: {
      carModel: "",
      state: "",
      upfrontPayment: 0,
      monthlyPayment: 0,
      leaseDuration: 36,
      buyoutPrice: 0,
    },
  });

  const analyzeLeaseDeadMutation = useMutation({
    mutationFn: async (data: LeaseAnalysisRequest) => {
      const response = await apiRequest("POST", "/api/lease-analysis", data);
      return response.json();
    },
    onSuccess: (result: AnalysisResult) => {
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: `Your lease deal has been analyzed. You're ${result.isGoodDeal ? 'saving' : 'overpaying by'} $${Math.abs(result.savings).toLocaleString()}.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze lease deal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LeaseAnalysisRequest) => {
    analyzeLeaseDeadMutation.mutate(data);
  };

  const resetForm = () => {
    form.reset();
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Car Lease Deal Analyzer</h1>
              <p className="text-sm text-slate-600">Determine if your lease deal is worth it</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Lease Calculator Form */}
          <Card className="shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-xl">Lease Details</CardTitle>
              <p className="text-slate-600">Enter your lease information to analyze the deal</p>
            </CardHeader>
            
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Car Model Input */}
                  <FormField
                    control={form.control}
                    name="carModel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Car Model</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., BMW X5, Tesla Model 3, Honda Civic"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* State Selection */}
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lease State</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state.value} value={state.value}>
                                {state.label} ({(state.taxRate * 100).toFixed(2)}% tax)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Lease Terms Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="upfrontPayment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upfront Payment</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                placeholder="4000"
                                className="pl-9"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="monthlyPayment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Payment</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                placeholder="300"
                                className="pl-9"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="leaseDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lease Duration</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select term" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {LEASE_DURATIONS.map((duration) => (
                                <SelectItem key={duration.value} value={duration.value.toString()}>
                                  {duration.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="buyoutPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Buyout Price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                placeholder="20000"
                                className="pl-9"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={analyzeLeaseDeadMutation.isPending}
                  >
                    {analyzeLeaseDeadMutation.isPending ? "Analyzing..." : "Analyze Deal"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Results Display */}
          <Card className="shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-xl">Deal Analysis</CardTitle>
              <p className="text-slate-600">Comprehensive breakdown of your lease deal</p>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {analysisResult ? (
                <>
                  {/* Results Summary Card */}
                  <div className={`rounded-lg p-6 text-white ${
                    analysisResult.isGoodDeal 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                      : 'bg-gradient-to-r from-red-500 to-red-600'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {analysisResult.isGoodDeal ? 'Great Deal!' : 'Poor Deal'}
                        </h3>
                        <p className={analysisResult.isGoodDeal ? 'text-emerald-100' : 'text-red-100'}>
                          You're {analysisResult.isGoodDeal ? 'saving' : 'overpaying by'} ${Math.abs(analysisResult.savings).toLocaleString()} compared to market value
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">
                          {analysisResult.savingsPercentage > 0 ? '+' : ''}{analysisResult.savingsPercentage}%
                        </div>
                        <div className={`text-sm ${analysisResult.isGoodDeal ? 'text-emerald-100' : 'text-red-100'}`}>
                          {analysisResult.isGoodDeal ? 'Savings' : 'Overpayment'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Vehicle Information</h4>
                    
                    <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Vehicle</span>
                        <span className="font-medium">{analysisResult.vehicleInfo.year} {analysisResult.vehicleInfo.make} {analysisResult.vehicleInfo.model}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">MSRP</span>
                        <span className="font-medium text-green-600">${analysisResult.vehicleInfo.msrp.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Current Market Value</span>
                        <span className="font-medium text-blue-600">${analysisResult.marketValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Data Source</span>
                        <span className="font-medium text-xs">{analysisResult.vehicleInfo.source}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Cost Breakdown</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-600">Upfront Payment</span>
                        <span className="font-medium">${analysisResult.upfrontPayment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-600">Monthly Payments ({analysisResult.leaseDuration} months)</span>
                        <span className="font-medium">${analysisResult.monthlyPayment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-600">Buyout Price</span>
                        <span className="font-medium">${analysisResult.buyoutPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-600">Monthly Tax ({(analysisResult.taxInfo.taxRate * 100).toFixed(2)}%)</span>
                        <span className="font-medium">${analysisResult.taxInfo.monthlyTax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-600">Total Tax & Fees</span>
                        <span className="font-medium">${(analysisResult.taxInfo.totalTax + analysisResult.taxInfo.stateFees).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-t-2 border-slate-200 font-semibold text-lg">
                        <span className="text-slate-900">Total Cost</span>
                        <span className="text-slate-900">${analysisResult.totalCost.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tax Breakdown */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Tax Information ({analysisResult.taxInfo.stateName})</h4>
                    
                    <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">State Tax Rate</span>
                        <span className="font-medium text-blue-900">{(analysisResult.taxInfo.taxRate * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">Monthly Tax</span>
                        <span className="font-medium text-blue-900">${analysisResult.taxInfo.monthlyTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">Total Tax ({analysisResult.leaseDuration} months)</span>
                        <span className="font-medium text-blue-900">${analysisResult.taxInfo.totalTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">State Fees</span>
                        <span className="font-medium text-blue-900">${analysisResult.taxInfo.stateFees.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Market Comparison */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Market Comparison</h4>
                    
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-600">Estimated Market Value</span>
                        <span className="font-semibold text-slate-900">${analysisResult.marketValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-slate-600">Your Total Cost</span>
                        <span className="font-semibold text-slate-900">${analysisResult.totalCost.toLocaleString()}</span>
                      </div>
                      <div className={`flex justify-between items-center font-semibold ${
                        analysisResult.isGoodDeal ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <span>Your {analysisResult.isGoodDeal ? 'Savings' : 'Overpayment'}</span>
                        <span>${Math.abs(analysisResult.savings).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Deal Quality</span>
                        <span>{analysisResult.dealQuality}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            analysisResult.isGoodDeal ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ 
                            width: `${Math.min(Math.abs(analysisResult.savingsPercentage) * 4, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      {analysisResult.isGoodDeal ? (
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                      )}
                      <div>
                        <h5 className="font-semibold text-blue-900 mb-1">Recommendation</h5>
                        <p className="text-blue-800 text-sm">
                          {analysisResult.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={resetForm}
                    variant="outline"
                    className="w-full"
                  >
                    Analyze Another Deal
                  </Button>
                </>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Ready to Analyze</h3>
                  <p className="text-slate-600">
                    Enter your lease details on the left to get started with the analysis.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mt-12 shadow-lg">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-xl">How It Works</CardTitle>
            <p className="text-slate-600">Understanding our lease deal analysis methodology</p>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">1. Calculate Total Cost</h3>
                <p className="text-sm text-slate-600">We add up your upfront payment, monthly payments, and buyout price to get your total cost</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">2. Compare Market Value</h3>
                <p className="text-sm text-slate-600">We compare your total cost against current market values for your specific car model and location</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">3. Provide Recommendation</h3>
                <p className="text-sm text-slate-600">Get a clear recommendation on whether your lease deal offers good value compared to market rates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              noahalex.dev
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
