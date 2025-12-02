
import React, { useState, useEffect, Suspense } from 'react';
import { Sidebar } from './components/Sidebar';
// Lazy load large components
// Note: We use .then(module => ({ default: module.ComponentName })) because the components use named exports.
const Dashboard = React.lazy(() => import('./components/Dashboard').then(module => ({ default: module.Dashboard })));
const PlanningWorkflow = React.lazy(() => import('./components/PlanningWorkflow').then(module => ({ default: module.PlanningWorkflow })));
const NegotiationWorkflow = React.lazy(() => import('./components/NegotiationWorkflow').then(module => ({ default: module.NegotiationWorkflow })));
const RequestsWorkflow = React.lazy(() => import('./components/RequestsWorkflow').then(module => ({ default: module.RequestsWorkflow })));
const MatrixWorkflow = React.lazy(() => import('./components/MatrixWorkflow').then(module => ({ default: module.MatrixWorkflow })));
const TransparencyPortal = React.lazy(() => import('./components/TransparencyPortal').then(module => ({ default: module.TransparencyPortal })));
const Settings = React.lazy(() => import('./components/Settings').then(module => ({ default: module.Settings })));
const PartnersWorkflow = React.lazy(() => import('./components/PartnersWorkflow').then(module => ({ default: module.PartnersWorkflow })));

import { Login } from './components/Login';
import { ToastContainer, notify } from './components/Toast';
import { ConfirmationModal } from './components/ConfirmationModal';
import { AIChatAssistant } from './components/AIChatAssistant'; // Import Chat
import { loadAllData, saveAllData } from './services/indexedDbService';
import { hashPassword } from './services/authService'; 
import { Audit, ViewState, User, Department, CostCenter, PurchaseRequest, MatrixItem, ComplianceRule, AppData, PartnerSegment, Partner, PartnerContract, HistoryLog, ActionType, Company } from './types';
import { 
  MOCK_AUDITS, MOCK_USERS, MOCK_DEPARTMENTS, MOCK_COST_CENTERS, MOCK_REQUESTS, MOCK_COMPLIANCE_RULES, MOCK_MATRIX_ITEMS,
  MOCK_PARTNER_SEGMENTS, MOCK_PARTNERS, MOCK_PARTNER_CONTRACTS, MOCK_HISTORY, MOCK_COMPANIES
} from './constants';
import { Loader2 } from 'lucide-react';


function App() {
  // Global Data State
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  
  const [audits, setAudits] = useState<Audit[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [matrixItems, setMatrixItems] = useState<MatrixItem[]>([]);
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([]);
  const [partnerSegments, setPartnerSegments] = useState<PartnerSegment[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnerContracts, setPartnerContracts] = useState<PartnerContract[]>([]);
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([]);

  const [isLoadingApp, setIsLoadingApp] = useState(true);

  // --- Confirmation Modal State ---
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const [confirmModalOnConfirm, setConfirmModalOnConfirm] = useState<(() => void) | null>(null);

  const showConfirmModal = (message: string, onConfirm: () => void) => {
    setConfirmModalMessage(message);
    setConfirmModalOnConfirm(() => onConfirm); 
    setIsConfirmModalOpen(true);
  };

  const hideConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setConfirmModalMessage('');
    setConfirmModalOnConfirm(null);
  };

  // --- Action Logging Function ---
  const logAction = (action: ActionType, target: string, details: string, itemId?: string) => {
    if (!currentUser) return;
    
    const newLog: HistoryLog = {
        id: `h${Date.now()}`,
        companyId: currentUser.companyId,
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        action,
        target,
        details,
        itemId // Link log to specific item
    };
    
    setHistoryLogs(prev => [newLog, ...prev]);
  };

  // --- Initial Data Load (from IndexedDB) ---
  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log("[App] Starting data initialization from IndexedDB...");
        const data = await loadAllData();
        if (data) {
          console.log("[App] Data loaded successfully from IndexedDB.");
          setCompanies(data.companies);
          setUsers(data.users);
          setAudits(data.audits);
          setDepartments(data.departments);
          setCostCenters(data.costCenters);
          setRequests(data.requests);
          setMatrixItems(data.matrixItems);
          setComplianceRules(data.complianceRules);
          setPartnerSegments(data.partnerSegments);
          setPartners(data.partners);
          setPartnerContracts(data.partnerContracts);
          setHistoryLogs(data.historyLogs || MOCK_HISTORY);
        } else {
          console.log("[App] No data found in IndexedDB, populating with mock data and saving.");
          
          const hashedMockUsers = await Promise.all(MOCK_USERS.map(async (u) => ({
            ...u,
            password: await hashPassword(u.password || '123')
          })));

          const initialData: AppData = {
            companies: MOCK_COMPANIES,
            users: hashedMockUsers,
            audits: MOCK_AUDITS,
            departments: MOCK_DEPARTMENTS,
            costCenters: MOCK_COST_CENTERS,
            requests: MOCK_REQUESTS,
            matrixItems: MOCK_MATRIX_ITEMS,
            complianceRules: MOCK_COMPLIANCE_RULES,
            partnerSegments: MOCK_PARTNER_SEGMENTS,
            partners: MOCK_PARTNERS,
            partnerContracts: MOCK_PARTNER_CONTRACTS,
            historyLogs: MOCK_HISTORY,
          };
          await saveAllData(initialData);
          setCompanies(initialData.companies);
          setUsers(initialData.users);
          setAudits(initialData.audits);
          setDepartments(initialData.departments);
          setCostCenters(initialData.costCenters);
          setRequests(initialData.requests);
          setMatrixItems(initialData.matrixItems);
          setComplianceRules(initialData.complianceRules);
          setPartnerSegments(initialData.partnerSegments);
          setPartners(initialData.partners);
          setPartnerContracts(initialData.partnerContracts);
          setHistoryLogs(initialData.historyLogs);
          console.log("[App] Mock data populated and saved to IndexedDB.");
        }
      } catch (error) {
        console.error("[App] Error loading data from IndexedDB, falling back to mocks:", error);
        setCompanies(MOCK_COMPANIES);
        setUsers(MOCK_USERS);
        setAudits(MOCK_AUDITS);
        setDepartments(MOCK_DEPARTMENTS);
        setCostCenters(MOCK_COST_CENTERS);
        setRequests(MOCK_REQUESTS);
        setMatrixItems(MOCK_MATRIX_ITEMS);
        setComplianceRules(MOCK_COMPLIANCE_RULES);
        setPartnerSegments(MOCK_PARTNER_SEGMENTS);
        setPartners(MOCK_PARTNERS);
        setPartnerContracts(MOCK_PARTNER_CONTRACTS);
        setHistoryLogs(MOCK_HISTORY);
        notify("Falha ao carregar dados. Usando dados padrão.", "error");
      } finally {
        setIsLoadingApp(false);
        console.log("[App] Data initialization complete, app is no longer loading.");
      }
    };

    initializeData();
  }, []);

  // --- Save to IndexedDB whenever important state changes ---
  useEffect(() => {
    if (!isLoadingApp) { 
      console.log("[App] State changed, attempting to save data to IndexedDB.");
      const dataToSave: AppData = {
        companies,
        users,
        audits,
        departments,
        costCenters,
        requests,
        matrixItems,
        complianceRules,
        partnerSegments,
        partners,
        partnerContracts,
        historyLogs,
      };
      saveAllData(dataToSave).catch(error => {
        console.error("[App] Error saving data automatically to IndexedDB:", error);
        notify("Erro ao salvar dados automaticamente.", "error");
      });
    }
  }, [companies, users, audits, departments, costCenters, requests, matrixItems, complianceRules, partnerSegments, partners, partnerContracts, historyLogs, isLoadingApp]);

  // --- FILTERED DATA HELPERS ---
  // These helpers ensure the current user only sees data from their company
  const getCurrentCompanyId = () => currentUser?.companyId || '';

  const getFilteredData = <T extends { companyId: string }>(data: T[]): T[] => {
    return data.filter(item => item.companyId === getCurrentCompanyId());
  };

  // --- HANDLERS ---
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('DASHBOARD');
    
    const companyName = companies.find(c => c.id === user.companyId)?.name || 'Empresa';
    notify(`Bem-vindo, ${user.name.split(' ')[0]}! (${companyName})`, 'success');
    
    // Log Login
    setHistoryLogs(prev => [{
        id: `h${Date.now()}`,
        companyId: user.companyId,
        timestamp: new Date().toISOString(),
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        action: 'LOGIN',
        target: 'Sistema',
        details: 'Usuário realizou login na plataforma'
    }, ...prev]);
  };

  const handleUpdateUserPassword = (userId: string, newPasswordHash: string) => {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, password: newPasswordHash, mustChangePassword: false } : u));
  };

  const handleRegister = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    notify('Usuário criado com sucesso!', 'success');
  };

  const handleDeleteUser = (userId: string) => {
    console.log(`[App] Deleting user with ID: ${userId}`);
    const userToDelete = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    notify('Usuário removido.', 'info');
    
    if (currentUser) {
       logAction('DELETE', `Usuário: ${userToDelete?.name || 'Desconhecido'}`, 'Administrador removeu usuário do sistema', userId);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    notify('Sessão encerrada.', 'info');
  };

  if (isLoadingApp) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="flex items-center gap-4 text-white">
          <Loader2 className="animate-spin h-8 w-8 text-emerald-400" />
          <span className="text-xl font-semibold">Carregando plataforma...</span>
        </div>
      </div>
    );
  }

  // --- Render Login View ---
  if (!currentUser) {
    return (
      <>
        <ToastContainer />
        <Login 
          users={users} 
          companies={companies}
          onLogin={handleLogin} 
          onRegister={handleRegister} 
          onDeleteUser={handleDeleteUser}
          onUpdateUserPassword={handleUpdateUserPassword}
          notify={notify}
          showConfirmModal={showConfirmModal}
        />
        <AIChatAssistant />
        {/* Modal needed for delete user flow in login */}
        {isConfirmModalOpen && (
            <ConfirmationModal
            message={confirmModalMessage}
            onConfirm={() => {
                if (confirmModalOnConfirm) {
                confirmModalOnConfirm();
                }
                hideConfirmModal();
            }}
            onCancel={hideConfirmModal}
            />
        )}
      </>
    );
  }

  // --- Filtered Data for Components (Main App) ---
  const filteredAudits = getFilteredData(audits);
  const filteredDepartments = getFilteredData(departments);
  const filteredCostCenters = getFilteredData(costCenters);
  const filteredRequests = getFilteredData(requests);
  const filteredMatrixItems = getFilteredData(matrixItems);
  const filteredComplianceRules = getFilteredData(complianceRules);
  const filteredPartnerSegments = getFilteredData(partnerSegments);
  const filteredPartners = getFilteredData(partners);
  const filteredPartnerContracts = getFilteredData(partnerContracts);
  const filteredHistoryLogs = getFilteredData(historyLogs);
  const filteredUsers = getFilteredData(users);

  // Wrappers for state setters to preserve other companies' data
  const updateAudits = (newAudits: Audit[] | ((prev: Audit[]) => Audit[])) => {
      setAudits(prev => {
          const others = prev.filter(item => item.companyId !== getCurrentCompanyId());
          const current = typeof newAudits === 'function' ? newAudits(getFilteredData(prev)) : newAudits;
          return [...others, ...current];
      });
  };
  const updateDepartments = (newDepts: Department[] | ((prev: Department[]) => Department[])) => {
      setDepartments(prev => {
          const others = prev.filter(item => item.companyId !== getCurrentCompanyId());
          const current = typeof newDepts === 'function' ? newDepts(getFilteredData(prev)) : newDepts;
          return [...others, ...current];
      });
  };
  const updateCostCenters = (newCCs: CostCenter[] | ((prev: CostCenter[]) => CostCenter[])) => {
      setCostCenters(prev => {
          const others = prev.filter(item => item.companyId !== getCurrentCompanyId());
          const current = typeof newCCs === 'function' ? newCCs(getFilteredData(prev)) : newCCs;
          return [...others, ...current];
      });
  };
  const updateRequests = (newReqs: PurchaseRequest[] | ((prev: PurchaseRequest[]) => PurchaseRequest[])) => {
      setRequests(prev => {
          const others = prev.filter(item => item.companyId !== getCurrentCompanyId());
          const current = typeof newReqs === 'function' ? newReqs(getFilteredData(prev)) : newReqs;
          return [...others, ...current];
      });
  };
  const updateMatrixItems = (newItems: MatrixItem[] | ((prev: MatrixItem[]) => MatrixItem[])) => {
      setMatrixItems(prev => {
          const others = prev.filter(item => item.companyId !== getCurrentCompanyId());
          const current = typeof newItems === 'function' ? newItems(getFilteredData(prev)) : newItems;
          return [...others, ...current];
      });
  };
  const updateComplianceRules = (newRules: ComplianceRule[] | ((prev: ComplianceRule[]) => ComplianceRule[])) => {
      setComplianceRules(prev => {
          const others = prev.filter(item => item.companyId !== getCurrentCompanyId());
          const current = typeof newRules === 'function' ? newRules(getFilteredData(prev)) : newRules;
          return [...others, ...current];
      });
  };
  const updatePartnerSegments = (newSegs: PartnerSegment[] | ((prev: PartnerSegment[]) => PartnerSegment[])) => {
      setPartnerSegments(prev => {
          const others = prev.filter(item => item.companyId !== getCurrentCompanyId());
          const current = typeof newSegs === 'function' ? newSegs(getFilteredData(prev)) : newSegs;
          return [...others, ...current];
      });
  };
  const updatePartners = (newPartners: Partner[] | ((prev: Partner[]) => Partner[])) => {
      setPartners(prev => {
          const others = prev.filter(item => item.companyId !== getCurrentCompanyId());
          const current = typeof newPartners === 'function' ? newPartners(getFilteredData(prev)) : newPartners;
          return [...others, ...current];
      });
  };
  const updatePartnerContracts = (newContracts: PartnerContract[] | ((prev: PartnerContract[]) => PartnerContract[])) => {
      setPartnerContracts(prev => {
          const others = prev.filter(item => item.companyId !== getCurrentCompanyId());
          const current = typeof newContracts === 'function' ? newContracts(getFilteredData(prev)) : newContracts;
          return [...others, ...current];
      });
  };

  const currentCompanyName = companies.find(c => c.id === currentUser?.companyId)?.name;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      <ToastContainer />
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        user={currentUser}
        companyName={currentCompanyName}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 p-8 overflow-y-auto h-screen custom-scrollbar relative z-0">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400">
              <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mb-2" />
              <span className="text-sm font-medium">Carregando módulo...</span>
            </div>
          }>
            {currentView === 'DASHBOARD' && (
              <Dashboard 
                audits={filteredAudits} 
                isLoadingApp={isLoadingApp} 
                user={currentUser} 
                historyLogs={filteredHistoryLogs}
                onNavigate={setCurrentView}
              />
            )}

            {currentView === 'TRANSPARENCY' && (
              <TransparencyPortal 
                audits={filteredAudits}
                requests={filteredRequests}
                users={filteredUsers}
                complianceRules={filteredComplianceRules}
                partners={filteredPartners}
                isLoadingApp={isLoadingApp}
                user={currentUser}
                historyLogs={filteredHistoryLogs}
                onNavigate={setCurrentView}
              />
            )}

            {currentView === 'PLANNING' && (
              <PlanningWorkflow 
                user={currentUser}
                audits={filteredAudits} 
                setAudits={updateAudits}
                departments={filteredDepartments}
                costCenters={filteredCostCenters}
                notify={notify}
                showConfirmModal={showConfirmModal}
                logAction={logAction} 
                historyLogs={filteredHistoryLogs} 
              />
            )}

            {currentView === 'NEGOTIATIONS' && (
              <NegotiationWorkflow 
                user={currentUser}
                audits={filteredAudits} 
                setAudits={updateAudits}
                departments={filteredDepartments}
                costCenters={filteredCostCenters}
                complianceRules={filteredComplianceRules}
                notify={notify}
                showConfirmModal={showConfirmModal}
                logAction={logAction} 
                historyLogs={filteredHistoryLogs} 
              />
            )}

            {currentView === 'MATRICIAL' && (
              <MatrixWorkflow 
                user={currentUser}
                matrixItems={filteredMatrixItems}
                setMatrixItems={updateMatrixItems}
                costCenters={filteredCostCenters}
                notify={notify}
                showConfirmModal={showConfirmModal}
                logAction={logAction}
                historyLogs={filteredHistoryLogs} 
              />
            )}

            {currentView === 'REQUESTS' && (
              <RequestsWorkflow 
                user={currentUser}
                requests={filteredRequests}
                setRequests={updateRequests}
                departments={filteredDepartments}
                costCenters={filteredCostCenters}
                notify={notify}
                logAction={logAction}
                historyLogs={filteredHistoryLogs} 
              />
            )}

            {currentView === 'PARTNERS' && (
              <PartnersWorkflow
                user={currentUser}
                partners={filteredPartners}
                setPartners={updatePartners}
                partnerSegments={filteredPartnerSegments}
                partnerContracts={filteredPartnerContracts}
                setPartnerContracts={updatePartnerContracts}
                notify={notify}
                showConfirmModal={showConfirmModal}
                logAction={logAction}
                historyLogs={filteredHistoryLogs} 
              />
            )}

            {currentView === 'SETTINGS' && (
              <Settings 
                departments={filteredDepartments}
                setDepartments={updateDepartments}
                costCenters={filteredCostCenters}
                setCostCenters={updateCostCenters}
                complianceRules={filteredComplianceRules}
                setComplianceRules={updateComplianceRules}
                partnerSegments={filteredPartnerSegments}
                setPartnerSegments={updatePartnerSegments}
                
                // For users/companies management
                users={users} 
                setUsers={setUsers} 
                companies={companies}
                setCompanies={setCompanies}

                currentUser={currentUser}
                userRole={currentUser.role} 
                notify={notify}
                showConfirmModal={showConfirmModal}
                logAction={logAction}
                historyLogs={filteredHistoryLogs} 
              />
            )}
          </Suspense>
        </div>
      </main>

      {/* AI Chat Assistant (Global) */}
      <AIChatAssistant />

      {/* Confirmation Modal (Global) */}
      {isConfirmModalOpen && (
        <ConfirmationModal
          message={confirmModalMessage}
          onConfirm={() => {
            if (confirmModalOnConfirm) {
              confirmModalOnConfirm();
            }
            hideConfirmModal();
          }}
          onCancel={hideConfirmModal}
        />
      )}
    </div>
  );
}

export default App;
