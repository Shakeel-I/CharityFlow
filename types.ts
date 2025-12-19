
export enum SMTStatus {
  CONSIDERATION = 'For consideration',
  MANAGERS_MEETING = "For Managers' meeting",
  PROGRESS_APP = 'In progress/go ahead - Application in progress',
  PROGRESS_AWAITING = 'In progress/go ahead - awaiting application outcome',
  PROGRESS_SUITABLE = 'In progress/go ahead - Suitable to apply',
  RETURN_LATER = 'Return to this another time',
  NOT_PROCEEDING = 'Not proceeding',
  UNSUCCESSFUL = 'Applied - unsuccessful',
  SUCCESSFUL = 'Applied - Successful'
}

export interface TenderSite {
  id: string;
  name: string;
  login: string;
  password?: string;
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
  dateForFunding: string; // ISO Date for sorting/calendar
  prepMonth: string;      // Display field e.g. "Nov 2025"
  deadlineMonth: string;  // Display field e.g. "Jan 2026"
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
