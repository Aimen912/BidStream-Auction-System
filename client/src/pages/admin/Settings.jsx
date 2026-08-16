import { useState } from 'react';

import PageHeader       from '../../components/layout/PageHeader';
import SettingsSidebar  from '../../components/admin/SettingsSidebar';
import SettingsSections from '../../components/admin/SettingsSections';

// ─── Admin Settings page ──────────────────────────────────────────────────────

function AdminSettings() {
  const [activeCategory, setActiveCategory] = useState('general');

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ── */}
      <PageHeader
        title="Settings"
        subtitle="Configure and manage the BidStream administration panel and marketplace preferences."
        breadcrumbs={[
          { label: 'Home',  href: '/'               },
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Settings'                        },
        ]}
      />

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">

        {/* Left: sticky sidebar */}
        <SettingsSidebar active={activeCategory} onChange={setActiveCategory} />

        {/* Right: active section panel */}
        <div className="min-w-0">
          <SettingsSections active={activeCategory} />
        </div>

      </div>
    </div>
  );
}

export default AdminSettings;
