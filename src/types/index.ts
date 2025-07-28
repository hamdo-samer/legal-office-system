// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  LAWYER = 'LAWYER',
  EMPLOYEE = 'EMPLOYEE',
  CLIENT = 'CLIENT'
}

// Lawyer Types
export interface Lawyer {
  id: string;
  userId: string;
  licenseNo: string;
  specialties: string[];
  experience?: number;
  bio?: string;
  avatar?: string;
  user: User;
}

// Client Types
export interface Client {
  id: string;
  userId: string;
  nationalId?: string;
  address?: string;
  dateOfBirth?: Date;
  user: User;
}

// Case Types
export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  description?: string;
  caseType: CaseType;
  status: CaseStatus;
  court?: string;
  opponent?: string;
  startDate: Date;
  endDate?: Date;
  lawyerId: string;
  clientId: string;
  lawyer: Lawyer;
  client: Client;
  sessions: Session[];
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export enum CaseType {
  CIVIL = 'CIVIL',
  CRIMINAL = 'CRIMINAL',
  COMMERCIAL = 'COMMERCIAL',
  FAMILY = 'FAMILY',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  LABOR = 'LABOR',
  OTHER = 'OTHER'
}

export enum CaseStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  SUSPENDED = 'SUSPENDED',
  APPEALED = 'APPEALED'
}

// Session Types
export interface Session {
  id: string;
  caseId: string;
  sessionDate: Date;
  sessionTime?: string;
  court?: string;
  notes?: string;
  outcome?: string;
  nextDate?: Date;
  case: Case;
  createdAt: Date;
  updatedAt: Date;
}

// Document Types
export interface Document {
  id: string;
  caseId?: string;
  contractId?: string;
  title: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  uploadedAt: Date;
}

// Appointment Types
export interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  location?: string;
  notes?: string;
  lawyerId: string;
  clientId?: string;
  lawyer: Lawyer;
  client?: Client;
  createdAt: Date;
  updatedAt: Date;
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED'
}

// Contract Types
export interface Contract {
  id: string;
  title: string;
  description?: string;
  contractType: ContractType;
  status: ContractStatus;
  startDate?: Date;
  endDate?: Date;
  amount?: number;
  terms?: string;
  lawyerId: string;
  clientId: string;
  lawyer: Lawyer;
  client: Client;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ContractType {
  POWER_OF_ATTORNEY = 'POWER_OF_ATTORNEY',
  LEGAL_CONSULTATION = 'LEGAL_CONSULTATION',
  REPRESENTATION = 'REPRESENTATION',
  OTHER = 'OTHER'
}

export enum ContractStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  TERMINATED = 'TERMINATED'
}

// Invoice Types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  title: string;
  description?: string;
  amount: number;
  taxAmount?: number;
  totalAmount: number;
  dueDate: Date;
  status: InvoiceStatus;
  clientId: string;
  client: Client;
  payments: Payment[];
  createdAt: Date;
  updatedAt: Date;
}

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

// Payment Types
export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  notes?: string;
  invoice: Invoice;
  createdAt: Date;
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  CHECK = 'CHECK',
  OTHER = 'OTHER'
}

// AI Assistant Types
export interface AIAnalysis {
  id: string;
  caseId?: string;
  query: string;
  response: string;
  analysisType: string;
  createdAt: Date;
}

export interface LegalTemplate {
  id: string;
  name: string;
  description?: string;
  templateType: string;
  content: string;
  variables: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  role: UserRole;
}

export interface CaseForm {
  title: string;
  description?: string;
  caseType: CaseType;
  court?: string;
  opponent?: string;
  clientId: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalCases: number;
  activeCases: number;
  totalClients: number;
  upcomingAppointments: number;
  monthlyRevenue: number;
  recentCases: Case[];
  upcomingAppointmentsList: Appointment[];
}
