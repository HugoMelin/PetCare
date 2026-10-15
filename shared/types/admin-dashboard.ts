export interface DashboardDistributionItem {
  label: string;
  value: number;
}

export interface AdminDashboardStats {
  totals: {
    users: number;
    pets: number;
    medications: number;
    weights: number;
  };
  ownership: DashboardDistributionItem[];
  species: DashboardDistributionItem[];
  medicationCoverage: DashboardDistributionItem[];
  topMedications: DashboardDistributionItem[];
}
