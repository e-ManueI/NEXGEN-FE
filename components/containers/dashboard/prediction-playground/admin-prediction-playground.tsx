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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminPredictionPlayground() {
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
    B_Conc_ppm: 35.0,
    Fe_ppm: 2.0,
    Mn_ppm: 1.5,
    Sr_ppm: 8.0,
    Ba_ppm: 0.7,
    pH: 6.8,
    Viscosity_cP: 1.3,
    Conductivity_mS_cm: 155.0,
    Density_kg_m3: 1120.0,
    Temperature_C: 35.0,
    TDS_mg_L: 105000.0,
    Turbidity_NTU: 1.5,
    Redox_mV: 250.0,
    Dissolved_O2_mg_L: 6.5,
    Specific_Gravity: 1.12,
    Specific_Heat_J_gk: 4.18,
    Voltage_V: 3.7,
    Current_Density_mA_cm2: 80.0,
    Residence_Time_min: 30.0,
    Flow_Rate_L_hr: 500.0,
    Reactor_Volume_L: 250.0,
  });
  const [hasResults, setHasResults] = useState(false);

  // State for non-numeric inputs
  const [processParams, setProcessParams] = useState({
    membraneType: "ceramic",
    extractionMethod: "adsorption",
    pretreatmentLevel: "medium",
    temperatureControl: true,
    pressureLevel: 50, // for slider
    phAdjustment: "neutral",
  });

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

  // Function to update process parameters
  const updateProcessParam = (
    key: keyof typeof processParams,
    value: string | number | boolean,
  ) => {
    setProcessParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Function to generate results
  const generateResults = () => {
    setHasResults(true);
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      {/* Input Panel */}
      <Card className="col-span-full min-h-[calc(30dvh)] overflow-scroll md:col-span-1 lg:col-span-1">
        <CardHeader className="">
          <CardTitle className="text-xl">Input Parameters</CardTitle>
          <CardDescription>
            Enter brine sample properties for analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <div className="px-4">
            {/* Input Mode Section */}
            <div className="space-y-4">
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
          </div>

          <div className="mt-4 h-[calc(55dvh)] min-h-[300px] overflow-y-auto px-4">
            {inputMode === "csv" ? (
              <div className="">
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
              <div className="space-y-6 pt-2">
                {/* Brine Sample Properties Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">
                    Brine Sample Properties
                  </h3>
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
                            className="z-30 h-8 rounded-none text-center"
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

                {/* Process Parameters Section - Non-numeric inputs */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Process Parameters</h3>
                  <Separator />

                  {/* Membrane Type Dropdown */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="membrane-type"
                      className="text-xs font-medium"
                    >
                      Membrane Type
                    </Label>
                    <Select
                      value={processParams.membraneType}
                      onValueChange={(value) =>
                        updateProcessParam("membraneType", value)
                      }
                    >
                      <SelectTrigger id="membrane-type" className="h-8 w-full">
                        <SelectValue placeholder="Select membrane type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ceramic">Ceramic</SelectItem>
                        <SelectItem value="polymer">Polymer</SelectItem>
                        <SelectItem value="composite">Composite</SelectItem>
                        <SelectItem value="nanofiltration">
                          Nanofiltration
                        </SelectItem>
                        <SelectItem value="reverse-osmosis">
                          Reverse Osmosis
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* TODO: Extraction Method Dropdown */}
                  {/* <div className="space-y-1">
                    <Label
                      htmlFor="extraction-method"
                      className="text-xs font-medium"
                    >
                      Extraction Method
                    </Label>
                    <Select
                      value={processParams.extractionMethod}
                      onValueChange={(value) =>
                        updateProcessParam("extractionMethod", value)
                      }
                    >
                      <SelectTrigger
                        id="extraction-method"
                        className="h-8 w-full"
                      >
                        <SelectValue placeholder="Select extraction method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adsorption">Adsorption</SelectItem>
                        <SelectItem value="ion-exchange">
                          Ion Exchange
                        </SelectItem>
                        <SelectItem value="solvent-extraction">
                          Solvent Extraction
                        </SelectItem>
                        <SelectItem value="precipitation">
                          Precipitation
                        </SelectItem>
                        <SelectItem value="electrochemical">
                          Electrochemical
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}

                  {/* TODO: Pretreatment Level Dropdown */}
                  {/* <div className="space-y-1">
                    <Label
                      htmlFor="pretreatment-level"
                      className="text-xs font-medium"
                    >
                      Pretreatment Level
                    </Label>
                    <Select
                      value={processParams.pretreatmentLevel}
                      onValueChange={(value) =>
                        updateProcessParam("pretreatmentLevel", value)
                      }
                    >
                      <SelectTrigger
                        id="pretreatment-level"
                        className="h-8 w-full"
                      >
                        <SelectValue placeholder="Select pretreatment level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="intensive">Intensive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}

                  {/* TODO: pH Adjustment Dropdown */}
                  {/* <div className="space-y-1">
                    <Label
                      htmlFor="ph-adjustment"
                      className="text-xs font-medium"
                    >
                      pH Adjustment
                    </Label>
                    <Select
                      value={processParams.phAdjustment}
                      onValueChange={(value) =>
                        updateProcessParam("phAdjustment", value)
                      }
                    >
                      <SelectTrigger id="ph-adjustment" className="h-8 w-full">
                        <SelectValue placeholder="Select pH adjustment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="highly-acidic">
                          Highly Acidic (pH 1-3)
                        </SelectItem>
                        <SelectItem value="acidic">Acidic (pH 4-6)</SelectItem>
                        <SelectItem value="neutral">Neutral (pH 7)</SelectItem>
                        <SelectItem value="alkaline">
                          Alkaline (pH 8-10)
                        </SelectItem>
                        <SelectItem value="highly-alkaline">
                          Highly Alkaline (pH 11-14)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}

                  {/* TODO: Pressure Level Slider */}
                  {/* <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="pressure-level"
                        className="text-xs font-medium"
                      >
                        Pressure Level (bar)
                      </Label>
                      <span className="text-xs font-medium">
                        {processParams.pressureLevel}
                      </span>
                    </div>
                    <Slider
                      id="pressure-level"
                      min={0}
                      max={100}
                      step={1}
                      value={[processParams.pressureLevel]}
                      onValueChange={(value) =>
                        updateProcessParam("pressureLevel", value[0])
                      }
                      className="w-full"
                    />
                  </div> */}

                  {/* TODO: Temperature Control Switch */}
                  {/* <div className="flex items-center justify-between space-y-0 pt-1">
                    <Label
                      htmlFor="temperature-control"
                      className="text-xs font-medium"
                    >
                      Temperature Control
                    </Label>
                    <Switch
                      id="temperature-control"
                      checked={processParams.temperatureControl}
                      onCheckedChange={(checked) =>
                        updateProcessParam("temperatureControl", checked)
                      }
                    />
                  </div> */}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="">
          <Button className="w-full" onClick={generateResults}>
            <Zap className="mr-2 h-4 w-4" />
            Generate Predictions
          </Button>
        </CardFooter>
      </Card>

      {/* Results Panel */}
      <Card className="col-span-full flex flex-col md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-green-500" />
            Lithium Extraction Feasibility Results
          </CardTitle>
          <CardDescription>
            Analysis and predictions based on your input parameters
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
                Enter your parameters on the left and click &quot;Generate
                Predictions&quot; to see extraction feasibility analysis.
              </p>
            </div>
          ) : (
            <Tabs defaultValue="summary">
              <TabsList className="mb-4">
                <TabsTrigger value="chlr-summary">
                  Chlor-alkali Summary
                </TabsTrigger>
                <TabsTrigger value="chlr-depth">
                  Chlor-alkali In-Depth
                </TabsTrigger>
                <TabsTrigger value="chlr-comparison">
                  Chlor-alkali Comparison
                </TabsTrigger>
                <TabsTrigger value="electro-summary">
                  Electrodialysis Summary
                </TabsTrigger>
                <TabsTrigger value="electro-depth">
                  Electrodialysis In-Depth
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chlr-summary" className="space-y-4">
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

              <TabsContent value="chlr-depth">
                {/* <div className="space-y-4">
                  <h3 className="text-lg font-medium">Detailed Analysis</h3>
                  <p>
                    Detailed extraction analysis would be displayed here,
                    including process parameters, chemical reactions, and
                    efficiency calculations.
                  </p>

                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium">
                      Selected Process Parameters:
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <span className="font-medium">Membrane Type:</span>{" "}
                        {processParams.membraneType}
                      </li>
                    </ul>
                  </div>
                </div> */}
              </TabsContent>

              <TabsContent value="chlr-comparison">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Chlor-alkali Comparison
                  </h3>
                  <div className="bg-muted flex aspect-[16/9] items-center justify-center rounded-md">
                    <p className="text-muted-foreground">
                      Content will be displayed here
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="electro-summary">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Electrodialysis Summary
                  </h3>
                  <p>
                    Velit nostrud id aliquip officia qui exercitation pariatur
                    non veniam quis occaecat amet.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="electro-depth">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Electrodialysis In-Depth
                  </h3>
                  <p>
                    Est dolore est anim incididunt veniam non cupidatat sunt.
                    Nostrud et Lorem exercitation exercitation fugiat enim
                    aliqua.
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
