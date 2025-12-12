import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ViewType, FundingGrant, TenderSite, PhilanthropicSite, StrategyItem, SMTStatus } from './types';
import { Dashboard } from './views/Dashboard';
import { FundingManager } from './views/FundingManager';
import { TenderView, PhilanthropyView, StrategyView } from './views/ResourceManager';
import { AIReports } from './views/AIReports';

// Dummy Initial Data to populate the app for first-time viewing
const INITIAL_FUNDING: FundingGrant[] = [
    { id: '1', funder: 'Gates Foundation', fundName: 'Global Health Initiative', isSmallFund: false, smtStatus: SMTStatus.APPROVED, assignedTo: 'Sarah Jenkins', relevantWCAProject: 'Water Access', details: 'Large scale implementation', amount: 500000, dateForFunding: '2024-11-15', deliveryDates: '2025-2027', action: 'Draft Proposal', website: 'https://gatesfoundation.org', createdAt: '2024-01-01' },
    { id: '2', funder: 'Community Trust', fundName: 'Local Impact Grant', isSmallFund: true, smtStatus: SMTStatus.PENDING, assignedTo: 'Mike Ross', relevantWCAProject: 'Youth Education', details: 'Tablets for schools', amount: 25000, dateForFunding: '2024-06-30', deliveryDates: 'Q4 2024', action: 'Review budget', website: '', createdAt: '2024-02-15' },
    { id: '3', funder: 'Tech For Good', fundName: 'Innovation Award', isSmallFund: false, smtStatus: SMTStatus.NEEDS_INFO, assignedTo: 'Sarah Jenkins', relevantWCAProject: 'Digital Transformation', details: 'App development', amount: 120000, dateForFunding: '2024-08-01', deliveryDates: '2025', action: 'Contact officer', website: '', createdAt: '2024-03-10' }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  // State
  const [fundingData, setFundingData] = useState<FundingGrant[]>(() => {
    const saved = localStorage.getItem('cf_funding');
    return saved ? JSON.parse(saved) : INITIAL_FUNDING;
  });

  const [tenders, setTenders] = useState<TenderSite[]>(() => {
    const saved = localStorage.getItem('cf_tenders');
    return saved ? JSON.parse(saved) : [];
  });

  const [philanthropy, setPhilanthropy] = useState<PhilanthropicSite[]>(() => {
    const saved = localStorage.getItem('cf_philanthropy');
    return saved ? JSON.parse(saved) : [];
  });

  const [strategy, setStrategy] = useState<StrategyItem[]>(() => {
    const saved = localStorage.getItem('cf_strategy');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence Effects
  useEffect(() => localStorage.setItem('cf_funding', JSON.stringify(fundingData)), [fundingData]);
  useEffect(() => localStorage.setItem('cf_tenders', JSON.stringify(tenders)), [tenders]);
  useEffect(() => localStorage.setItem('cf_philanthropy', JSON.stringify(philanthropy)), [philanthropy]);
  useEffect(() => localStorage.setItem('cf_strategy', JSON.stringify(strategy)), [strategy]);

  // Handlers
  const handleSaveFunding = (item: FundingGrant) => {
    setFundingData(prev => {
        const index = prev.findIndex(i => i.id === item.id);
        if (index >= 0) {
            const newArr = [...prev];
            newArr[index] = item;
            return newArr;
        }
        return [...prev, item];
    });
  };

  const deleteFunding = (id: string) => setFundingData(prev => prev.filter(i => i.id !== id));
  
  const saveTender = (item: TenderSite) => setTenders(prev => [...prev, item]);
  const deleteTender = (id: string) => setTenders(prev => prev.filter(i => i.id !== id));

  const savePhilanthropy = (item: PhilanthropicSite) => setPhilanthropy(prev => [...prev, item]);
  const deletePhilanthropy = (id: string) => setPhilanthropy(prev => prev.filter(i => i.id !== id));

  const saveStrategy = (item: StrategyItem) => setStrategy(prev => [...prev, item]);
  const deleteStrategy = (id: string) => setStrategy(prev => prev.filter(i => i.id !== id));

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {currentView === 'dashboard' && <Dashboard funding={fundingData} />}
      {currentView === 'funding' && (
        <FundingManager 
            data={fundingData} 
            onSave={handleSaveFunding} 
            onDelete={deleteFunding} 
        />
      )}
      {currentView === 'tenders' && (
        <TenderView data={tenders} onSave={saveTender} onDelete={deleteTender} />
      )}
      {currentView === 'philanthropy' && (
        <PhilanthropyView data={philanthropy} onSave={savePhilanthropy} onDelete={deletePhilanthropy} />
      )}
      {currentView === 'strategy' && (
        <StrategyView data={strategy} onSave={saveStrategy} onDelete={deleteStrategy} />
      )}
      {currentView === 'reports' && (
        <AIReports funding={fundingData} strategy={strategy} />
      )}
    </Layout>
  );
};

export default App;
