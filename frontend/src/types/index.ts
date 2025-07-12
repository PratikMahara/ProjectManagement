export interface Project {
  id: string;

  projectName: string;
  location: string;
  startDate: string;
  expectedEndDate: string;
  estimatedCost: number;
  createdAt: string;
}

export interface Material {
  id: string;
  projectId: string;

  serialNumber: string;
  materialName: string;
  siteName: string;
  actualStock: number;
  usedStock: number;
  availableStock: number;
  costPerUnit: number;
  totalCost: number;
  buyDate: string;
  stockStatus: "critical" | "warning" | "good";
}

export interface Staff {
  id: string;
  projectId: string;
  serialNumber: string;
  role: string;
  name: string;
  salary: number;
  workProgress: number;
  startDate: string;
  status: "active" | "inactive";
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: "admin";
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
