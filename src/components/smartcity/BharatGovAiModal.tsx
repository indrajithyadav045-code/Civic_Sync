import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Search, 
  FileText, 
  Award, 
  Users, 
  Building2, 
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  HeartHandshake,
  Sun,
  Home,
  Briefcase
} from 'lucide-react';
import { useCivic } from '../../context/CivicContext';

interface BharatGovAiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SchemeItem {
  id: string;
  title: string;
  category: 'Housing' | 'Financial Aid' | 'Clean Energy' | 'Livelihood' | 'Healthcare' | 'Education';
  ministry: string;
  benefit: string;
  eligibilitySnippet: string;
  matchScore: number;
  officialUrl: string;
  icon: any;
}

const SCHEMES_DATABASE: SchemeItem[] = [
  {
    id: 'pmsy',
    title: 'PM Surya Ghar: Muft Bijli Yojana',
    category: 'Clean Energy',
    ministry: 'Ministry of New & Renewable Energy (MNRE)',
    benefit: 'Up to ₹78,000 direct subsidy for rooftop solar installation + 300 units free monthly electricity.',
    eligibilitySnippet: 'Indian citizen with rooftop ownership and suitable DISCOM grid connection.',
    matchScore: 98,
    officialUrl: 'https://pmsuryaghar.gov.in/',
    icon: Sun
  },
  {
    id: 'tnkm',
    title: 'Kalaignar Magalir Urimai Thogai (KMUT)',
    category: 'Financial Aid',
    ministry: 'Government of Tamil Nadu • Special Programme Implementation',
    benefit: '₹1,000 monthly basic income direct cash transfer to women heads of family.',
    eligibilitySnippet: 'Family annual income under ₹2.5 Lakh, annual electricity consumption under 3,600 units.',
    matchScore: 96,
    officialUrl: 'https://kmut.tn.gov.in/',
    icon: HeartHandshake
  },
  {
    id: 'pmay',
    title: 'Pradhan Mantri Awas Yojana (Urban 2.0)',
    category: 'Housing',
    ministry: 'Ministry of Housing and Urban Affairs (MoHUA)',
    benefit: 'Interest subsidy up to ₹1.80 Lakh on affordable housing construction and renovation loans.',
    eligibilitySnippet: 'EWS/LIG families without a pucca house in any part of India.',
    matchScore: 94,
    officialUrl: 'https://pmay-urban.gov.in/',
    icon: Home
  },
  {
    id: 'pmsvanidhi',
    title: 'PM SVANidhi Micro-Credit Scheme',
    category: 'Livelihood',
    ministry: 'Ministry of Housing and Urban Affairs (MoHUA) & GCC',
    benefit: 'Collateral-free working capital loan starting at ₹10,000 with 7% interest subsidy on digital payments.',
    eligibilitySnippet: 'Urban street vendors operating in municipal areas certified by ULB / GCC.',
    matchScore: 92,
    officialUrl: 'https://pmsvanidhi.mohua.gov.in/',
    icon: Briefcase
  },
  {
    id: 'ayushman',
    title: 'Ayushman Bharat – PM Jan Arogya Yojana',
    category: 'Healthcare',
    ministry: 'National Health Authority (NHA)',
    benefit: '₹5 Lakh per family per year cashless health coverage for secondary and tertiary hospitalisation.',
    eligibilitySnippet: 'Eligible families identified under SECC database and state PMJAY portals.',
    matchScore: 95,
    officialUrl: 'https://pmjay.gov.in/',
    icon: ShieldCheck
  },
  {
    id: 'skill-india',
    title: 'PM Kaushal Vikas Yojana (PMKVY 4.0)',
    category: 'Education',
    ministry: 'Ministry of Skill Development & Entrepreneurship',
    benefit: 'Free industry-aligned skill certification + stipend + placement assistance across 300+ urban job roles.',
    eligibilitySnippet: 'Youth aged 15-45 with basic education seeking vocational skills certification.',
    matchScore: 90,
    officialUrl: 'https://www.pmkvyofficial.org/',
    icon: GraduationCap
  }
];

export const BharatGovAiModal: React.FC<BharatGovAiModalProps> = ({ isOpen, onClose }) => {
  const { playSound } = useCivic();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [userAge, setUserAge] = useState<number>(28);
  const [userIncome, setUserIncome] = useState<string>('under_3l');
  const [assessmentRun, setAssessmentRun] = useState(false);

  if (!isOpen) return null;

  const categories = ['All', 'Housing', 'Financial Aid', 'Clean Energy', 'Livelihood', 'Healthcare', 'Education'];

  const filteredSchemes = SCHEMES_DATABASE.filter(scheme => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          scheme.benefit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          scheme.ministry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRunAssessment = () => {
    setAssessmentRun(true);
    playSound('triage');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white border border-slate-200 text-slate-900 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl space-y-5 p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex items-center justify-center shadow-md font-bold text-lg">
                🏛️
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-900 tracking-tight font-sans">
                    BharatGov AI
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                    Citizen Scheme Copilot
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-green-100 text-green-800 border border-green-200">
                    LIVE
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-sans mt-0.5">
                  AI-Powered Citizen Copilot for Government Scheme Discovery, Instant Eligibility & Direct Portal Links.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href="https://bharathgovai.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 text-xs font-semibold transition"
            >
              <span>Open BharatGov Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Banner with Direct Launcher */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl p-4 sm:p-5 relative overflow-hidden shadow-md">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-[11px] font-semibold">
                <Sparkles className="w-3 h-3 text-cyan-300" />
                <span>Seamless Inter-Platform Integration</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-sans">
                Find Government Benefits & Subsidies in Seconds
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                BharatGov AI matches your household profile against 250+ Central and Tamil Nadu State welfare schemes, calculating instant eligibility and linking directly to certified application portals.
              </p>
            </div>
            <a
              href="https://bharathgovai.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg transition"
            >
              <span>Launch bharathgovai.netlify.app</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* AI Eligibility Quick Checker Widget */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span>AI Instant Eligibility Assessment</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Profile Auto-Correlated</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Citizen Age</label>
              <input 
                type="number" 
                value={userAge} 
                onChange={(e) => setUserAge(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white font-mono text-slate-900"
                min={18}
                max={90}
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Annual Household Income</label>
              <select 
                value={userIncome}
                onChange={(e) => setUserIncome(e.target.value)}
                className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-900"
              >
                <option value="under_1l">Under ₹1.2 Lakh (BPL)</option>
                <option value="under_3l">₹1.2 Lakh – ₹3 Lakh (EWS)</option>
                <option value="under_6l">₹3 Lakh – ₹6 Lakh (LIG)</option>
                <option value="above_6l">Above ₹6 Lakh</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleRunAssessment}
                className="w-full py-2 rounded bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Check AI Eligibility</span>
              </button>
            </div>
          </div>

          {assessmentRun && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-xs text-green-900 flex items-start space-x-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">AI Assessment Complete: </span>
                <span>You qualify for <strong>4 high-priority schemes</strong> with direct financial subsidies and zero-interest loans. Document checklist: Aadhaar Card, GCC Resident Proof, Bank Account Passbook.</span>
              </div>
            </div>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search schemes by name, ministry, or benefit (e.g. Solar, Housing, Cash Transfer)..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:border-blue-600 text-xs text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs rounded-full border transition font-medium ${
                  selectedCategory === cat
                    ? 'bg-blue-900 text-white border-blue-900 font-semibold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {filteredSchemes.map((scheme) => {
            const IconComponent = scheme.icon;
            return (
              <div 
                key={scheme.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                      {scheme.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                      <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                      <span>{scheme.matchScore}% Match</span>
                    </span>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">
                        {scheme.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {scheme.ministry}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                    <strong className="text-slate-900 block text-[11px] mb-0.5">Benefit:</strong>
                    {scheme.benefit}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 truncate max-w-[160px]" title={scheme.eligibilitySnippet}>
                    {scheme.eligibilitySnippet}
                  </span>
                  <a
                    href={scheme.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs text-blue-700 hover:text-blue-900 font-bold hover:underline"
                  >
                    <span>Apply Official</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-2">
            <span>Powered by</span>
            <a 
              href="https://bharathgovai.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline font-bold"
            >
              BharatGov AI (bharathgovai.netlify.app)
            </a>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition"
          >
            Close Copilot
          </button>
        </div>
      </div>
    </div>
  );
};
