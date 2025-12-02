
import { Audit, AuditStatus, User, Department, CostCenter, PurchaseRequest, ComplianceRule, MatrixItem, PartnerSegment, Partner, PartnerContract, HistoryLog, Company } from './types';

export const MOCK_COMPANIES: Company[] = [
  { id: 'c1', name: 'Empresa Principal', createdAt: new Date().toISOString() },
  { id: 'c2', name: 'Filial Secundária', createdAt: new Date().toISOString() }
];

export const MOCK_USERS: User[] = [
  {
    id: 'u0', // Explicit Admin
    companyId: 'c1',
    name: 'Admin System',
    role: 'ADMIN',
    avatar: 'AD',
    password: 'Adm123',
    status: 'APPROVED',
    mustChangePassword: false
  },
  {
    id: 'u1',
    companyId: 'c1',
    name: 'Carlos Demo', 
    role: 'DEMO', 
    avatar: 'CD',
    password: '123',
    status: 'APPROVED',
    mustChangePassword: false
  },
  {
    id: 'u2',
    companyId: 'c1',
    name: 'Ana Planejamento',
    role: 'PLANNER',
    avatar: 'AP',
    password: '123',
    status: 'APPROVED',
    mustChangePassword: false
  },
  {
    id: 'u3',
    companyId: 'c1',
    name: 'Roberto Compras',
    role: 'EXECUTOR',
    avatar: 'RC',
    password: '123',
    status: 'APPROVED',
    mustChangePassword: false
  }
];

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'd1', companyId: 'c1', name: 'Tecnologia' },
  { id: 'd2', companyId: 'c1', name: 'Recursos Humanos' },
  { id: 'd3', companyId: 'c1', name: 'Logística' },
  { id: 'd4', companyId: 'c1', name: 'Marketing' },
  { id: 'd5', companyId: 'c1', name: 'Facilities' }
];

export const MOCK_COST_CENTERS: CostCenter[] = [
  { id: 'cc1', companyId: 'c1', code: 'CC-TI-01', name: 'Infraestrutura', departmentId: 'd1' },
  { id: 'cc2', companyId: 'c1', code: 'CC-TI-02', name: 'Software', departmentId: 'd1' },
  { id: 'cc3', companyId: 'c1', code: 'CC-RH-01', name: 'Treinamento', departmentId: 'd2' },
  { id: 'cc4', companyId: 'c1', code: 'CC-LOG-05', name: 'Frota', departmentId: 'd3' },
  { id: 'cc5', companyId: 'c1', code: 'CC-MKT-03', name: 'Publicidade', departmentId: 'd4' },
  { id: 'cc6', companyId: 'c1', code: 'CC-ADM-01', name: 'Escritório', departmentId: 'd5' },
];

export const MOCK_REQUESTS: PurchaseRequest[] = [
  {
    id: 'r1',
    companyId: 'c1',
    item: 'Notebooks Dell Latitude',
    amount: 15000,
    department: 'Tecnologia',
    costCenter: 'CC-TI-01',
    requesterId: 'u3',
    requesterName: 'Roberto Compras',
    date: '2024-03-20',
    status: 'PENDING',
    justification: 'Renovação de equipamentos da equipe de dev.'
  },
  {
    id: 'r2',
    companyId: 'c1',
    item: 'Licença Adobe CC',
    amount: 4500,
    department: 'Marketing',
    costCenter: 'CC-MKT-03',
    requesterId: 'u2',
    requesterName: 'Ana Planejamento',
    date: '2024-03-18',
    status: 'APPROVED',
    justification: 'Equipe de design.'
  }
];

export const MOCK_COMPLIANCE_RULES: ComplianceRule[] = [
  { id: 'rule1', companyId: 'c1', description: '3 Cotações de Fornecedores Diferentes' },
  { id: 'rule2', companyId: 'c1', description: 'Regularidade Fiscal do Fornecedor Verificada' },
  { id: 'rule3', companyId: 'c1', description: 'Contrato de Prestação de Serviços Anexado' },
  { id: 'rule4', companyId: 'c1', description: 'Aprovação da Diretoria Registrada' },
  { id: 'rule5', companyId: 'c1', description: 'Impacto Orçamentário Analisado' }
];


const today = new Date();
const currentMonthStr = today.toISOString().slice(0, 7); // YYYY-MM
const currentYear = today.getFullYear();
const lastYearMonthStr = new Date(today.getFullYear() - 1, today.getMonth()).toISOString().slice(0, 7);

export const MOCK_AUDITS: Audit[] = [
  {
    id: '1',
    companyId: 'c1',
    title: 'Licenças Software Microsoft',
    department: 'Tecnologia',
    costCenter: 'CC-TI-02',
    date: `${currentMonthStr}-15`,
    isRecurring: true, 
    status: AuditStatus.COMPLETED,
    plannedBudget: 50000,
    executedBudget: 42000,
    initialQuote: 52000,
    finalPrice: 42000,
    negotiationStatus: 'APPROVED',
    negotiationNotes: 'Renegociação de licenças em volume obteve bom desconto.',
    savingAmount: 10000,
    complianceRating: 5,
    complianceChecklist: [
      { ruleId: 'rule1', checked: true },
      { ruleId: 'rule2', checked: true },
      { ruleId: 'rule3', checked: true },
      { ruleId: 'rule4', checked: true },
      { ruleId: 'rule5', checked: true },
    ]
  },
  {
    id: '2',
    companyId: 'c1',
    title: 'Renovação Frota 2024',
    department: 'Logística',
    costCenter: 'CC-LOG-05',
    date: `${currentMonthStr}-10`,
    isRecurring: false,
    status: AuditStatus.COMPLETED,
    plannedBudget: 25000,
    executedBudget: 24500,
    initialQuote: 26000,
    finalPrice: 24500,
    negotiationStatus: 'APPROVED',
    negotiationNotes: 'Concessionária cobriu oferta da concorrente.',
    savingAmount: 1500,
    complianceRating: 4,
    complianceChecklist: [
      { ruleId: 'rule1', checked: true },
      { ruleId: 'rule2', checked: true },
      { ruleId: 'rule4', checked: true },
      { ruleId: 'rule5', checked: true },
    ]
  },
  {
    id: '3',
    companyId: 'c1',
    title: 'Consultoria Externa RH',
    department: 'Recursos Humanos',
    costCenter: 'CC-RH-01',
    date: '2023-12-10',
    isRecurring: false,
    status: AuditStatus.PARTIALLY_EXECUTED,
    plannedBudget: 15000,
    executedBudget: 5000,
    initialQuote: 15000,
    finalPrice: 5000,
    negotiationStatus: 'PENDING',
    negotiationNotes: 'Consultoria contratada parcialmente.',
    savingAmount: 10000,
    complianceRating: 3,
    complianceChecklist: [
      { ruleId: 'rule1', checked: true },
      { ruleId: 'rule3', checked: false },
    ]
  },
  {
    id: '4',
    companyId: 'c1',
    title: 'Câmeras de Segurança',
    department: 'Facilities',
    costCenter: 'CC-ADM-01', 
    date: '2024-01-20',
    isRecurring: false,
    status: AuditStatus.PLANNED,
    plannedBudget: 30000,
    executedBudget: 0,
    initialQuote: 32000,
    finalPrice: 0,
    negotiationStatus: 'PENDING',
    negotiationNotes: '',
    savingAmount: 0,
    complianceRating: undefined,
    complianceChecklist: []
  },
  {
    id: '5',
    companyId: 'c1',
    title: 'Campanha Verão',
    department: 'Marketing',
    costCenter: 'CC-MKT-03',
    date: '2024-02-15',
    isRecurring: false,
    status: AuditStatus.COMPLETED,
    plannedBudget: 120000,
    executedBudget: 105000,
    initialQuote: 130000,
    finalPrice: 105000,
    negotiationStatus: 'APPROVED',
    negotiationNotes: 'Redução de escopo da agência parceira.',
    savingAmount: 25000,
    complianceRating: 5,
    complianceChecklist: [
      { ruleId: 'rule1', checked: true },
      { ruleId: 'rule2', checked: true },
      { ruleId: 'rule3', checked: true },
      { ruleId: 'rule4', checked: true },
      { ruleId: 'rule5', checked: true },
    ]
  },
   {
    id: '6',
    companyId: 'c1',
    title: 'Manutenção Servidores (Antigo)',
    department: 'Tecnologia',
    costCenter: 'CC-TI-01',
    date: `${lastYearMonthStr}-05`, // Last year
    isRecurring: true,
    status: AuditStatus.COMPLETED,
    plannedBudget: 20000,
    executedBudget: 19000,
    initialQuote: 21000,
    finalPrice: 19000,
    negotiationStatus: 'APPROVED',
    negotiationNotes: 'Contrato antigo, bom desconto.',
    savingAmount: 2000,
    complianceRating: 4,
    complianceChecklist: [
      { ruleId: 'rule1', checked: true },
      { ruleId: 'rule2', checked: true },
    ]
  }
];

export const MOCK_MATRIX_ITEMS: MatrixItem[] = [
  {
    id: 'mx1',
    companyId: 'c1',
    description: 'Material de Escritório',
    quantity: 10,
    unitValue: 50,
    category: 'CC-ADM-01',
    year: currentYear,
    isRecurring: true,
    monthlyData: Array.from({ length: 12 }, (_, i) => ({
      month: i,
      planned: 500, // 10 * 50
      executed: i === today.getMonth() ? 480 : (i < today.getMonth() ? 510 : 0)
    })),
    status: 'APPROVED',
  },
  {
    id: 'mx2',
    companyId: 'c1',
    description: 'Assinaturas de Software SAAS',
    quantity: 1,
    unitValue: 2000,
    category: 'CC-TI-02',
    year: currentYear,
    isRecurring: true,
    monthlyData: Array.from({ length: 12 }, (_, i) => ({
      month: i,
      planned: 2000,
      executed: i === today.getMonth() ? 1950 : (i < today.getMonth() ? 2000 : 0)
    })),
    status: 'PENDING',
  },
  {
    id: 'mx3',
    companyId: 'c1',
    description: 'Serviços de Limpeza',
    quantity: 1,
    unitValue: 1200,
    category: 'CC-ADM-01',
    year: currentYear,
    isRecurring: true,
    monthlyData: Array.from({ length: 12 }, (_, i) => ({
      month: i,
      planned: 1200,
      executed: i === today.getMonth() ? 1250 : (i < today.getMonth() ? 1180 : 0)
    })),
    status: 'APPROVED',
  },
];


// --- Mocks for Partners Module ---
export const MOCK_PARTNER_SEGMENTS: PartnerSegment[] = [
  { id: 'ps1', companyId: 'c1', name: 'Tecnologia & Software' },
  { id: 'ps2', companyId: 'c1', name: 'Consultoria' },
  { id: 'ps3', companyId: 'c1', name: 'Suprimentos & Escritório' },
  { id: 'ps4', companyId: 'c1', name: 'Serviços Gerais' },
];

// NOTE: Using timestamp-like IDs for logic compatibility, but static for mocks
const now = Date.now();
export const MOCK_PARTNERS: Partner[] = [
  {
    id: `p${now - 10000000}`, // Older
    companyId: 'c1',
    name: 'Tech Solutions S.A.',
    segmentId: 'ps1',
    contactPerson: 'João Silva',
    contactEmail: 'joao.silva@techsol.com',
    notes: 'Principal fornecedor de licenças e infraestrutura de TI.'
  },
  {
    id: `p${now - 5000000}`, // Older
    companyId: 'c1',
    name: 'Consultoria Estratégica LTDA',
    segmentId: 'ps2',
    contactPerson: 'Mariana Costa',
    contactEmail: 'mariana.costa@consultoria.com',
    notes: 'Parceiro em projetos de RH e Planejamento Estratégico.'
  },
  {
    id: `p${now}`, // Current (New)
    companyId: 'c1',
    name: 'Office Supplies Distribuidora',
    segmentId: 'ps3',
    contactPerson: 'Carlos Oliveira',
    contactEmail: 'carlos.olivera@officesupplies.com',
    notes: 'Fornecedor de materiais de escritório e limpeza.'
  },
  {
    id: `p${now + 100}`, // Current (New)
    companyId: 'c1',
    name: 'Novo Fornecedor Exemplo',
    segmentId: 'ps4',
    contactPerson: 'Teste',
    contactEmail: 'teste@exemplo.com',
    notes: 'Criado este ano para teste de métricas.'
  }
];

export const MOCK_PARTNER_CONTRACTS: PartnerContract[] = [
  {
    id: 'pc1',
    companyId: 'c1',
    partnerId: `p${now - 10000000}`, // Match first mock partner
    description: 'Licenças anuais de software corporativo',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    value: 50000,
    itemsPurchased: 'MS Office 365, Azure Credits',
    attachments: []
  },
  {
    id: 'pc2',
    companyId: 'c1',
    partnerId: `p${now - 10000000}`,
    description: 'Manutenção de Servidores Cloud',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    value: 20000,
    itemsPurchased: 'Suporte técnico 24/7, Monitoramento',
    attachments: []
  },
  {
    id: 'pc3',
    companyId: 'c1',
    partnerId: `p${now - 5000000}`, // Match second mock partner
    description: 'Projeto de reestruturação organizacional',
    startDate: '2024-04-15',
    endDate: '2024-07-15',
    value: 35000,
    itemsPurchased: 'Workshops, Diagnóstico, Plano de ação',
    attachments: []
  }
];

export const MOCK_HISTORY: HistoryLog[] = [
  {
    id: 'h1',
    companyId: 'c1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    userId: 'u2',
    userName: 'Ana Planejamento',
    userAvatar: 'AP',
    action: 'CREATE',
    target: 'Planejamento: Campanha Marketing',
    details: 'Criou novo registro de planejamento orçamentário'
  },
  {
    id: 'h2',
    companyId: 'c1',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    userId: 'u3',
    userName: 'Roberto Compras',
    userAvatar: 'RC',
    action: 'UPDATE',
    target: 'Negociação: Licenças Software',
    details: 'Atualizou valor negociado para R$ 42.000'
  },
  {
    id: 'h3',
    companyId: 'c1',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    userId: 'u1',
    userName: 'Carlos Demo',
    userAvatar: 'CD',
    action: 'DELETE',
    target: 'Parceiro: Fornecedor Antigo',
    details: 'Removeu parceiro e contratos vinculados'
  }
];
