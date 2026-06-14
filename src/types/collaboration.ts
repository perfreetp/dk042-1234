export interface Collaboration {
  id: string;
  projectId: string;
  projectTitle: string;
  members: Collaborator[];
  todos: TodoItem[];
  expenses: ExpenseItem[];
  profitSharing: ProfitSharing[];
  progress: ProgressUpdate[];
  disputes: Dispute[];
  status: 'active' | 'completed' | 'disputed';
  createdAt: string;
}

export interface Collaborator {
  userId: string;
  userName: string;
  userAvatar: string;
  role: string;
  joinedAt: string;
}

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  paidByName: string;
  category: string;
  receipt?: string;
  note: string;
  createdAt: string;
  isVerified: boolean;
}

export interface ProfitSharing {
  id: string;
  title: string;
  totalAmount: number;
  distributions: Distribution[];
  status: 'pending' | 'confirmed' | 'paid';
  createdAt: string;
}

export interface Distribution {
  userId: string;
  userName: string;
  amount: number;
  percentage: number;
}

export interface ProgressUpdate {
  id: string;
  content: string;
  images?: string[];
  postedBy: string;
  postedByName: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  title: string;
  description: string;
  raisedBy: string;
  raisedByName: string;
  status: 'open' | 'reviewing' | 'resolved';
  resolution?: string;
  createdAt: string;
}
