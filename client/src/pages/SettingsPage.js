import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import PowerRoundedIcon from '@mui/icons-material/PowerRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import LinkOffRoundedIcon from '@mui/icons-material/LinkOffRounded';
import SettingsInputCompositeRoundedIcon from '@mui/icons-material/SettingsInputCompositeRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import WifiTetheringRoundedIcon from '@mui/icons-material/WifiTetheringRounded';

// ─── Sidebar Nav Config ───────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'Profile',      label: 'Profile',       icon: PersonOutlineRoundedIcon,           color: 'indigo' },
  { id: 'Users',        label: 'User Management', icon: GroupsRoundedIcon,                color: 'cyan'   },
  { id: 'Integrations', label: 'Integrations',   icon: PowerRoundedIcon,                  color: 'violet' },
  { id: 'Alerts',       label: 'Alert Rules',    icon: NotificationsNoneRoundedIcon,       color: 'amber'  },
  { id: 'Dashboard',    label: 'Dashboard',      icon: TuneRoundedIcon,                   color: 'emerald'},
];

const COLOR_MAP = {
  indigo:  { bg: 'bg-indigo-500/15',  text: 'text-indigo-400',  border: 'border-indigo-500/30',  ring: 'ring-indigo-500/40'  },
  cyan:    { bg: 'bg-cyan-500/15',    text: 'text-cyan-400',    border: 'border-cyan-500/30',    ring: 'ring-cyan-500/40'    },
  violet:  { bg: 'bg-violet-500/15',  text: 'text-violet-400',  border: 'border-violet-500/30',  ring: 'ring-violet-500/40'  },
  amber:   { bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/30',   ring: 'ring-amber-500/40'   },
  emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', ring: 'ring-emerald-500/40' },
};

// ─── Reusable UI Primitives ───────────────────────────────────────────────────
function InputField({ label, id, type = 'text', value, onChange, error, placeholder, disabled, helper }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        id={id} type={type} value={value} onChange={onChange}
        disabled={disabled} placeholder={placeholder}
        className={`w-full bg-slate-800/60 border rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600
          focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200
          disabled:opacity-40 disabled:cursor-not-allowed
          ${error ? 'border-red-500/60 focus:ring-red-500/30' : 'border-white/8 hover:border-white/15'}`}
      />
      {error  && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">⚠ {error}</p>}
      {helper && <p className="mt-1.5 text-xs text-slate-500">{helper}</p>}
    </div>
  );
}

function SelectField({ label, id, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <select
        id={id} value={value} onChange={onChange}
        className="w-full bg-slate-800/60 border border-white/8 hover:border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-slate-100
          focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
      >
        {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </div>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-white/5 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <button
        role="switch" aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative flex-shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
          ${checked ? 'bg-indigo-600 focus:ring-indigo-500' : 'bg-slate-700 focus:ring-slate-500'}`}
      >
        <span className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-1'}`}
          style={{ height: 18, width: 18 }}
        />
      </button>
    </div>
  );
}

function SectionCard({ title, description, accent, icon: Icon, children, action }) {
  return (
    <div className="bg-slate-800/40 border border-white/6 rounded-2xl overflow-hidden mb-5 last:mb-0">
      {(title || description) && (
        <div className={`px-5 py-4 border-b border-white/6 flex items-center justify-between gap-3
          ${accent ? 'bg-gradient-to-r from-slate-800/80 to-slate-800/40' : ''}`}>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <Icon style={{ fontSize: 16 }} className="text-indigo-400" />
              </div>
            )}
            <div>
              {title       && <h3 className="text-sm font-semibold text-white">{title}</h3>}
              {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
            </div>
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

function SaveBanner({ visible, message = 'Changes saved successfully' }) {
  if (!visible) return null;
  return (
    <div className="mb-5 flex items-center gap-2.5 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm">
      <CheckCircleOutlineRoundedIcon style={{ fontSize: 18 }} />
      {message}
    </div>
  );
}

function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  const widths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full ${widths[size]} animate-fadeIn`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition">
            <CloseRoundedIcon style={{ fontSize: 18 }} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function PrimaryBtn({ onClick, children, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30">
      {children}
    </button>
  );
}

function GhostBtn({ onClick, children, danger }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200
        ${danger
          ? 'border-red-500/40 text-red-400 hover:bg-red-500/10'
          : 'border-white/10 text-slate-300 hover:text-white hover:bg-white/6'}`}>
      {children}
    </button>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    phone: user?.phone || '',
    currentPassword: '', newPassword: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState('');

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const flash = (msg) => { setSaved(msg); setTimeout(() => setSaved(''), 3000); };

  const saveProfile = async () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      const { data } = await api.put('/auth/profile', {
        name: form.name,
        email: form.email,
        phone: form.phone,
      });
      // Sync the updated data with global context and local storage
      updateUser(data);
      flash('Profile information updated');
    } catch (err) {
      console.error('Profile update error:', err);
      const msg = err.response?.data?.message || 'Failed to update profile';
      setErrors({ ...errs, email: msg });
    }
  };

  const savePassword = async () => {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = 'Required';
    if (form.newPassword.length < 8) errs.newPassword = 'Minimum 8 characters';
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    
    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      await api.put('/auth/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      setForm({ ...form, currentPassword: '', newPassword: '', confirmPassword: '' });
      flash('Password changed successfully');
    } catch (err) {
      console.error('Password change error:', err);
      const msg = err.response?.data?.message || 'Failed to update password';
      setErrors({ ...errs, currentPassword: msg });
    }
  };

  const initial = form.name.charAt(0).toUpperCase();

  return (
    <div>
      <SaveBanner visible={!!saved} message={saved} />

      {/* Avatar card */}
      <SectionCard title="Profile Picture" icon={PersonOutlineRoundedIcon}>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-indigo-500/30 select-none ring-4 ring-indigo-500/20">
              {initial}
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-slate-900" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-0.5">{form.name}</p>
            <p className="text-xs text-slate-400 mb-3">{form.role}</p>
            <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-3 py-1.5 rounded-lg transition">
              Upload Photo
            </button>
            <p className="text-[11px] text-slate-600 mt-1.5">PNG or JPG up to 2 MB</p>
          </div>
        </div>
      </SectionCard>

      {/* Personal info */}
      <SectionCard title="Personal Information" description="Update your account details" icon={PersonOutlineRoundedIcon}
        action={<PrimaryBtn onClick={saveProfile}>Save Profile</PrimaryBtn>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Full Name"     id="name"  value={form.name}  onChange={set('name')}  error={errors.name} />
          <InputField label="Email Address" id="email" type="email" value={form.email} onChange={set('email')} error={errors.email} />
          <InputField label="Role"          id="role"  value={form.role}  disabled />
          <InputField label="Phone Number"  id="phone" value={form.phone} onChange={set('phone')} placeholder="+1 (555) 000-0000" />
        </div>
      </SectionCard>

      {/* Change password */}
      <SectionCard title="Change Password" description="Use a strong unique password" icon={LockOutlinedIcon}
        action={<PrimaryBtn onClick={savePassword}>Update Password</PrimaryBtn>}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField label="Current Password" id="curPwd" type="password" value={form.currentPassword} onChange={set('currentPassword')} error={errors.currentPassword} />
          <InputField label="New Password"     id="newPwd" type="password" value={form.newPassword}     onChange={set('newPassword')}     error={errors.newPassword}    helper="Min 8 characters" />
          <InputField label="Confirm Password" id="cfmPwd" type="password" value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────
const INITIAL_USERS = [];


const AVATAR_COLORS = ['from-indigo-500 to-cyan-500','from-violet-500 to-pink-500','from-amber-500 to-orange-500','from-emerald-500 to-teal-500'];

function UsersTab() {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showAdd, setShowAdd]     = useState(false);
  const [delTarget, setDelTarget] = useState(null);
  const [form, setForm]           = useState({ name: '', email: '', role: 'analyst', password: 'password123' });
  const [errors, setErrors]       = useState({});

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    return e;
  };

  const handleAdd = async () => {
    const e = validate(); setErrors(e);
    if (!Object.keys(e).length) {
      try {
        await api.post('/auth/users', form);
        setForm({ name: '', email: '', role: 'analyst', password: 'password123' });
        setShowAdd(false);
        fetchUsers();
      } catch (err) {
        setErrors({ email: err.response?.data?.message || 'Failed to add user' });
      }
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.patch(`/auth/users/${id}/status`);
      fetchUsers();
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/auth/users/${delTarget.id}`);
      setDelTarget(null);
      fetchUsers();
    } catch (err) {
      console.error('Delete user error:', err);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading team members...</div>;

  return (
    <div>
      <SectionCard
        title={`Team Members`} description={`${users.length} users in your workspace`}
        icon={GroupsRoundedIcon}
        action={
          <button onClick={() => { setShowAdd(true); setErrors({}); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition shadow-lg shadow-indigo-500/20">
            <AddRoundedIcon style={{ fontSize: 14 }} /> Add User
          </button>
        }
      >
        <div className="space-y-2">
          {users.map((u, i) => (
            <div key={u.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/50 border border-white/5 hover:border-indigo-500/20 hover:bg-slate-800/80 transition group">
              {/* Avatar */}
              <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                {u.name?.charAt(0) || 'U'}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{u.name}</p>
                <p className="text-xs text-slate-500 truncate">{u.email}</p>
              </div>
              {/* Role badge */}
              <span className={`hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border
                ${u.role === 'admin' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-slate-700/60 text-slate-400 border-white/8'}`}>
                {u.role}
              </span>
              {/* Status toggle */}
              <button onClick={() => toggleStatus(u.id)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition
                  ${u.status === 'Active'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'}`}>
                {u.status}
              </button>
              {/* Delete */}
              <button onClick={() => setDelTarget(u)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100">
                <DeleteOutlineRoundedIcon style={{ fontSize: 16 }} />
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Add User Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add New Team Member">
        <div className="space-y-4">
          <InputField label="Full Name" id="nName"  value={form.name}  onChange={set('name')}  error={errors.name}  placeholder="Jane Smith" />
          <InputField label="Email"     id="nEmail" type="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="jane@soc.internal" />
          <SelectField label="Role" id="nRole" value={form.role} onChange={set('role')}
            options={[{ label: 'Analyst', value: 'Analyst' }, { label: 'Admin', value: 'Admin' }]} />
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <GhostBtn onClick={() => setShowAdd(false)}>Cancel</GhostBtn>
          <PrimaryBtn onClick={handleAdd}>Add Member</PrimaryBtn>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!delTarget} onClose={() => setDelTarget(null)} title="Remove Member" size="sm">
        <div className="flex items-start gap-3 mb-5">
          <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20 flex-shrink-0">
            <DeleteOutlineRoundedIcon className="text-red-400" style={{ fontSize: 20 }} />
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Remove <span className="font-semibold text-white">{delTarget?.name}</span> from the workspace? This cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 justify-end">
          <GhostBtn onClick={() => setDelTarget(null)}>Cancel</GhostBtn>
          <GhostBtn danger onClick={handleDelete}>Remove</GhostBtn>
        </div>
      </Modal>
    </div>
  );
}

// ─── Integrations Tab ─────────────────────────────────────────────────────────
const INTEGRATIONS = [
  { id: 'siem',       name: 'SIEM Platform',  desc: 'Splunk / QRadar event ingestion', Icon: WifiTetheringRoundedIcon,           connected: true,  color: 'indigo' },
  { id: 'slack',      name: 'Slack',          desc: 'Push alert notifications to Slack', Icon: NotificationsNoneRoundedIcon,     connected: false, color: 'amber'  },
  { id: 'virustotal', name: 'VirusTotal',     desc: 'IOC enrichment & threat analysis', Icon: ShieldRoundedIcon,                 connected: true,  color: 'violet' },
  { id: 'misp',       name: 'MISP',           desc: 'Pull threat feeds from MISP',      Icon: SettingsInputCompositeRoundedIcon, connected: false, color: 'cyan'   },
];

function IntegrationsTab() {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [configTarget, setCT]     = useState(null);
  const [apiKey, setApiKey]       = useState('');
  const [endpoint, setEndpoint]   = useState('');
  const [syncFreq, setSyncFreq]   = useState('5m');
  const [apiKeyErr, setApiKeyErr] = useState('');
  const [saved, setSaved]         = useState(false);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/settings/integrations');
      setItems(data);
    } catch (err) {
      console.error('Fetch integrations error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const toggleConn = async (item) => {
    try {
      await api.patch(`/settings/integrations/${item.id}`, { 
        status: item.status === 'Connected' ? 'Off' : 'Connected' 
      });
      fetchIntegrations();
    } catch (err) {
      console.error('Toggle connection error:', err);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim() || apiKey.length < 10) { setApiKeyErr('API key must be at least 10 characters'); return; }
    try {
      await api.patch(`/settings/integrations/${configTarget.id}`, { 
        apiKey,
        endpoint,
        config: { syncFreq }
      });
      setApiKeyErr(''); setApiKey(''); setEndpoint(''); setCT(null);
      setSaved(true); setTimeout(() => setSaved(false), 3000);
      fetchIntegrations();
    } catch (err) {
      setApiKeyErr('Failed to save configuration');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading integrations...</div>;

  return (
    <div>
      <SaveBanner visible={saved} message="Integration configured successfully" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => {
          const Icon = INTEGRATIONS.find(i => i.id === item.name)?.Icon || ShieldRoundedIcon;
          const color = INTEGRATIONS.find(i => i.id === item.name)?.color || 'indigo';
          const c = COLOR_MAP[color] || COLOR_MAP.indigo;
          const isConnected = item.status === 'Connected';
          
          return (
            <div key={item.id} className={`bg-slate-800/40 border rounded-2xl p-5 hover:border-opacity-60 transition-all group
              ${isConnected ? c.border : 'border-white/6'}`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${c.bg} ${c.border}`}>
                    <Icon style={{ fontSize: 20 }} className={c.text} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white uppercase">{item.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                      {INTEGRATIONS.find(i => i.id === item.name)?.desc || 'Third-party service integration'}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0
                  ${isConnected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-700/60 text-slate-500 border-white/8'}`}>
                  {isConnected ? '● Connected' : '○ Off'}
                </span>
              </div>
              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button onClick={() => toggleConn(item)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl border transition
                    ${isConnected
                      ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                      : `${c.border} ${c.text} hover:bg-indigo-500/10`}`}>
                  {isConnected ? <><LinkOffRoundedIcon style={{ fontSize: 14 }} />Disconnect</> : <><LinkRoundedIcon style={{ fontSize: 14 }} />Connect</>}
                </button>
                <button onClick={() => { 
                    setCT(item); 
                    setApiKey(item.apiKey || ''); 
                    setEndpoint(item.endpoint || '');
                    try {
                      const cfg = item.config ? JSON.parse(item.config) : {};
                      setSyncFreq(cfg.syncFreq || '5m');
                    } catch { setSyncFreq('5m'); }
                    setApiKeyErr(''); 
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/6 transition">
                  <SettingsInputCompositeRoundedIcon style={{ fontSize: 14 }} /> Configure
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configure Modal */}
      <Modal isOpen={!!configTarget} onClose={() => setCT(null)} title={`Configure ${configTarget?.name}`}>
        <div className="space-y-4">
          <InputField label="API Key" id="apiKey" type="password" value={apiKey}
            onChange={e => setApiKey(e.target.value)} error={apiKeyErr} placeholder="Paste your API key…" helper="Your key is securely stored in the backend." />
          <InputField label="Endpoint URL" id="endpoint" value={endpoint} 
            onChange={e => setEndpoint(e.target.value)} placeholder="https://api.example.com/v1" />
          <SelectField label="Sync Frequency" id="syncFreq" value={syncFreq}
            onChange={e => setSyncFreq(e.target.value)} options={['1m', '5m', '15m', '30m', '1h'].map(v => ({ value: v, label: `Every ${v}` }))} />
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <GhostBtn onClick={() => setCT(null)}>Cancel</GhostBtn>
          <PrimaryBtn onClick={handleSave}>Save Configuration</PrimaryBtn>
        </div>
      </Modal>
    </div>
  );
}

// ─── Alerts Tab ───────────────────────────────────────────────────────────────
function AlertsTab() {
  const [thresholds, setThresh] = useState({ criticalSla: '15', highSla: '60', retention: '90' });
  const [channels, setChannels] = useState({ email: true, slack: false, sound: true });
  const [behavior, setBehavior] = useState({ criticalOnly: false, autoEscalate: true, weeklyReport: true });
  const [loading, setLoading]   = useState(true);
  const [errors, setErrors]     = useState({});
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings/workspace');
        if (data.criticalSla !== undefined) {
          setThresh({
            criticalSla: String(data.criticalSla || '15'),
            highSla: String(data.highSla || '60'),
            retention: String(data.retention || '90')
          });
        }
        if (data.notifyEmail !== undefined) {
          setChannels({
            email: !!data.notifyEmail,
            slack: !!data.notifySlack,
            sound: !!data.notifySound
          });
        }
        if (data.criticalOnly !== undefined) {
          setBehavior({
            criticalOnly: !!data.criticalOnly,
            autoEscalate: !!data.autoEscalate,
            weeklyReport: !!data.weeklyReport
          });
        }
      } catch (err) {
        console.error('Fetch settings error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const setT = (f) => (e) => setThresh({ ...thresholds, [f]: e.target.value });

  const handleSave = async () => {
    const e = {};
    if (!thresholds.criticalSla || isNaN(thresholds.criticalSla) || +thresholds.criticalSla < 1)  e.criticalSla = 'Must be ≥ 1';
    if (!thresholds.highSla     || isNaN(thresholds.highSla)     || +thresholds.highSla < 1)      e.highSla     = 'Must be ≥ 1';
    if (!thresholds.retention   || isNaN(thresholds.retention)   || +thresholds.retention < 7)    e.retention   = 'Minimum 7 days';
    setErrors(e);
    if (Object.keys(e).length) return;

    try {
      const payload = {
        ...thresholds,
        notifyEmail: channels.email,
        notifySlack: channels.slack,
        notifySound: channels.sound,
        criticalOnly: behavior.criticalOnly,
        autoEscalate: behavior.autoEscalate,
        weeklyReport: behavior.weeklyReport
      };
      await api.post('/settings/workspace', payload);
      setSaved(true); 
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save settings error:', err);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading configurations...</div>;

  return (
    <div>
      <SaveBanner visible={saved} message="Alert settings saved" />
      <SectionCard title="Notification Channels" description="Choose where alerts are delivered" icon={NotificationsNoneRoundedIcon}>
        <Toggle label="Email Alerts"    description="Send critical alerts to your registered email" checked={channels.email} onChange={v => setChannels({ ...channels, email: v })} />
        <Toggle label="Slack"           description="Push notifications to your configured Slack channel" checked={channels.slack} onChange={v => setChannels({ ...channels, slack: v })} />
        <Toggle label="Browser Sound"   description="Play an audio chime when new critical alerts arrive" checked={channels.sound} onChange={v => setChannels({ ...channels, sound: v })} />
      </SectionCard>

      <SectionCard title="Alert Behaviour" description="Control escalation and filtering logic" icon={ShieldRoundedIcon}>
        <Toggle label="Critical Only Mode"    description="Suppress notifications for medium and low severity alerts"  checked={behavior.criticalOnly}   onChange={v => setBehavior({ ...behavior, criticalOnly:   v })} />
        <Toggle label="Auto-Escalate"         description="Escalate unresolved alerts when SLA threshold is exceeded"  checked={behavior.autoEscalate}   onChange={v => setBehavior({ ...behavior, autoEscalate:   v })} />
        <Toggle label="Weekly Summary Report" description="Receive a weekly email digest of all alert activity"        checked={behavior.weeklyReport}   onChange={v => setBehavior({ ...behavior, weeklyReport:   v })} />
      </SectionCard>

      <SectionCard title="SLA Thresholds & Retention" description="Set response time SLAs and data retention policies"
        icon={SpeedRoundedIcon} action={<PrimaryBtn onClick={handleSave}>Save</PrimaryBtn>}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField label="Critical SLA (mins)" id="critSla"  type="number" value={thresholds.criticalSla} onChange={setT('criticalSla')} error={errors.criticalSla} placeholder="15" />
          <InputField label="High SLA (mins)"     id="highSla"  type="number" value={thresholds.highSla}     onChange={setT('highSla')}     error={errors.highSla}     placeholder="60" />
          <InputField label="Retention (days)"    id="retention" type="number" value={thresholds.retention}  onChange={setT('retention')}   error={errors.retention}   placeholder="90" helper="Min 7 days" />
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
function DashboardTab() {
  const [display, setDisplay] = useState({ autoRefresh: true, compact: false, avatars: true, darkCharts: true, stickyHeader: true, animations: true });
  const [layout, setLayout]   = useState({ defaultPage: 'Live Monitor', refreshInterval: '30', dateFormat: 'DD/MM/YYYY', timezone: 'UTC' });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors]   = useState({});
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings/workspace');
        if (data.refreshInterval !== undefined) {
          setLayout({
            defaultPage: data.defaultPage || 'Live Monitor',
            refreshInterval: String(data.refreshInterval || '30'),
            dateFormat: data.dateFormat || 'DD/MM/YYYY',
            timezone: data.timezone || 'UTC'
          });
        }
        if (data.autoRefresh !== undefined) {
          setDisplay({
            autoRefresh: !!data.autoRefresh,
            compact: !!data.compact,
            avatars: !!data.avatars,
            darkCharts: !!data.darkCharts,
            stickyHeader: !!data.stickyHeader,
            animations: !!data.animations
          });
        }
      } catch (err) {
        console.error('Fetch settings error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const setL = (f) => (e) => setLayout({ ...layout, [f]: e.target.value });
  const toggleD = (k) => (v) => setDisplay({ ...display, [k]: v });

  const handleSave = async () => {
    const e = {};
    const ri = Number(layout.refreshInterval);
    if (!layout.refreshInterval || isNaN(ri) || ri < 10 || ri > 3600) e.refreshInterval = '10–3600 seconds';
    setErrors(e);
    if (Object.keys(e).length) return;

    try {
      await api.post('/settings/workspace', { ...layout, ...display });
      setSaved(true); 
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save settings error:', err);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading preferences...</div>;

  return (
    <div>
      <SaveBanner visible={saved} message="Dashboard settings saved" />
      <SectionCard title="Display Preferences" description="Customize the look and feel of your workspace" icon={TuneRoundedIcon}>
        <Toggle label="Auto-Refresh"   description="Automatically poll the backend for updated data every 30s" checked={display.autoRefresh}   onChange={toggleD('autoRefresh')} />
        <Toggle label="Compact Mode"   description="Reduce card padding for a denser, information-rich layout"  checked={display.compact}       onChange={toggleD('compact')} />
        <Toggle label="User Avatars"   description="Show profile avatar initials in tables and comments"        checked={display.avatars}       onChange={toggleD('avatars')} />
        <Toggle label="Dark Charts"    description="Use dark-themed chart backgrounds matching the dashboard"   checked={display.darkCharts}    onChange={toggleD('darkCharts')} />
        <Toggle label="Sticky Header"  description="Keep the navigation bar pinned while scrolling the page"   checked={display.stickyHeader}  onChange={toggleD('stickyHeader')} />
        <Toggle label="UI Animations"  description="Enable smooth transitions, hover effects and micro-animations" checked={display.animations} onChange={toggleD('animations')} />
      </SectionCard>

      <SectionCard title="Layout & Locale" description="Default page, refresh interval and time settings"
        icon={SpeedRoundedIcon} action={<PrimaryBtn onClick={handleSave}>Save Layout</PrimaryBtn>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField label="Default Landing Page" id="defPage" value={layout.defaultPage} onChange={setL('defaultPage')}
            options={['Live Monitor', 'IOC Workbench', 'Investigations', 'Actor Profiles', 'Intel Reports']} />
          <InputField  label="Refresh Interval (s)" id="refInt" type="number" value={layout.refreshInterval} onChange={setL('refreshInterval')} error={errors.refreshInterval} placeholder="30" helper="Allowed range: 10–3600 seconds" />
          <SelectField label="Date Format" id="dateFmt" value={layout.dateFormat} onChange={setL('dateFormat')}
            options={['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']} />
          <SelectField label="Timezone" id="tz" value={layout.timezone} onChange={setL('timezone')}
            options={['UTC', 'US/Eastern', 'US/Pacific', 'Europe/London', 'Asia/Kolkata', 'Asia/Tokyo']} />
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const TAB_COMPONENTS = { Profile: ProfileTab, Users: UsersTab, Integrations: IntegrationsTab, Alerts: AlertsTab, Dashboard: DashboardTab };

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile');
  const ActiveComponent = TAB_COMPONENTS[activeTab];
  const activeNav = NAV_ITEMS.find(n => n.id === activeTab);
  const c = COLOR_MAP[activeNav?.color] || COLOR_MAP.indigo;

  return (
    <div className="min-h-screen pb-10">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account, team, integrations and preferences.</p>
      </div>

      <div className="flex gap-6 items-start">
        {/* ── Sidebar Nav ────────────────────────────────────────────────── */}
        <div className="w-56 flex-shrink-0">
          <div className="bg-slate-800/50 border border-white/6 rounded-2xl p-2 space-y-0.5 sticky top-4">
            {NAV_ITEMS.map((item) => {
              const ic = COLOR_MAP[item.color] || COLOR_MAP.indigo;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left
                    ${isActive ? `${ic.bg} ${ic.text} ${ic.border} border` : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
                >
                  <div className={`p-1 rounded-lg ${isActive ? ic.bg : 'bg-transparent'} transition-colors`}>
                    <item.icon style={{ fontSize: 16 }} />
                  </div>
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Content Area ────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Section title bar */}
          <div className={`flex items-center gap-3 mb-5 p-4 rounded-2xl border ${c.bg} ${c.border}`}>
            <div className={`p-2 rounded-xl border ${c.bg} ${c.border}`}>
              <activeNav.icon style={{ fontSize: 20 }} className={c.text} />
            </div>
            <div>
              <h2 className={`text-base font-bold ${c.text}`}>{activeNav.label}</h2>
              <p className="text-xs text-slate-500">
                {activeTab === 'Profile'      && 'Update your personal information and security settings'}
                {activeTab === 'Users'        && 'Manage team members, roles and access permissions'}
                {activeTab === 'Integrations' && 'Connect third-party services and manage API keys'}
                {activeTab === 'Alerts'       && 'Configure alert notifications, SLA thresholds and retention'}
                {activeTab === 'Dashboard'    && 'Customize display preferences, refresh intervals and locale'}
              </p>
            </div>
          </div>

          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
