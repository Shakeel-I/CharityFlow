
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ViewType, FundingGrant, TenderSite, PhilanthropicSite, StrategyItem, SMTStatus } from './types';
import { Dashboard } from './views/Dashboard';
import { FundingManager } from './views/FundingManager';
import { TenderView, PhilanthropyView, StrategyView } from './views/ResourceManager';
import { AIReports } from './views/AIReports';
import { Deadlines } from './views/Deadlines';
import { NotesDump } from './views/NotesDump';

const PROJECTS = [
  "Bigger picture and community champions", "Community Champions", "Corporate relationships", 
  "CYP trauma", "ESOL and CYP", "ESOL project", "ESOL project or SYP trauma", "Autism", 
  "Black Men Cancer Trauma project", "Community Voice", "Core funding", 
  "Core funding or CYP/Refugee project", "CYP", "CYP or community champions", "CYP project", 
  "Drug and alcohol & mental health", "ESOL", "ESOL refugee project", "Neighbourhoods"
];

const STATUSES = Object.values(SMTStatus);

const generateDummyFunding = (): FundingGrant[] => {
  const data: FundingGrant[] = [];
  const funders = [
    "BBC Children in Need", "National Lottery", "Lloyds Bank Foundation", 
    "Paul Hamlyn Foundation", "Esmee Fairbairn", "Comic Relief", 
    "Tudor Trust", "Garfield Weston", "Henry Smith Charity", 
    "Clothworkers Foundation", "Sobell Foundation", "Rayne Foundation"
  ];
  
  const count = 80;
  let totalAllocated = 0;

  for (let i = 0; i < count; i++) {
    const monthOffset = i % 18; 
    const prepDate = new Date(2025, 8 + monthOffset, 1);
    const deadlineDate = new Date(2025, 10 + monthOffset, 1);
    
    const prepMonthStr = prepDate.toLocaleString('en-GB', { month: 'short', year: 'numeric' });
    const deadlineMonthStr = deadlineDate.toLocaleString('en-GB', { month: 'short', year: 'numeric' });

    const amount = i < 10 ? 10000 : (i < 30 ? 4000 : (i < 60 ? 1500 : 500));
    totalAllocated += amount;

    const statusIndex = (i * 7 + Math.floor(i / 3)) % STATUSES.length;

    data.push({
      id: `grant-${i}`,
      funder: `${funders[i % funders.length]} ${Math.floor(i / funders.length) + 1}`,
      fundName: `Grant Scheme ${i + 1}`,
      isSmallFund: i % 4 === 0,
      smtStatus: STATUSES[statusIndex],
      assignedTo: i % 3 === 0 ? 'Sarah Jenkins' : 'Mike Ross',
      relevantWCAProject: PROJECTS[i % PROJECTS.length],
      details: 'Neural assessment of regional growth and infrastructure.',
      amount: amount,
      dateForFunding: deadlineDate.toISOString().split('T')[0],
      prepMonth: prepMonthStr,
      deadlineMonth: deadlineMonthStr,
      deliveryDates: '2026-2027',
      action: i % 2 === 0 ? 'Verification Phase' : 'Data Integrity Check',
      website: 'https://example.org',
      createdAt: new Date().toISOString()
    });
  }
  
  return data;
};

const generateDummyTenders = (): TenderSite[] => [
  { id: 't1', name: 'Find a Tender (UK Gov)', login: 'wandcare_admin' },
  { id: 't2', name: 'Contracts Finder', login: 'info@wandcare.org' },
  { id: 't3', name: 'ProContract / Due North', login: 'wca_bid_team' },
  { id: 't4', name: 'CompeteFor', login: 'wandcare_manager' },
  { id: 't5', name: 'Supplying the South West', login: 'finance_wca' },
];

const generateDummyPhilanthropy = (): PhilanthropicSite[] => {
  const orgs = [
    { name: "Citi Foundation", site: "https://www.citigroup.com/global/foundation", note: "Focus on economic progress in underserved communities." },
    { name: "Charles Hayward Foundation", site: "http://www.charleshaywardfoundation.org.uk/", note: "Interested in Social & Environmental causes." },
    { name: "The Henry Smith Charity", site: "https://www.henrysmithcharity.org.uk/", note: "Large grants for social well-being." },
    { name: "Garfield Weston Foundation", site: "https://garfieldweston.org/", note: "Supports wide range of UK charities." },
    { name: "The Clothworkers Foundation", site: "https://www.clothworkersfoundation.org.uk/", note: "Capital grants for charities." },
    { name: "The Tudor Trust", site: "https://tudortrust.org.uk/", note: "Focus on community-led groups." },
    { name: "Esmee Fairbairn Foundation", site: "https://esmeefairbairn.org.uk/", note: "Environmental and social justice focus." },
    { name: "The Wolfson Foundation", site: "https://www.wolfson.org.uk/", note: "Focus on education and science." },
    { name: "Jerwood Foundation", site: "https://jerwood.org/", note: "Focus on arts and young artists." },
    { name: "The Baring Foundation", site: "https://baringfoundation.org.uk/", note: "Strengthening civil society." },
  ];

  return orgs.map((o, i) => ({
    id: `phil-${i}`,
    dateAdded: new Date(2025, 0, 10 + i).toISOString(),
    organisation: o.name,
    website: o.site,
    notes: o.note
  }));
};

const INITIAL_FUNDING = generateDummyFunding();
const INITIAL_TENDERS = generateDummyTenders();
const INITIAL_PHILANTHROPY = generateDummyPhilanthropy();

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const [fundingData, setFundingData] = useState<FundingGrant[]>(() => {
    const saved = localStorage.getItem('cf_funding');
    return saved ? JSON.parse(saved) : INITIAL_FUNDING;
  });

  const [tenders, setTenders] = useState<TenderSite[]>(() => {
    const saved = localStorage.getItem('cf_tenders');
    return saved ? JSON.parse(saved) : INITIAL_TENDERS;
  });

  const [philanthropy, setPhilanthropy] = useState<PhilanthropicSite[]>(() => {
    const saved = localStorage.getItem('cf_philanthropy');
    return saved ? JSON.parse(saved) : INITIAL_PHILANTHROPY;
  });

  const [strategy, setStrategy] = useState<StrategyItem[]>(() => {
    const saved = localStorage.getItem('cf_strategy');
    return saved ? JSON.parse(saved) : [];
  });

  const [notes, setNotes] = useState<string>(() => {
    return localStorage.getItem('cf_notes') || '';
  });

  useEffect(() => localStorage.setItem('cf_funding', JSON.stringify(fundingData)), [fundingData]);
  useEffect(() => localStorage.setItem('cf_tenders', JSON.stringify(tenders)), [tenders]);
  useEffect(() => localStorage.setItem('cf_philanthropy', JSON.stringify(philanthropy)), [philanthropy]);
  useEffect(() => localStorage.setItem('cf_strategy', JSON.stringify(strategy)), [strategy]);
  useEffect(() => localStorage.setItem('cf_notes', notes), [notes]);

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
            tenders={tenders}
            philanthropy={philanthropy}
            strategy={strategy}
            notes={notes}
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
      {currentView === 'summary' && (
        <AIReports funding={fundingData} strategy={strategy} />
      )}
      {currentView === 'deadlines' && (
        <Deadlines data={fundingData} />
      )}
      {currentView === 'notes' && (
        <NotesDump notes={notes} onChange={setNotes} />
      )}
    </Layout>
  );
};

export default App;
