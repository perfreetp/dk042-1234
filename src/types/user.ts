export interface User {
  id: string;
  name: string;
  avatar: string;
  age: number;
  location: string;
  bio: string;
  skills: Skill[];
  availableTime: AvailableTime;
  resources: Resource[];
  creditScore: number;
  reviews: Review[];
  cooperationPreferences: CooperationPreferences;
  completedProjects: number;
  successRate: number;
  matchScore?: number;
  complementarySkills?: string[];
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'expert';
  experience: string;
}

export interface AvailableTime {
  weekdays: string[];
  weekends: string[];
  totalHoursPerWeek: number;
}

export interface Resource {
  type: 'equipment' | 'space' | 'capital' | 'network' | 'other';
  name: string;
  description: string;
  icon?: string;
}

export interface Review {
  id: string;
  fromUserId: string;
  fromUserName: string;
  projectName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CooperationPreferences {
  projectCategories: string[];
  investmentRange: [number, number];
  timeCommitment: 'weekend' | 'parttime' | 'any';
  preferRoles: string[];
  minCreditScore: number;
}
