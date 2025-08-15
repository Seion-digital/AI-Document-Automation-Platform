import React, { useState, useEffect, createContext, useContext, useRef } from 'react';

// Mock Data
const mockUsers = [
  { id: 1, email: 'admin@complygenius.com', password: 'admin123', role: 'Admin', name: 'Alice Chen' },
  { id: 2, email: 'officer@complygenius.com', password: 'officer123', role: 'Compliance Officer', name: 'John Doe' },
  { id: 3, email: 'reviewer@complygenius.com', password: 'reviewer123', role: 'Reviewer', name: 'Sarah Kim' },
  { id: 4, email: 'client@complygenius.com', password: 'client123', role: 'Client', name: 'Mike Brown' },
];

const industries = [
  { id: 'finance', name: 'Finance', regulations: ['AML', 'KYC', 'SEC', 'RBI'] },
  { id: 'healthcare', name: 'Healthcare', regulations: ['HIPAA', 'NABH', 'ISO 9001'] },
  { id: 'manufacturing', name: 'Manufacturing', regulations: ['ISO 14001', 'OSHA', 'Environmental'] },
  { id: 'legal', name: 'Legal', regulations: ['Contract Law', 'GDPR'] },
];

const complianceRules = {
  finance: [
    { id: 1, text: "Customer identity must be verified within 24 hours of onboarding.", category: "KYC" },
    { id: 2, text: "Suspicious transactions must be reported to authorities within 72 hours.", category: "AML" },
  ],
  healthcare: [
    { id: 3, text: "Patient data must be encrypted at rest and in transit.", category: "HIPAA" },
    { id: 4, text: "Breach notification must occur within 60 days.", category: "HIPAA" },
  ],
};

const mockDocuments = [
  { id: 1, title: 'Customer Onboarding Policy', industry: 'finance', status: 'Pending Review', score: 78, uploadedBy: 'Mike Brown', date: '2025-03-10' },
  { id: 2, title: 'Data Processing Agreement', industry: 'healthcare', status: 'Approved', score: 95, uploadedBy: 'John Doe', date: '2025-03-08' },
];

const mockTemplates = [
  { id: 1, name: 'NDA Template', industry: 'legal', placeholders: ['{{company}}', '{{party}}', '{{date}}'] },
  { id: 2, name: 'HIPAA Compliance Policy', industry: 'healthcare', placeholders: ['{{facility}}', '{{effective_date}}'] },
];

// Context
const AuthContext = createContext();

// Components
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">ComplyGenius</h1>
          <p className="text-gray-600 mt-2">AI-Powered Compliance & Document Automation</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">Demo Accounts:</p>
          <div className="text-xs text-gray-400 mt-1 space-y-1">
            <div>admin@complygenius.com / admin123</div>
            <div>officer@complygenius.com / officer123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedIndustry, setSelectedIndustry] = useState('finance');
  const [documents, setDocuments] = useState(mockDocuments);
  const [templates, setTemplates] = useState(mockTemplates);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [reviewResult, setReviewResult] = useState(null);
  const [slackWebhook, setSlackWebhook] = useState('');
  const fileInputRef = useRef(null);

  const complianceScore = Math.floor(Math.random() * 20) + 80; // 80-100%
  const pendingReviews = documents.filter(d => d.status === 'Pending Review').length;
  const upcomingDeadlines = 3;

  const handleDraftGenerate = () => {
    if (!draftTitle || !selectedIndustry) return;
    setAiLoading(true);
    setTimeout(() => {
      const template = templates.find(t => t.industry === selectedIndustry);
      setDraftContent(`# ${draftTitle}\n\nThis is an AI-generated document for ${industries.find(i => i.id === selectedIndustry).name} compliance.\n\nKey clauses from ${template?.name || 'standard template'} have been included.\n\nAuto-generated placeholder: {{company_name}}, {{effective_date}}`);
      setAiLoading(false);
    }, 2000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setAiLoading(true);
      setTimeout(() => {
        setReviewResult({
          issues: [
            { type: 'Missing Clause', text: 'Data breach notification procedure not defined', severity: 'High' },
            { type: 'Non-Compliant', text: 'Retention period exceeds 7 years (should be 5)', severity: 'Medium' }
          ],
          suggestions: [
            'Add: "All data breaches must be reported within 72 hours."',
            'Update retention policy to "Data shall be retained for 5 years maximum."'
          ],
          score: 68,
          original: 'Confidentiality Agreement\nData may be retained indefinitely...',
          revised: 'Confidentiality Agreement\nData may be retained for up to 5 years...'
        });
        setAiLoading(false);
      }, 3000);
    }
  };

  const handleExportPDF = () => {
    alert('Compliance report exported as PDF!');
  };

  const saveSlackWebhook = () => {
    if (slackWebhook) {
      alert('Slack integration enabled! You will receive compliance alerts.');
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Compliance Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700">Overall Compliance</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{complianceScore}%</p>
          <p className="text-sm text-gray-500">Across all documents</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700">Pending Reviews</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">{pendingReviews}</p>
          <p className="text-sm text-gray-500">Awaiting approval</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700">Upcoming Deadlines</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{upcomingDeadlines}</p>
          <p className="text-sm text-gray-500">Regulatory renewals</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Document Compliance Score Trend</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">📈 Chart would show historical compliance scores</p>
        </div>
      </div>
    </div>
  );

  const renderDocumentReview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">AI Document Review</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Industry</label>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {industries.map(ind => (
              <option key={ind.id} value={ind.id}>{ind.name}</option>
            ))}
          </select>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.docx,.txt"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={aiLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {aiLoading ? 'Analyzing...' : 'Upload Document for AI Review'}
          </button>
          {uploadedFile && <p className="mt-2 text-sm text-gray-600">Uploaded: {uploadedFile.name}</p>}
        </div>

        {aiLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">AI is analyzing your document...</span>
          </div>
        )}

        {reviewResult && (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800">Compliance Score: {reviewResult.score}%</h4>
              <p className="text-red-700 text-sm">Document requires revisions to meet standards.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Issues Found</h4>
              <div className="space-y-3">
                {reviewResult.issues.map((issue, i) => (
                  <div key={i} className={`p-3 rounded-lg text-sm ${
                    issue.severity === 'High' ? 'bg-red-50 text-red-800 border border-red-200' :
                    'bg-yellow-50 text-yellow-800 border border-yellow-200'
                  }`}>
                    <strong>{issue.type}</strong>: {issue.text} <span className="font-medium">({issue.severity})</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">AI Suggestions</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {reviewResult.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-800 mb-2">Original</h5>
                <textarea
                  value={reviewResult.original}
                  readOnly
                  className="w-full h-40 p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                />
              </div>
              <div>
                <h5 className="font-medium text-gray-800 mb-2">Revised (AI Suggested)</h5>
                <textarea
                  value={reviewResult.revised}
                  readOnly
                  className="w-full h-40 p-3 border border-green-300 rounded-lg bg-green-50 font-mono text-sm text-green-800"
                />
              </div>
            </div>

            <button
              onClick={handleExportPDF}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Export Compliance Report (PDF)
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderAIDrafting = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">AI Document Drafting</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Title</label>
            <input
              type="text"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="e.g., Data Processing Agreement"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {industries.map(ind => (
                <option key={ind.id} value={ind.id}>{ind.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleDraftGenerate}
            disabled={!draftTitle || aiLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
          >
            {aiLoading ? 'Generating...' : 'Generate Draft with AI'}
          </button>

          {aiLoading && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-gray-600">AI is drafting your document...</span>
            </div>
          )}

          {draftContent && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Draft Content</label>
                <button
                  onClick={handleExportPDF}
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                >
                  Export as PDF
                </button>
              </div>
              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAdminPanel = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Compliance Rules</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {complianceRules[selectedIndustry]?.map(rule => (
              <div key={rule.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="text-sm font-medium text-blue-700">{rule.category}</div>
                <div className="text-sm text-gray-800 mt-1">{rule.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Templates</h3>
          <div className="space-y-3">
            {templates.map(template => (
              <div key={template.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="font-medium text-gray-800">{template.name}</div>
                <div className="text-sm text-gray-500">{template.industry}</div>
                <div className="text-xs text-gray-400 mt-1">Placeholders: {template.placeholders.join(', ')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Integrations</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Slack Notifications</h3>
        <p className="text-gray-600 mb-4">Receive alerts when compliance deadlines are approaching or documents need review.</p>
        <div className="flex space-x-4">
          <input
            type="text"
            value={slackWebhook}
            onChange={(e) => setSlackWebhook(e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={saveSlackWebhook}
            disabled={!slackWebhook}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
          >
            Connect
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Get your webhook from Slack > Settings > Integrations</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'review': return renderDocumentReview();
      case 'draft': return renderAIDrafting();
      case 'admin': return user.role === 'Admin' ? renderAdminPanel() : <div className="text-red-600">Access denied. Admin only.</div>;
      case 'integrations': return renderIntegrations();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">ComplyGenius</h1>
              <span className="ml-4 text-sm text-gray-500">AI Compliance Platform</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Hello, {user.name}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{user.role}</span>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm p-4 space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: 'Layout' },
                { id: 'review', label: 'Document Review', icon: 'FileSearch' },
                { id: 'draft', label: 'AI Drafting', icon: 'FilePlus' },
                { id: 'admin', label: 'Admin Panel', icon: 'Settings', adminOnly: true },
                { id: 'integrations', label: 'Integrations', icon: 'Zap' },
              ].map(item => {
                if (item.adminOnly && user.role !== 'Admin') return null;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition ${
                      activeTab === item.id ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                        item.icon === 'Layout' ? 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' :
                        item.icon === 'FileSearch' ? 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' :
                        item.icon === 'FilePlus' ? 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' :
                        item.icon === 'Settings' ? 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' :
                        'M13 10V3L4 14h7v7l9-11h-7z'
                      } />
                    </svg>
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

// App
const App = () => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={login} />;
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      <Dashboard />
    </AuthContext.Provider>
  );
};

export default App;
