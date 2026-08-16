import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

// ─── MainLayout ───────────────────────────────────────────────────────────────

function MainLayout() {
  // Desktop: collapsed sidebar (icon-only) toggle
  const [collapsed,   setCollapsed]   = useState(false);
  // Mobile: drawer open/close
  const [mobileOpen,  setMobileOpen]  = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-surface">

      {/* ── Sidebar ── */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* ── Right column ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top navbar */}
        <Navbar onMenuToggle={() => setMobileOpen((v) => !v)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 lg:px-6 lg:py-8">
          <div className="max-w-full pb-24">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}

export default MainLayout;
