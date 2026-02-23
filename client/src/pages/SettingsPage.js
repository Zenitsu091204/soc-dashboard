import React, { useState } from 'react';

// ─── Tab Config ───────────────────────────────────────────────────────────────
const TABS = ['Profile', 'Users', 'Integrations', 'Alerts', 'Dashboard'];

// ─── Reusable Components ──────────────────────────────────────────────────────

function InputField({ label, id, type = 'text', value, onChange, error, placeholder, disabled }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full bg-slate-800 border rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-slate-600 hover:border-slate-500'}`}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900
          ${checked ? 'bg-indigo-600' : 'bg-slate-600'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
            ${checked ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
}

function SectionCard({ title, description, children }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6 mb-5">
      {(title || description) && (
        <div className="mb-5">
          {title && <h3 className="text-base font-semibold text-slate-100">{title}</h3>}
          {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

function Badge({ color, text }) {
  const colors = {
    green: 'bg-emerald-500/20 text-emerald-400',
    red: 'bg-red-500/20 text-red-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    blue: 'bg-blue-500/20 text-blue-400',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[color] || colors.blue}`}>
      {text}
    </span>
  );
}

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Tab: Profile ─────────────────────────────────────────────────────────────
function ProfileTab() {
  const [form, setForm] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@soc.internal',
    role: 'SOC Analyst',
    phone: '+1 (555) 234-5678',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validateProfile = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter a valid email';
    return errs;
  };

  const validatePassword = () => {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = 'Current password is required';
    if (form.newPassword.length < 8) errs.newPassword = 'Min 8 characters';
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSaveProfile = () => {
    const errs = validateProfile();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleChangePassword = () => {
    const errs = validatePassword();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setForm({ ...form, currentPassword: '', newPassword: '', confirmPassword: '' });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div>
      {saved && (
        <div className="mb-4 px-4 py-3 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-400 text-sm">
          ✓ Changes saved successfully
        </div>
      )}

      {/* Avatar */}
      <SectionCard title="Profile Picture">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white select-none">
            {form.name.charAt(0)}
          </div>
          <div>
            <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition">
              Change Avatar
            </button>
            <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 2MB</p>
          </div>
        </div>
      </SectionCard>

      {/* Personal Info */}
      <SectionCard title="Personal Information" description="Update your account details.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Full Name" id="name" value={form.name} onChange={set('name')} error={errors.name} />
          <InputField label="Email Address" id="email" type="email" value={form.email} onChange={set('email')} error={errors.email} />
          <InputField label="Role" id="role" value={form.role} onChange={set('role')} disabled />
          <InputField label="Phone" id="phone" value={form.phone} onChange={set('phone')} placeholder="+1 (555) 000-0000" />
        </div>
        <div className="mt-5 flex justify-end">
          <button
            onClick={handleSaveProfile}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition"
          >
            Save Profile
          </button>
        </div>
      </SectionCard>

      {/* Change Password */}
      <SectionCard title="Change Password" description="Use a strong, unique password.">
        <div className="space-y-4">
          <InputField label="Current Password" id="currentPassword" type="password" value={form.currentPassword} onChange={set('currentPassword')} error={errors.currentPassword} />
          <InputField label="New Password" id="newPassword" type="password" value={form.newPassword} onChange={set('newPassword')} error={errors.newPassword} />
          <InputField label="Confirm New Password" id="confirmPassword" type="password" value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />
        </div>
        <div className="mt-5 flex justify-end">
          <button
            onClick={handleChangePassword}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition"
          >
            Update Password
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Users ───────────────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id: 1, name: 'Alex Johnson', email: 'alex.johnson@soc.internal', role: 'Analyst', status: 'Active' },
  { id: 2, name: 'Sarah Chen', email: 'sarah.chen@soc.internal', role: 'Admin', status: 'Active' },
  { id: 3, name: 'Mike Torres', email: 'mike.torres@soc.internal', role: 'Analyst', status: 'Inactive' },
  { id: 4, name: 'Priya Nair', email: 'priya.nair@soc.internal', role: 'Analyst', status: 'Active' },
];

function UsersTab() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'Analyst' });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Valid email required';
    return errs;
  };

  const handleAdd = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setUsers([...users, { id: Date.now(), ...form, status: 'Active' }]);
      setForm({ name: '', email: '', role: 'Analyst' });
      setShowModal(false);
    }
  };

  const handleDelete = () => {
    setUsers(users.filter((u) => u.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const toggleStatus = (id) => {
    setUsers(users.map((u) =>
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
    ));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-400">{users.length} users total</p>
        <button
          onClick={() => { setShowModal(true); setErrors({}); }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition flex items-center gap-2"
        >
          <span>+</span> Add User
        </button>
      </div>

      <SectionCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-slate-700">
                <th className="pb-3 text-slate-400 font-medium">Name</th>
                <th className="pb-3 text-slate-400 font-medium hidden sm:table-cell">Email</th>
                <th className="pb-3 text-slate-400 font-medium">Role</th>
                <th className="pb-3 text-slate-400 font-medium">Status</th>
                <th className="pb-3 text-slate-400 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-700/20 transition">
                  <td className="py-3 text-slate-100 font-medium">{u.name}</td>
                  <td className="py-3 text-slate-400 hidden sm:table-cell">{u.email}</td>
                  <td className="py-3">
                    <Badge color={u.role === 'Admin' ? 'blue' : 'yellow'} text={u.role} />
                  </td>
                  <td className="py-3">
                    <button onClick={() => toggleStatus(u.id)}>
                      <Badge color={u.status === 'Active' ? 'green' : 'red'} text={u.status} />
                    </button>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setDeleteTarget(u)}
                      className="text-xs text-red-400 hover:text-red-300 transition font-medium"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Add User Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New User">
        <div className="space-y-4">
          <InputField label="Full Name" id="newName" value={form.name} onChange={set('name')} error={errors.name} placeholder="John Doe" />
          <InputField label="Email" id="newEmail" type="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="john@soc.internal" />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
            <select
              value={form.role}
              onChange={set('role')}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Analyst">Analyst</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex gap-3 justify-end">
          <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition">
            Cancel
          </button>
          <button onClick={handleAdd} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition">
            Add User
          </button>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove User">
        <p className="text-slate-300 text-sm mb-6">
          Are you sure you want to remove <span className="font-semibold text-white">{deleteTarget?.name}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition">
            Cancel
          </button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition">
            Remove
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ─── Tab: Integrations ────────────────────────────────────────────────────────
const INTEGRATIONS = [
  { id: 'siem', name: 'SIEM Platform', description: 'Connect to Splunk / QRadar for event ingestion', icon: '📡', connected: true, color: 'indigo' },
  { id: 'slack', name: 'Slack Alerts', description: 'Send alert notifications to Slack channels', icon: '💬', connected: false, color: 'yellow' },
  { id: 'virustotal', name: 'VirusTotal', description: 'Enrich IOCs with VirusTotal threat intelligence', icon: '🦠', connected: true, color: 'red' },
  { id: 'misp', name: 'MISP', description: 'Pull threat feeds from MISP platform', icon: '🔗', connected: false, color: 'blue' },
];

function IntegrationsTab() {
  const [items, setItems] = useState(INTEGRATIONS);
  const [apiKey, setApiKey] = useState('');
  const [keyError, setKeyError] = useState('');
  const [configTarget, setConfigTarget] = useState(null);

  const toggle = (id) => {
    setItems(items.map((i) => i.id === id ? { ...i, connected: !i.connected } : i));
  };

  const handleSaveKey = () => {
    if (!apiKey.trim() || apiKey.length < 10) {
      setKeyError('API key must be at least 10 characters');
      return;
    }
    setKeyError('');
    setApiKey('');
    setConfigTarget(null);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {items.map((item) => (
          <div key={item.id} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-100">{item.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                </div>
              </div>
              <Badge color={item.connected ? 'green' : 'red'} text={item.connected ? 'Connected' : 'Off'} />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => toggle(item.id)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition border
                  ${item.connected
                    ? 'border-red-500/50 text-red-400 hover:bg-red-500/10'
                    : 'border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10'}`}
              >
                {item.connected ? 'Disconnect' : 'Connect'}
              </button>
              <button
                onClick={() => { setConfigTarget(item); setApiKey(''); setKeyError(''); }}
                className="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition"
              >
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Configure Modal */}
      <Modal isOpen={!!configTarget} onClose={() => setConfigTarget(null)} title={`Configure ${configTarget?.name}`}>
        <div className="space-y-4">
          <InputField
            label="API Key"
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            error={keyError}
            placeholder="Enter API key..."
          />
          <InputField label="Endpoint URL" id="endpoint" value="" onChange={() => {}} placeholder="https://api.example.com/v1" />
        </div>
        <div className="mt-6 flex gap-3 justify-end">
          <button onClick={() => setConfigTarget(null)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition">
            Cancel
          </button>
          <button onClick={handleSaveKey} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition">
            Save Configuration
          </button>
        </div>
      </Modal>
    </div>
  );
}

// ─── Tab: Alerts ──────────────────────────────────────────────────────────────
function AlertsTab() {
  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    slackAlerts: false,
    criticalOnly: false,
    autoEscalate: true,
    soundAlerts: true,
    weeklyReport: true,
  });
  const [thresholds, setThresholds] = useState({
    criticalResponse: '15',
    highResponse: '60',
    retentionDays: '90',
  });
  const [thresholdErrors, setThresholdErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const setThreshold = (field) => (e) => setThresholds({ ...thresholds, [field]: e.target.value });

  const validateThresholds = () => {
    const errs = {};
    if (!thresholds.criticalResponse || isNaN(thresholds.criticalResponse) || Number(thresholds.criticalResponse) < 1)
      errs.criticalResponse = 'Must be a positive number';
    if (!thresholds.highResponse || isNaN(thresholds.highResponse) || Number(thresholds.highResponse) < 1)
      errs.highResponse = 'Must be a positive number';
    if (!thresholds.retentionDays || isNaN(thresholds.retentionDays) || Number(thresholds.retentionDays) < 7)
      errs.retentionDays = 'Minimum 7 days';
    return errs;
  };

  const handleSave = () => {
    const errs = validateThresholds();
    setThresholdErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const togglePref = (key) => (val) => setPrefs({ ...prefs, [key]: val });

  return (
    <div>
      {saved && (
        <div className="mb-4 px-4 py-3 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-400 text-sm">
          ✓ Alert settings saved
        </div>
      )}

      <SectionCard title="Notification Channels" description="Choose how you receive alert notifications.">
        <Toggle label="Email Alerts" description="Send alerts to your registered email" checked={prefs.emailAlerts} onChange={togglePref('emailAlerts')} />
        <Toggle label="Slack Notifications" description="Push alerts to your Slack channel" checked={prefs.slackAlerts} onChange={togglePref('slackAlerts')} />
        <Toggle label="Browser Sound Alerts" description="Play a sound for new critical alerts" checked={prefs.soundAlerts} onChange={togglePref('soundAlerts')} />
      </SectionCard>

      <SectionCard title="Alert Behaviour" description="Control how alerts are processed.">
        <Toggle label="Critical Only Mode" description="Only notify for critical severity alerts" checked={prefs.criticalOnly} onChange={togglePref('criticalOnly')} />
        <Toggle label="Auto-Escalate" description="Automatically escalate unresolved alerts after SLA" checked={prefs.autoEscalate} onChange={togglePref('autoEscalate')} />
        <Toggle label="Weekly Summary Report" description="Receive a weekly email summary of all alerts" checked={prefs.weeklyReport} onChange={togglePref('weeklyReport')} />
      </SectionCard>

      <SectionCard title="Thresholds & Retention" description="Set response time SLAs and data retention policies.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField
            label="Critical SLA (mins)"
            id="criticalResponse"
            type="number"
            value={thresholds.criticalResponse}
            onChange={setThreshold('criticalResponse')}
            error={thresholdErrors.criticalResponse}
            placeholder="15"
          />
          <InputField
            label="High SLA (mins)"
            id="highResponse"
            type="number"
            value={thresholds.highResponse}
            onChange={setThreshold('highResponse')}
            error={thresholdErrors.highResponse}
            placeholder="60"
          />
          <InputField
            label="Data Retention (days)"
            id="retentionDays"
            type="number"
            value={thresholds.retentionDays}
            onChange={setThreshold('retentionDays')}
            error={thresholdErrors.retentionDays}
            placeholder="90"
          />
        </div>
        <div className="mt-5 flex justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition"
          >
            Save Alert Settings
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Dashboard ───────────────────────────────────────────────────────────
function DashboardTab() {
  const [settings, setSettings] = useState({
    autoRefresh: true,
    compactMode: false,
    showAvatars: true,
    darkCharts: true,
    stickyHeader: true,
    animationsEnabled: true,
  });
  const [layout, setLayout] = useState({
    defaultPage: 'Overview',
    refreshInterval: '30',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'UTC',
  });
  const [layoutErrors, setLayoutErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const setL = (field) => (e) => setLayout({ ...layout, [field]: e.target.value });
  const toggleSetting = (key) => (val) => setSettings({ ...settings, [key]: val });

  const validateLayout = () => {
    const errs = {};
    const ri = Number(layout.refreshInterval);
    if (!layout.refreshInterval || isNaN(ri) || ri < 10 || ri > 3600)
      errs.refreshInterval = 'Value must be 10–3600 seconds';
    return errs;
  };

  const handleSave = () => {
    const errs = validateLayout();
    setLayoutErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div>
      {saved && (
        <div className="mb-4 px-4 py-3 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-400 text-sm">
          ✓ Dashboard settings saved
        </div>
      )}

      <SectionCard title="Display Preferences" description="Customize how the dashboard looks and behaves.">
        <Toggle label="Auto-Refresh Data" description="Automatically refresh widgets on the dashboard" checked={settings.autoRefresh} onChange={toggleSetting('autoRefresh')} />
        <Toggle label="Compact Mode" description="Reduce padding and card sizes for a denser layout" checked={settings.compactMode} onChange={toggleSetting('compactMode')} />
        <Toggle label="Show User Avatars" description="Display profile avatars in comments and tables" checked={settings.showAvatars} onChange={toggleSetting('showAvatars')} />
        <Toggle label="Dark Charts" description="Use dark-themed chart backgrounds" checked={settings.darkCharts} onChange={toggleSetting('darkCharts')} />
        <Toggle label="Sticky Header" description="Keep the top navigation visible while scrolling" checked={settings.stickyHeader} onChange={toggleSetting('stickyHeader')} />
        <Toggle label="UI Animations" description="Enable smooth transitions and hover animations" checked={settings.animationsEnabled} onChange={toggleSetting('animationsEnabled')} />
      </SectionCard>

      <SectionCard title="Layout & Locale" description="Set default views, refresh rate, and time format.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Default Landing Page</label>
            <select
              value={layout.defaultPage}
              onChange={setL('defaultPage')}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {['Overview', 'Dashboards', 'IOC Feed', 'Threat Actors', 'Intel Reports'].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <InputField
            label="Refresh Interval (seconds)"
            id="refreshInterval"
            type="number"
            value={layout.refreshInterval}
            onChange={setL('refreshInterval')}
            error={layoutErrors.refreshInterval}
            placeholder="30"
          />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Date Format</label>
            <select
              value={layout.dateFormat}
              onChange={setL('dateFormat')}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Timezone</label>
            <select
              value={layout.timezone}
              onChange={setL('timezone')}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {['UTC', 'US/Eastern', 'US/Pacific', 'Europe/London', 'Asia/Kolkata'].map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition"
          >
            Save Dashboard Settings
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Main Settings Page ───────────────────────────────────────────────────────
const TAB_COMPONENTS = {
  Profile: ProfileTab,
  Users: UsersTab,
  Integrations: IntegrationsTab,
  Alerts: AlertsTab,
  Dashboard: DashboardTab,
};

const TAB_ICONS = {
  Profile: '👤',
  Users: '👥',
  Integrations: '🔌',
  Alerts: '🔔',
  Dashboard: '⚙️',
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile');
  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your account, users, integrations and preferences.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-800/80 border border-slate-700/50 rounded-xl p-1 mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 flex-1 min-w-max justify-center py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === tab
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
            >
              <span>{TAB_ICONS[tab]}</span>
              <span>{tab}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
