
export enum AuditStatus {
  PLANNED = 'Planejado',
  IN_PROGRESS = 'Em Andamento',
  COMPLETED = 'Executado',
  PARTIALLY_EXECUTED = 'Parcialmente Executado',
  NOT_EXECUTED = 'Não Executado',
  CANCELLED = 'Cancelado'
}

export type NegotiationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// --- Multi-Tenancy Types ---
export interface Company {
  id: string;
  name: string;
  cnpj?: string;
  createdAt: string;
}

// --- Compliance Types ---
export interface ComplianceRule {
  id: string;
  companyId: string; // Linked to Company
  description: string;
}

export interface Attachment {
  name: string;
  url: string; // Base64 string
  type: string;
  size: number;
}

export interface Audit {
  id: string;
  companyId: string; // Linked to Company
  title: string;
  department: string;
  costCenter: string;
  date: string; // ISO Date YYYY-MM-DD (Data de Referência)
  status: AuditStatus;
  plannedBudget: number;
  executedBudget: number;
  isRecurring?: boolean; // New field: Indicates if this is an annual/recurring budget item
  
  // Negotiation specific fields
  initialQuote: number; // Valor Original
  finalPrice: number;   // Valor Negociado
  negotiationStatus: NegotiationStatus;
  negotiationNotes: string;
  savingAmount: number;

  // Compliance specific fields
  complianceRating?: number; // 1-5 stars
  complianceChecklist?: { ruleId: string; checked: boolean }[];

  // Files
  attachments?: Attachment[];

  // Audit Trail
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

export interface InsightResponse {
  summary: string;
  topSaving: string;
  recommendation: string;
}

export type UserRole = 'ADMIN' | 'PLANNER' | 'EXECUTOR' | 'DEMO';
export type UserStatus = 'PENDING' | 'APPROVED' | 'BLOCKED';

export interface User {
  id: string;
  companyId: string; // Linked to Company
  name: string;
  role: UserRole;
  avatar: string;
  password?: string;
  status: UserStatus; // Control access
  mustChangePassword?: boolean; // Forces password reset on next login
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface PurchaseRequest {
  id: string;
  companyId: string; // Linked to Company
  item: string;
  amount: number;
  department: string;
  costCenter: string;
  requesterId: string;
  requesterName: string;
  date: string;
  status: RequestStatus;
  justification: string;
  
  // Audit Trail
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

export interface Department {
  id: string;
  companyId: string; // Linked to Company
  name: string;
}

export interface CostCenter {
  id: string;
  companyId: string; // Linked to Company
  code: string;
  name: string;
  departmentId: string;
}

export type NotifyFn = (message: string, type?: 'success' | 'error' | 'info') => void;

// --- Matricial Types ---

export type MatrixStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface MonthlyValue {
  month: number; // 0-11
  planned: number;
  executed: number;
}

export interface MatrixItem {
  id: string;
  companyId: string; // Linked to Company
  description: string;
  quantity: number;
  unitValue: number;
  category: string; // Can be linked to Cost Center
  year: number; // Reference Year
  isRecurring?: boolean; // New field
  monthlyData: MonthlyValue[]; // Always 12 items
  status: MatrixStatus;

  // Audit Trail
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

// --- Partner Types ---
export interface PartnerSegment {
  id: string;
  companyId: string; // Linked to Company
  name: string;
}

export interface Partner {
  id: string;
  companyId: string; // Linked to Company
  name: string;
  segmentId: string; // Link to PartnerSegment
  contactPerson: string;
  contactEmail: string;
  notes?: string;

  // Audit Trail
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

export interface PartnerContract {
  id: string;
  companyId: string; // Linked to Company
  partnerId: string; // Link to Partner
  description: string; // Ex: "Contrato de Manutenção de Software"
  startDate: string; // ISO Date YYYY-MM-DD
  endDate: string; // ISO Date YYYY-MM-DD
  value: number;
  itemsPurchased: string; // Ex: "Licenças anuais, Suporte 24/7"
  
  // Files
  attachments?: Attachment[]; // New field for contract files

  // Audit Trail
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

// --- History/Audit Log Types ---
export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'APPROVE' | 'REJECT' | 'BLOCK';

export interface HistoryLog {
  id: string;
  companyId: string; // Linked to Company
  timestamp: string; // ISO Date String
  userId: string;
  userName: string;
  userAvatar: string;
  action: ActionType;
  target: string; // Ex: "Auditoria: Licenças"
  details: string; // Ex: "Alterou orçamento de 500 para 600"
  itemId?: string; // Optional: Link to specific item ID for per-item history
}

export type ViewState = 'DASHBOARD' | 'PLANNING' | 'NEGOTIATIONS' | 'REQUESTS' | 'SETTINGS' | 'MATRICIAL' | 'TRANSPARENCY' | 'PARTNERS';

// --- IndexedDB & Encryption Types ---
export interface CryptoKeyJson {
  alg: string;
  ext: boolean;
  k: string;
  key_ops: string[];
  kty: string;
}

export interface EncryptedData {
  iv: string; // Initialization Vector
  encryptedString: string;
}

export interface AppData {
  companies: Company[]; // New field
  users: User[];
  audits: Audit[];
  departments: Department[];
  costCenters: CostCenter[];
  requests: PurchaseRequest[];
  matrixItems: MatrixItem[];
  complianceRules: ComplianceRule[];
  partnerSegments: PartnerSegment[];
  partners: Partner[];
  partnerContracts: PartnerContract[];
  historyLogs: HistoryLog[]; 
}
