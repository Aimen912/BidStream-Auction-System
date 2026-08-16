import { useState }  from 'react';
import { Outlet }    from 'react-router-dom';
import AdminSidebar  from '../components/admin/AdminSidebar';
import AdminNavbar   from '../components/admin/AdminNavbar';

// ─── AdminLayout ──────────────────────────────────────────────────────────────

function AdminLayout() {
  // Desktop: icon-only collapsed mode
  const [collapsed,  setCollapsed]  = useState(false);
  // Mobile: drawer open/close
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-surface">

      {/* ── Admin Sidebar ── */}
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* ── Right column ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Admin top navbar */}
        <AdminNavbar onMenuToggle={() => setMobileOpen((v) => !v)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 lg:px-6 lg:py-8">
          <div className="min-h-0 pb-24">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;
