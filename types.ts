export enum SMTStatus {
  PENDING = 'Pending Review',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  NEEDS_INFO = 'Needs More Info'
}

export interface TenderSite {
  id: string;
  name: string;
  login: string;
  password?: string; // Optional/Encrypted in real app
}

export interface PhilanthropicSite {
  id: string;
  dateAdded: string;
  organisation: string;
  website: string;
  notes: string;
}

export interface FundingGrant {
  id: string;
  funder: string;
  fundName: string;
  isSmallFund: boolean;
  smtStatus: SMTStatus;
  assignedTo: string;
  relevantWCAProject: string;
  details: string;
  amount: number;
  dateForFunding: string; // Deadline
  deliveryDates: string;
  action: string;
  website: string;
  createdAt: string;
}

export interface StrategyItem {
  id: string;
  fund: string;
  details: string;
  comments: string;
  furtherInfo: string;
}

export type ViewType = 'dashboard' | 'tenders' | 'philanthropy' | 'funding' | 'summary' | 'deadlines' | 'strategy' | 'notes';
