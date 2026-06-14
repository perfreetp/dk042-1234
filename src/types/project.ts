export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  coverImage: string;
  location: string;
  distance: string;
  investmentAmount: InvestmentLevel;
  timeIntensity: TimeIntensity;
  requiredRoles: RequiredRole[];
  profitSharing: string;
  startupCost: number;
  trialPeriod: string;
  exitAgreement: string;
  goals?: string;
  publisher: Publisher;
  status: 'recruiting' | 'in_progress' | 'completed';
  createdAt: string;
  tags: string[];
  viewCount: number;
  applyCount: number;
}

export type ProjectCategory = 
  | 'stall' 
  | '探店账号' 
  | '手作团购' 
  | '社区团长' 
  | '摄影接单' 
  | '其他';

export type InvestmentLevel = 'zero' | 'low' | 'medium' | 'high';

export type TimeIntensity = 'weekend' | 'parttime' | 'fulltime';

export interface RequiredRole {
  name: string;
  count: number;
  skills: string[];
  description: string;
}

export interface Publisher {
  id: string;
  name: string;
  avatar: string;
  creditScore: number;
  completedProjects: number;
}

export interface FilterOptions {
  category?: ProjectCategory;
  investmentAmount?: InvestmentLevel;
  timeIntensity?: TimeIntensity;
  maxDistance?: number;
  role?: string;
  keyword?: string;
}
