"use client";

import { useState } from "react";
import {
  Beaker,
  FileUp,
  MessageCircleWarningIcon,
  Minus,
  Plus,
  RotateCcw,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  BrineComposition,
  GenerateAnalysisPayload,
  PhysicalProperties,
  ProcessParameters,
} from "@/app/_types/prediction";
import { AnalysisMembraneEnum, UserType } from "@/app/_db/enum";
import { useSession } from "next-auth/react";
import { useGenerateAnalysis } from "@/app/hooks/usePredictions";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/lib/routes";

// Define constraints for each category
const brineCompositionConstraints: Partial<
  Record<keyof BrineComposition, { min: number; max?: number }>
> = {
  Li_Conc_ppm: { min: 0 },
  Na_Conc_ppm: { min: 0 },
  K_Conc_ppm: { min: 0 },
  Ca_Conc_ppm: { min: 0 },
  Mg_Conc_ppm: { min: 0 },
  Cl_Conc_ppm: { min: 0 },
  SO4_Conc_ppm: { min: 0 },
  Br_Conc_ppm: { min: 0 },
  B_Conc_ppm: { min: 0 },
  Fe_ppm: { min: 0 },
  Mn_ppm: { min: 0 },
  Sr_ppm: { min: 0 },
  Ba_ppm: { min: 0 },
};

const physicalPropsConstraints: Partial<
  Record<keyof PhysicalProperties, { min: number; max: number }>
> = {
  pH: { min: 0, max: 14 },
};

const processParamsConstraints: Partial<
  Record<keyof ProcessParameters, { min: number; max: number }>
> = {};

// Define the initial state for concentrations
const initialBrineComposition: BrineComposition = {
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
};

// Define the initial state for physical properties
const initialPhysicalProps: PhysicalProperties = {
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
};

// Define the initial state for process parameters
const initialProcessParams: ProcessParameters = {
  Specific_Heat_J_gK: 4.18,
  Voltage_V: 3.7,
  Current_Density_mA_cm2: 80.0,
  Residence_Time_min: 30.0,
  Flow_Rate_L_hr: 500.0,
  Reactor_Volume_L: 250.0,
};

export default function InternalPredictionPlayground() {
  const { data: session } = useSession();
  const router = useRouter();
  const [inputMode, setInputMode] = useState("manual");
  const [brineComposition, setBrineComposition] = useState<BrineComposition>(
    initialBrineComposition,
  );
  const [physicalProps, setPhysicalProps] =
    useState<PhysicalProperties>(initialPhysicalProps);
  const [processParams, setProcessParams] =
    useState<ProcessParameters>(initialProcessParams);
  const [membraneType, setMembraneType] = useState<AnalysisMembraneEnum>(
    AnalysisMembraneEnum.CATION_EXCHANGE,
  );
  const { generateAnalysis, isGenerating, generateError } = useGenerateAnalysis(
    {
      role: (session?.user?.role as UserType) || UserType.ADMIN,
    },
  );

  // Constrained update functions
  const constrainedUpdateBrineComposition = (
    key: keyof BrineComposition,
    value: number,
  ) => {
    const constraints = brineCompositionConstraints[key];
    if (constraints) {
      if (constraints.min !== undefined)
        value = Math.max(value, constraints.min);
      if (constraints.max !== undefined)
        value = Math.min(value, constraints.max);
    }
    setBrineComposition((prev) => ({ ...prev, [key]: value }));
  };

  const constrainedUpdatePhysicalProp = (
    key: keyof PhysicalProperties,
    value: number,
  ) => {
    const constraints = physicalPropsConstraints[key];
    if (constraints) {
      if (constraints.min !== undefined)
        value = Math.max(value, constraints.min);
      if (constraints.max !== undefined)
        value = Math.min(value, constraints.max);
    }
    setPhysicalProps((prev) => ({ ...prev, [key]: value }));
  };

  const constrainedUpdateProcessParam = (
    key: keyof ProcessParameters,
    value: number,
  ) => {
    const constraints = processParamsConstraints[key];
    if (constraints) {
      if (constraints.min !== undefined)
        value = Math.max(value, constraints.min);
      if (constraints.max !== undefined)
        value = Math.min(value, constraints.max);
    }
    setProcessParams((prev) => ({ ...prev, [key]: value }));
  };

  // Function to generate predictions
  const handleGenerateResults = async () => {
    const payload: GenerateAnalysisPayload = {
      // Brine composition
      ...brineComposition,
      // Physical properties
      ...physicalProps,
      // Process parameters
      ...processParams,
      // Membrane type comes from its own state
      Membrane_Type: membraneType,
      company_id: session?.user.companyId || "",
      model_version: "v1.0",
    };

    try {
      const result = await generateAnalysis(payload);
      console.log("Generated results:", result);
      if (result.status === "success") {
        toast.success("Submission Sent", { description: result.message });
        router.push(AppRoutes.dashboard);
      } else if (result.status === "error") {
        toast.warning("Some issues were found", {
          description: result.message,
        });
      }
    } catch (err) {
      console.error("Failed to generate results:", err);
      toast.error(generateError?.message);
    }
  };

  // Function to reset all values to defaults
  const resetToDefaults = () => {
    setBrineComposition(initialBrineComposition);
    setPhysicalProps(initialPhysicalProps);
    setProcessParams(initialProcessParams);
    setMembraneType(AnalysisMembraneEnum.CATION_EXCHANGE);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-muted-foreground">
            Configure parameters for prediction generation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults} className="gap-1">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={handleGenerateResults}
            disabled={isGenerating}
            className="min-w-[180px]"
          >
            <Zap className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Predictions"}
          </Button>
        </div>
      </div>

      <Card className="pb-0">
        <CardHeader className="space-y-4 pb-0">
          <CardTitle className="text-lg">Input Method</CardTitle>
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
            {/* <div className="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv">Upload CSV</Label>
            </div> */}
          </RadioGroup>
        </CardHeader>

        {inputMode === "csv" ? (
          <CardContent>
            <div className="rounded-md border-2 border-dashed p-6 text-center">
              <FileUp className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
              <p className="text-muted-foreground mb-2 text-sm">
                Drag and drop your CSV file here or click to browse
              </p>
              <Button variant="outline" size="sm">
                Browse Files
              </Button>
            </div>
          </CardContent>
        ) : (
          <CardContent className="p-0">
            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Membrane Type Selection */}
              <div className="col-span-full">
                <Label
                  htmlFor="membrane-type"
                  className="mb-2 block text-sm font-medium"
                >
                  Membrane Type
                </Label>
                <Select
                  value={membraneType}
                  onValueChange={(value) =>
                    setMembraneType(value as AnalysisMembraneEnum)
                  }
                >
                  <SelectTrigger id="membrane-type" className="w-full">
                    <SelectValue placeholder="Select membrane type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AnalysisMembraneEnum.CATION_EXCHANGE}>
                      Cation-Exchange
                    </SelectItem>
                    <SelectItem value={AnalysisMembraneEnum.ANION_EXCHANGE}>
                      Anion-Exchange
                    </SelectItem>
                    <SelectItem value={AnalysisMembraneEnum.BIPOLAR}>
                      Bipolar
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Brine Composition Section */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <Beaker className="text-primary mr-2 h-4 w-4" />
                  <h3 className="text-sm font-medium">Brine Composition</h3>
                </div>
                <Separator />
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(brineComposition).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <Label htmlFor={key} className="text-xs font-medium">
                        {key.replace(/_/g, " ")}
                      </Label>
                      <div className="flex">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => {
                            const currentValue =
                              brineComposition[key as keyof BrineComposition];
                            const step = 0.1;
                            const newValue = currentValue - step;
                            constrainedUpdateBrineComposition(
                              key as keyof BrineComposition,
                              newValue,
                            );
                          }}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          id={key}
                          type="number"
                          value={value}
                          onChange={(e) =>
                            constrainedUpdateBrineComposition(
                              key as keyof BrineComposition,
                              Number.parseFloat(e.target.value) || 0,
                            )
                          }
                          className="z-20 h-8 rounded-none text-center"
                          step={0.1}
                          min={
                            brineCompositionConstraints[
                              key as keyof BrineComposition
                            ]?.min
                          }
                          max={
                            brineCompositionConstraints[
                              key as keyof BrineComposition
                            ]?.max
                          }
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => {
                            const currentValue =
                              brineComposition[key as keyof BrineComposition];
                            const step = 0.1;
                            const newValue = currentValue + step;
                            constrainedUpdateBrineComposition(
                              key as keyof BrineComposition,
                              newValue,
                            );
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Physical Properties Section */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <Beaker className="text-primary mr-2 h-4 w-4" />
                  <h3 className="text-sm font-medium">Physical Properties</h3>
                </div>
                <Separator />
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(physicalProps).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <Label htmlFor={key} className="text-xs font-medium">
                        {key.replace(/_/g, " ")}
                      </Label>
                      <div className="flex">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => {
                            const currentValue =
                              physicalProps[key as keyof PhysicalProperties];
                            const step = 0.1;
                            const newValue = currentValue - step;
                            constrainedUpdatePhysicalProp(
                              key as keyof PhysicalProperties,
                              newValue,
                            );
                          }}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          id={key}
                          type="number"
                          value={value}
                          onChange={(e) =>
                            constrainedUpdatePhysicalProp(
                              key as keyof PhysicalProperties,
                              Number.parseFloat(e.target.value) || 0,
                            )
                          }
                          className="h-8 rounded-none text-center"
                          step={0.1}
                          min={
                            physicalPropsConstraints[
                              key as keyof PhysicalProperties
                            ]?.min
                          }
                          max={
                            physicalPropsConstraints[
                              key as keyof PhysicalProperties
                            ]?.max
                          }
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => {
                            const currentValue =
                              physicalProps[key as keyof PhysicalProperties];
                            const step = 0.1;
                            const newValue = currentValue + step;
                            constrainedUpdatePhysicalProp(
                              key as keyof PhysicalProperties,
                              newValue,
                            );
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process Parameters Section */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <Beaker className="text-primary mr-2 h-4 w-4" />
                  <h3 className="text-sm font-medium">Process Parameters</h3>
                </div>
                <Separator />
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(processParams).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <Label htmlFor={key} className="text-xs font-medium">
                        {key.replace(/_/g, " ")}
                      </Label>
                      <div className="flex">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => {
                            const currentValue =
                              processParams[key as keyof ProcessParameters];
                            const step = 0.1;
                            const newValue = currentValue - step;
                            constrainedUpdateProcessParam(
                              key as keyof ProcessParameters,
                              newValue,
                            );
                          }}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          id={key}
                          type="number"
                          value={value}
                          onChange={(e) =>
                            constrainedUpdateProcessParam(
                              key as keyof ProcessParameters,
                              Number.parseFloat(e.target.value) || 0,
                            )
                          }
                          className="h-8 rounded-none text-center"
                          step={0.1}
                          min={
                            processParamsConstraints[
                              key as keyof ProcessParameters
                            ]?.min
                          }
                          max={
                            processParamsConstraints[
                              key as keyof ProcessParameters
                            ]?.max
                          }
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => {
                            const currentValue =
                              processParams[key as keyof ProcessParameters];
                            const step = 0.1;
                            const newValue = currentValue + step;
                            constrainedUpdateProcessParam(
                              key as keyof ProcessParameters,
                              newValue,
                            );
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        )}
        <CardFooter className="bg-muted/50 border-t px-6 py-3">
          <div className="flex w-full flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <p className="text-muted-foreground flex space-x-2 text-xs">
              <MessageCircleWarningIcon className="font-sm h-4" />
              Configure all parameters before generating predictions
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetToDefaults}>
                Reset to Defaults
              </Button>
              <Button
                size="sm"
                onClick={handleGenerateResults}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate"}
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
