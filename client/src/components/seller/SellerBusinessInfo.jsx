import { useAuth } from '../../context/AuthContext';

function InfoRow({ label, value, icon }) {
  return (
    <div className="flex items-start gap-4 border-b border-border-subtle py-3.5 last:border-0">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bg-surface text-text-muted">
        {icon}
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-text-primary">{value || '—'}</p>
      </div>
    </div>
  );
}

function SellerBusinessInfo() {
  const { user } = useAuth();

  const rows = [
    {
      label: 'Full Name',
      value: user?.name,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    },
    {
      label: 'Email Address',
      value: user?.email,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    },
    {
      label: 'Phone Number',
      value: user?.phone,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.4h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.4a16 16 0 0 0 5.1 5.1l.94-.94a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    },
    {
      label: 'Business Name / Bio',
      value: user?.bio,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    },
    {
      label: 'Location',
      value: user?.location,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    },
    {
      label: 'Username',
      value: user?.username ? `@${user.username}` : null,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    },
    {
      label: 'Member Since',
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : null,
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-bg-card shadow-card">
      <div className="border-b border-border-subtle px-6 py-4">
        <h3 className="text-base font-bold text-text-primary">Business Information</h3>
        <p className="text-xs text-text-muted">Your account and business details</p>
      </div>
      <div className="px-6 py-2">
        {rows.map(({ label, value, icon }) => (
          <InfoRow key={label} label={label} value={value} icon={icon} />
        ))}
      </div>
    </div>
  );
}

export default SellerBusinessInfo;
