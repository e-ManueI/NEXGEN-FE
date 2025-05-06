"use client";

import { useState } from "react";
import { Beaker, FileUp, Minus, Plus, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LithiumDashboard() {
  // State for input values
  const [inputMode, setInputMode] = useState("manual");
  const [concentrations, setConcentrations] = useState({
    Li_Conc_ppm: 180.5,
    Na_Conc_ppm: 7500.0,
    K_Conc_ppm: 3200.0,
    Ca_Conc_ppm: 650.0,
    Mg_Conc_ppm: 420.0,
    Cl_Conc_ppm: 22000.0,
    SO4_Conc_ppm: 2800.0,
    Br_Conc_ppm: 0.0,
  });
  const [hasResults, setHasResults] = useState(false);

  // Function to update concentration values
  const updateConcentration = (
    key: keyof typeof concentrations,
    value: number,
  ) => {
    setConcentrations((prev) => ({
      ...prev,
      [key]: Math.max(0, value), // Ensure value is not negative
    }));
  };

  // Function to increment/decrement values
  const adjustValue = (
    key: keyof typeof concentrations,
    increment: boolean,
  ) => {
    const step = key === "Li_Conc_ppm" ? 0.1 : 1; // Smaller step for Lithium
    const newValue = increment
      ? concentrations[key] + step
      : concentrations[key] - step;

    updateConcentration(key, newValue);
  };

  // Function to generate results
  const generateResults = () => {
    setHasResults(true);
  };

  return (
    <div className="cp; grid grid-cols-1 gap-x-4 md:grid-cols-4">
      {/* Input Panel */}
      <Card className="col-span-full xl:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Input Parameters</CardTitle>
          <CardDescription>
            Enter brine sample properties for analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Input Mode Section */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Choose Input Method:
              </Label>
              <RadioGroup
                defaultValue="manual"
                value={inputMode}
                onValueChange={setInputMode}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manual" id="manual" />
                  <Label htmlFor="manual">Manual Input</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv">Upload CSV</Label>
                </div>
              </RadioGroup>
            </div>

            {inputMode === "csv" ? (
              <div className="pt-2">
                <Label htmlFor="csv-upload" className="sr-only">
                  Upload CSV
                </Label>
                <div className="rounded-md border-2 border-dashed p-6 text-center">
                  <FileUp className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                  <p className="text-muted-foreground mb-2 text-sm">
                    Drag and drop your CSV file here or click to browse
                  </p>
                  <Button variant="outline" size="sm">
                    Browse Files
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-medium">Brine Sample Properties</h3>
                <Separator />

                {/* Concentration Input Fields - Organized in a more compact way */}
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(concentrations).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <Label htmlFor={key} className="text-xs font-medium">
                        {key.replace(/_/g, " ")}
                      </Label>
                      <div className="flex">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() =>
                            adjustValue(
                              key as keyof typeof concentrations,
                              false,
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          id={key}
                          type="number"
                          value={value}
                          onChange={(e) =>
                            updateConcentration(
                              key as keyof typeof concentrations,
                              Number.parseFloat(e.target.value) || 0,
                            )
                          }
                          className="h-8 rounded-none text-center focus:border-none focus:ring-0"
                          style={{
                            /* Chrome, Safari, Edge, Opera */
                            WebkitAppearance: "none",
                            /* Firefox */
                            MozAppearance: "textfield",
                            /* standard */
                            appearance: "none",
                            /* reset default margin so the field doesn’t jump */
                            margin: 0,
                          }}
                          step={0.1}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() =>
                            adjustValue(
                              key as keyof typeof concentrations,
                              true,
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={generateResults}>
            <Zap className="mr-2 h-4 w-4" />
            Generate Predictions
          </Button>
        </CardFooter>
      </Card>

      {/* Results Panel */}
      <Card className="xl:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-green-500" />
            Lithium Extraction Feasibility Results
          </CardTitle>
          <CardDescription>
            Analysis and predictions based on your brine sample properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasResults ? (
            <div className="flex h-[400px] flex-col items-center justify-center text-center">
              <Beaker className="text-muted-foreground mb-4 h-16 w-16" />
              <h3 className="mb-2 text-lg font-medium">
                No Results Generated Yet
              </h3>
              <p className="text-muted-foreground max-w-md text-sm">
                Enter your brine sample properties on the left and click
                &quot;Generate Predictions&quot; to see extraction feasibility
                analysis.
              </p>
            </div>
          ) : (
            <Tabs defaultValue="summary">
              <TabsList className="mb-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="recommendations">
                  Recommendations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20">
                  <Beaker className="h-4 w-4 text-green-500" />
                  <AlertTitle>Extraction Feasible</AlertTitle>
                  <AlertDescription>
                    Based on the lithium concentration of{" "}
                    {concentrations.Li_Conc_ppm.toFixed(2)} ppm, extraction is
                    economically viable.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">
                        Estimated Recovery Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">87.5%</div>
                      <p className="text-muted-foreground text-xs">
                        Based on optimal processing conditions
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">
                        Estimated Production Cost
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$3,850/ton</div>
                      <p className="text-muted-foreground text-xs">
                        Including processing and refinement
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Processing Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">72 hours</div>
                      <p className="text-muted-foreground text-xs">
                        From extraction to final product
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Purity Level</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">99.5%</div>
                      <p className="text-muted-foreground text-xs">
                        Battery-grade lithium carbonate
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="details">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Detailed Analysis</h3>
                  <p>
                    Detailed extraction analysis would be displayed here,
                    including process parameters, chemical reactions, and
                    efficiency calculations.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="charts">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Visualization</h3>
                  <div className="bg-muted flex aspect-[16/9] items-center justify-center rounded-md">
                    <p className="text-muted-foreground">
                      Charts and graphs would be displayed here
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recommendations">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Recommendations</h3>
                  <p>
                    Process optimization recommendations would be displayed here
                    based on the input parameters.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
