import React, { useState, useEffect, createContext, useContext } from 'react';
import { FileUp, FileDown, Search, Bell, Settings, User, LogOut, ChevronDown, ChevronRight, CheckCircle, XCircle, AlertTriangle, FileText, PlusCircle, Trash2, Edit, SlidersHorizontal, Bot, Sparkles, BarChart2, FolderKanban, FileClock, ShieldCheck } from 'lucide-react';

// Mock Data
const mockUser = {
  name: 'Priya Sharma',
  role: 'Admin', // Can be 'Admin', 'Compliance Officer', 'Reviewer', 'Client'
  email: 'priya.sharma@lexiscomply.ai',
  avatar: `https://placehold.co/100x100/E2E8F0/4A5568?text=PS`,
};

const mockDashboardData = {
  complianceScore: 88,
  pendingReviews: 5,
  upcomingDeadlines: 3,
  documents: [
    { id: 1, name: 'Q3 Financial Report.docx', status: 'Compliant', score: 95, lastReview: '2024-08-14' },
    { id: 2, name: 'AML Policy Update.pdf', status: 'Pending Review', score: 72, lastReview: '2024-08-12' },
    { id: 3, name: 'Vendor Agreement - TechCorp.docx', status: 'High Risk', score: 45, lastReview: '2024-08-11' },
    { id: 4, name: 'HIPAA Compliance Guide.pdf', status: 'Compliant', score: 100, lastReview: '2024-08-10' },
    { id: 5, name: 'New Employee Contracts.docx', status: 'Pending Review', score: 80, lastReview: '2024-08-15' },
  ],
  complianceTrend: [65, 70, 78, 75, 82, 88],
};

const mockTemplates = [
    { id: 1, name: 'AML & KYC Policy', industry: 'Finance', category: 'Financial Reporting', version: '2.1', lastUpdated: '2024-07-20' },
    { id: 2, name: 'HIPAA Business Associate Agreement', industry: 'Healthcare', category: 'Data Privacy', version: '1.5', lastUpdated: '2024-06-15' },
    { id: 3, name: 'OSHA Safety Standards', industry: 'Manufacturing', category: 'Environmental', version: '3.0', lastUpdated: '2024-08-01' },
    { id: 4, name: 'GDPR Data Processing Agreement', industry: 'Tech', category: 'Data Privacy', version: '1.8', lastUpdated: '2024-07-28' },
];

const mockComplianceIssues = [
    { id: 1, type: 'Non-Compliant Clause', severity: 'High', clause: 'Section 4.2: Data Retention', suggestion: 'Update data retention period to 7 years as per RBI regulations.', risk: 'Violation may lead to fines up to 2% of annual turnover.' },
    { id: 2, type: 'Missing Clause', severity: 'Medium', clause: 'Customer Identification Program (CIP)', suggestion: 'Insert a standard CIP clause outlining identity verification procedures.', risk: 'Incomplete KYC process, potential for fraudulent accounts.' },
    { id: 3, type: 'Vague Language', severity: 'Low', clause: 'Section 8.1: Confidentiality', suggestion: 'Replace "reasonable measures" with specific encryption standards (e.g., "AES-256 encryption").', risk: 'Potential for legal disputes over interpretation of "reasonable".' },
];

// App Context for state management
const AppContext = createContext();

// Main App Component
export default function App() {
  const [page, setPage] = useState('dashboard'); // 'dashboard', 'review', 'draft', 'templates', 'reports', 'settings'
  const [user, setUser] = useState(mockUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = (pageName) => {
    setPage(pageName);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const AppProvider = ({ children }) => (
    <AppContext.Provider value={{ page, navigate, user, isLoading, setIsLoading }}>
      {children}
    </AppContext.Provider>
  );

  return (
    <AppProvider>
      <div className="bg-gray-50 font-sans text-gray-800 min-h-screen flex">
        <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <div className="flex-1 flex flex-col lg:ml-64">
          <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <PageContent />
          </main>
        </div>
      </div>
    </AppProvider>
  );
}

// Sidebar Navigation
const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { page, navigate, user } = useContext(AppContext);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2, roles: ['Admin', 'Compliance Officer', 'Reviewer', 'Client'] },
    { id: 'review', label: 'Document Review', icon: ShieldCheck, roles: ['Admin', 'Compliance Officer', 'Reviewer'] },
    { id: 'draft', label: 'AI Document Drafting', icon: Bot, roles: ['Admin', 'Compliance Officer'] },
    { id: 'templates', label: 'Rules & Templates', icon: FolderKanban, roles: ['Admin'] },
    { id: 'reports', label: 'Reporting', icon: FileDown, roles: ['Admin', 'Compliance Officer'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['Admin', 'Compliance Officer', 'Reviewer', 'Client'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

  const navContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center space-x-3 border-b border-gray-200">
        <Sparkles className="text-indigo-500 h-8 w-8" />
        <span className="text-2xl font-bold text-gray-800">LexisComply</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavItems.map(item => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => { e.preventDefault(); navigate(item.id); }}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
              page === item.id
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </a>
        ))}
      </nav>
      <div className="px-4 py-6 border-t border-gray-200">
        <div className="p-4 bg-gray-100 rounded-lg text-center">
            <h4 className="font-semibold text-sm text-gray-800">Upgrade to Pro</h4>
            <p className="text-xs text-gray-500 mt-1">Unlock advanced features and unlimited document analysis.</p>
            <button className="mt-3 w-full bg-indigo-500 text-white text-xs font-semibold py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors">
                Upgrade Now
            </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity lg:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {navContent}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-white border-r border-gray-200">
        {navContent}
      </aside>
    </>
  );
};

// Header Component
const Header = ({ setIsMobileMenuOpen }) => {
  const { user } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 z-10">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-800">
            <SlidersHorizontal className="h-6 w-6" />
        </button>
        <div className="flex-1 flex justify-center lg:justify-start">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents, rules, or reports..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors">
            <Bell className="h-6 w-6" />
          </button>
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
              <img src={user.avatar} alt="User Avatar" className="h-9 w-9 rounded-full border-2 border-white shadow-sm" />
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                <span className="text-xs text-gray-500">{user.role}</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-20">
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <User className="h-4 w-4 mr-2" /> Profile
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings className="h-4 w-4 mr-2" /> Settings
                </a>
                <div className="border-t border-gray-100 my-1"></div>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Dynamically render page content
const PageContent = () => {
  const { page } = useContext(AppContext);
  switch (page) {
    case 'dashboard': return <DashboardPage />;
    case 'review': return <DocumentReviewPage />;
    case 'draft': return <DocumentDraftingPage />;
    case 'templates': return <TemplatesPage />;
    case 'reports': return <ReportsPage />;
    case 'settings': return <SettingsPage />;
    default: return <DashboardPage />;
  }
};

// --- PAGES ---

// Dashboard Page
const DashboardPage = () => {
  const { user } = useContext(AppContext);
  const data = mockDashboardData;

  const getStatusChip = (status) => {
    switch (status) {
      case 'Compliant': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1"/>{status}</span>;
      case 'Pending Review': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><FileClock className="h-3 w-3 mr-1"/>{status}</span>;
      case 'High Risk': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1"/>{status}</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name.split(' ')[0]}!</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">Overall Compliance Score</p>
                <p className="text-4xl font-bold text-indigo-600">{data.complianceScore}%</p>
            </div>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center bg-indigo-100`}>
                <div style={{background: `conic-gradient(#4f46e5 ${data.complianceScore * 3.6}deg, #e0e7ff 0deg)`}} className="w-16 h-16 rounded-full flex items-center justify-center bg-white">
                    <span className="text-lg font-bold text-indigo-600">{data.complianceScore}</span>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Pending Reviews</p>
            <p className="text-4xl font-bold text-gray-800">{data.pendingReviews}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Upcoming Deadlines</p>
            <p className="text-4xl font-bold text-gray-800">{data.upcomingDeadlines}</p>
        </div>
      </div>
      
      {/* Recent Documents */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Documents</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Document Name</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Score</th>
                <th scope="col" className="px-6 py-3">Last Review</th>
              </tr>
            </thead>
            <tbody>
              {data.documents.map(doc => (
                <tr key={doc.id} className="bg-white border-b hover:bg-gray-50">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-400" /> {doc.name}
                  </th>
                  <td className="px-6 py-4">{getStatusChip(doc.status)}</td>
                  <td className="px-6 py-4 font-semibold">{doc.score}%</td>
                  <td className="px-6 py-4">{doc.lastReview}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Document Review Page
const DocumentReviewPage = () => {
    const [file, setFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setAnalysisComplete(false);
        }
    };

    const handleAnalyze = () => {
        if (!file) return;
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysisComplete(true);
        }, 3000); // Simulate AI analysis time
    };

    const getSeverityIcon = (severity) => {
        switch(severity) {
            case 'High': return <AlertTriangle className="h-5 w-5 text-red-500" />;
            case 'Medium': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case 'Low': return <AlertTriangle className="h-5 w-5 text-blue-500" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">AI Document Review</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                {!analysisComplete ? (
                    <div className="flex flex-col items-center justify-center space-y-4 p-8">
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FileUp className="w-10 h-10 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">PDF, DOCX, TXT (MAX. 25MB)</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.txt" />
                            </label>
                        </div>
                        {file && <p className="text-sm text-gray-600">Selected file: <span className="font-medium">{file.name}</span></p>}
                        <button 
                            onClick={handleAnalyze} 
                            disabled={!file || isAnalyzing}
                            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                        >
                            {isAnalyzing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="h-5 w-5 mr-2" />
                                    Analyze Document
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-gray-50 p-4 rounded-lg border">
                            <h3 className="font-semibold text-lg mb-2">Document Preview</h3>
                            <div className="bg-white p-6 rounded-md h-[600px] overflow-y-auto text-sm leading-relaxed">
                                <p className="font-bold mb-2">AML Policy Update.pdf</p>
                                <p><strong>Section 4.1:</strong> Customer Due Diligence (CDD) procedures must be applied to all new customers.</p>
                                <p className="my-4 bg-red-50 border-l-4 border-red-400 p-3 rounded-r-md"><strong>Section 4.2: Data Retention:</strong> All customer records shall be maintained for a period of <span className="bg-red-200 px-1 rounded">five years</span> from the date of account closure.</p>
                                <p><strong>Section 5.1:</strong> Suspicious Activity Reports (SARs) must be filed with the relevant authorities within 30 days of detection.</p>
                                <p className="my-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-md"><em>[Missing Clause: Customer Identification Program (CIP)]</em></p>
                                <p><strong>Section 8.1: Confidentiality:</strong> The institution will take <span className="bg-blue-200 px-1 rounded">reasonable measures</span> to protect customer data.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Compliance Analysis</h3>
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <div className="flex items-start">
                                    {getSeverityIcon('High')}
                                    <div className="ml-3">
                                        <h4 className="font-semibold text-red-800">Non-Compliant Clause</h4>
                                        <p className="text-sm text-red-700 mt-1">{mockComplianceIssues[0].suggestion}</p>
                                        <p className="text-xs text-red-600 mt-2"><strong>Risk:</strong> {mockComplianceIssues[0].risk}</p>
                                    </div>
                                </div>
                            </div>
                             <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                <div className="flex items-start">
                                    {getSeverityIcon('Medium')}
                                    <div className="ml-3">
                                        <h4 className="font-semibold text-yellow-800">Missing Clause</h4>
                                        <p className="text-sm text-yellow-700 mt-1">{mockComplianceIssues[1].suggestion}</p>
                                        <p className="text-xs text-yellow-600 mt-2"><strong>Risk:</strong> {mockComplianceIssues[1].risk}</p>
                                    </div>
                                </div>
                            </div>
                             <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div className="flex items-start">
                                    {getSeverityIcon('Low')}
                                    <div className="ml-3">
                                        <h4 className="font-semibold text-blue-800">Vague Language</h4>
                                        <p className="text-sm text-blue-700 mt-1">{mockComplianceIssues[2].suggestion}</p>
                                        <p className="text-xs text-blue-600 mt-2"><strong>Risk:</strong> {mockComplianceIssues[2].risk}</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setAnalysisComplete(false)} className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Review Another Document
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


// Document Drafting Page
const DocumentDraftingPage = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [draftGenerated, setDraftGenerated] = useState(false);
    const [draftContent, setDraftContent] = useState('');

    const handleGenerateDraft = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setDraftContent(`**NON-DISCLOSURE AGREEMENT**

**1. Parties:** This Agreement is made between [Your Company Name] ("Disclosing Party") and [Recipient Name] ("Receiving Party").

**2. Confidential Information:** "Confidential Information" shall include all financial, technical, and business information disclosed by the Disclosing Party.

**3. Obligations:** The Receiving Party shall hold and maintain the Confidential Information in strict confidence for the sole and exclusive benefit of the Disclosing Party.

**4. Term:** The non-disclosure provisions of this Agreement shall survive the termination of this Agreement and the Receiving Party's duty to hold Confidential Information in confidence shall remain in effect until the Confidential Information no longer qualifies as a trade secret or until the Disclosing Party sends the Receiving Party written notice releasing the Receiving Party from this Agreement, whichever occurs first.

**5. Governing Law:** This Agreement shall be governed by and construed in accordance with the laws of the State of [Your State/Jurisdiction].
`);
            setIsGenerating(false);
            setDraftGenerated(true);
        }, 2500);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">AI Document Drafting</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4">1. Select Template</h2>
                        <select className="w-full p-2 border border-gray-300 rounded-lg">
                            {mockTemplates.map(t => <option key={t.id}>{t.name}</option>)}
                            <option>Non-Disclosure Agreement</option>
                        </select>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4">2. Define Requirements</h2>
                        <textarea 
                            className="w-full p-2 border border-gray-300 rounded-lg h-32 text-sm"
                            placeholder="e.g., 'NDA for a software development project based in California. The recipient is a freelance contractor.'"
                        ></textarea>
                    </div>
                    <button 
                        onClick={handleGenerateDraft} 
                        disabled={isGenerating}
                        className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors flex items-center justify-center"
                    >
                        {isGenerating ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating Draft...
                            </>
                        ) : (
                            <>
                                <Bot className="h-5 w-5 mr-2" />
                                Generate Compliant Draft
                            </>
                        )}
                    </button>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">Generated Document</h2>
                    {draftGenerated ? (
                        <textarea 
                            value={draftContent}
                            onChange={(e) => setDraftContent(e.target.value)}
                            className="w-full h-[500px] p-4 border border-gray-200 rounded-lg bg-gray-50 text-sm leading-relaxed"
                        />
                    ) : (
                        <div className="w-full h-[500px] flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed">
                            <FileText className="h-12 w-12 text-gray-300 mb-2"/>
                            <p className="text-gray-500">Your generated document will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Templates Page
const TemplatesPage = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Compliance Rules & Templates</h1>
                <button className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">
                    <PlusCircle className="h-5 w-5 mr-2"/>
                    New Template
                </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Template Name</th>
                                <th className="px-6 py-3">Industry</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Version</th>
                                <th className="px-6 py-3">Last Updated</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockTemplates.map(template => (
                                <tr key={template.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{template.name}</td>
                                    <td className="px-6 py-4">{template.industry}</td>
                                    <td className="px-6 py-4">{template.category}</td>
                                    <td className="px-6 py-4">{template.version}</td>
                                    <td className="px-6 py-4">{template.lastUpdated}</td>
                                    <td className="px-6 py-4 flex space-x-2">
                                        <button className="p-2 text-gray-500 hover:text-indigo-600"><Edit className="h-4 w-4"/></button>
                                        <button className="p-2 text-gray-500 hover:text-red-600"><Trash2 className="h-4 w-4"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Placeholder Pages
const ReportsPage = () => (
    <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <div className="mt-6 bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center h-96">
            <FileDown className="h-16 w-16 text-gray-300 mb-4"/>
            <h2 className="text-xl font-semibold text-gray-700">Reporting Dashboard</h2>
            <p className="text-gray-500 mt-2">Automated report generation is coming soon.</p>
        </div>
    </div>
);

const SettingsPage = () => (
    <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <div className="mt-6 bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center h-96">
            <Settings className="h-16 w-16 text-gray-300 mb-4"/>
            <h2 className="text-xl font-semibold text-gray-700">System & User Settings</h2>
            <p className="text-gray-500 mt-2">Manage your profile, notifications, and integrations here.</p>
        </div>
    </div>
);
