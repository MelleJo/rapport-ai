export interface ReportSection {
    title: string;
    content: string;
    graphs?: string[];
  }
  
  export interface FinancialPlanningReport {
    samenvatting: string;
    sections: ReportSection[];
    actiepuntenClient: string[];
    actiepuntenAdviseur: string[];
  }
  
  export interface AnalysisResult {
    missingInformation: string[];
    complete: boolean;
  }