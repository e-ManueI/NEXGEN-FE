import { AnalysisMembraneEnum } from "../_db/enum";

export type Prediction = {
  predictionId: string;
  modelVersion: string;
  companyName: string;
  status: string;
  predictedAt: string;
  isApproved: boolean;
};

export type GenerateAnalysisPayload = {
  Li_Conc_ppm: number;
  Na_Conc_ppm: number;
  K_Conc_ppm: number;
  Ca_Conc_ppm: number;
  Mg_Conc_ppm: number;
  Cl_Conc_ppm: number;
  SO4_Conc_ppm: number;
  Br_Conc_ppm: number;
  B_Conc_ppm: number;
  Fe_ppm: number;
  Mn_ppm: number;
  Sr_ppm: number;
  Ba_ppm: number;
  pH: number;
  Viscosity_cP: number;
  Conductivity_mS_cm: number;
  Density_kg_m3: number;
  Temperature_C: number;
  TDS_mg_L: number;
  Turbidity_NTU: number;
  Redox_mV: number;
  Dissolved_O2_mg_L: number;
  Specific_Gravity: number;
  Specific_Heat_J_gK: number;
  Voltage_V: number;
  Current_Density_mA_cm2: number;
  Residence_Time_min: number;
  Flow_Rate_L_hr: number;
  Reactor_Volume_L: number;
  Membrane_Type: AnalysisMembraneEnum;
  company_id: string;
  model_version: string;
};

// Define types for our state objects
export type BrineComposition = Pick<
  GenerateAnalysisPayload,
  | "Li_Conc_ppm"
  | "Na_Conc_ppm"
  | "K_Conc_ppm"
  | "Ca_Conc_ppm"
  | "Mg_Conc_ppm"
  | "Cl_Conc_ppm"
  | "SO4_Conc_ppm"
  | "Br_Conc_ppm"
  | "B_Conc_ppm"
  | "Fe_ppm"
  | "Mn_ppm"
  | "Sr_ppm"
  | "Ba_ppm"
>;

export type PhysicalProperties = Pick<
  GenerateAnalysisPayload,
  | "pH"
  | "Viscosity_cP"
  | "Conductivity_mS_cm"
  | "Density_kg_m3"
  | "Temperature_C"
  | "TDS_mg_L"
  | "Turbidity_NTU"
  | "Redox_mV"
  | "Dissolved_O2_mg_L"
  | "Specific_Gravity"
>;

export type ProcessParameters = Pick<
  GenerateAnalysisPayload,
  | "Specific_Heat_J_gK"
  | "Voltage_V"
  | "Current_Density_mA_cm2"
  | "Residence_Time_min"
  | "Flow_Rate_L_hr"
  | "Reactor_Volume_L"
>;

export type AnalysisResponse = {
  status: string;
  message: string;
};

export type PredictionResultResponse = {
  prediction: {
    id: string;
    companyName: string;
    submissionDate: string; // ISO timestamp
    predictionStatus: string; // e.g. "pending"
    processedBy: string; // e.g. "ML Model v2.1"
    reviewStatus: string; // e.g. "Awaiting Expert Review"
  };
  chloralkaliInDepth: string | null;
  chloralkaliSummary: string | null;
  chloralkaliComparison: string | null;
  electrodialysisInDepth: string | null;
  electrodialysisSummary: string | null;
};

export type PredictionResultContent = Pick<
  PredictionResultResponse,
  | "chloralkaliInDepth"
  | "chloralkaliSummary"
  | "chloralkaliComparison"
  | "electrodialysisInDepth"
  | "electrodialysisSummary"
>;

export type ClientPredictionResultContent = Pick<
  PredictionResultResponse,
  "chloralkaliComparison" | "chloralkaliSummary" | "electrodialysisSummary"
>;
