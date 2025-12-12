import React, { useState } from 'react';
import { FundingGrant, StrategyItem } from '../types';
import { generateExecutiveReport } from '../services/geminiService';
import { Card } from '../components/ui/Card';
import { Sparkles, Loader2, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIReportsProps {
  funding: FundingGrant[];
  strategy: StrategyItem[];
}

export const AIReports: React.FC<AIReportsProps> = ({ funding, strategy }) => {
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateExecutiveReport(funding, strategy);
    setReport(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-900">AI Strategy Consultant</h2>
        <p className="text-slate-500 max-w-xl mx-auto">
          Generate an executive summary and strategic insights based on your current funding pipeline and strategy development items using Gemini.
        </p>
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all disabled:opacity-70 disabled:hover:scale-100"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {loading ? 'Analyzing Data...' : 'Generate Executive Report'}
        </button>
      </div>

      {report && (
        <Card className="animate-fade-in bg-white border border-indigo-100 shadow-xl">
          <div className="p-8 prose prose-slate max-w-none">
            <ReactMarkdown
               components={{
                 h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-indigo-900 border-b border-indigo-100 pb-2 mb-4" {...props} />,
                 h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-slate-800 mt-6 mb-3" {...props} />,
                 li: ({node, ...props}) => <li className="my-1" {...props} />,
                 strong: ({node, ...props}) => <strong className="font-semibold text-indigo-700" {...props} />
               }}
            >
              {report}
            </ReactMarkdown>
          </div>
          <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
             <button className="text-slate-500 hover:text-slate-800 text-sm flex items-center gap-2" onClick={() => window.print()}>
                <Download size={16} /> Print / Save PDF
             </button>
          </div>
        </Card>
      )}
    </div>
  );
};
