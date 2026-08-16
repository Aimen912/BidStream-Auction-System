import { useState } from 'react';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Auctions',     to: '/auctions'      },
  { label: 'How It Works', to: '/how-it-works'  },
  { label: 'Features',     to: '#features'      },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 no-underline" aria-label="BidStream home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 shadow-card">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 13L8 3l5 10H3z" fill="white" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight text-text-primary">
            Bid<span className="text-primary-400">Stream</span>
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="relative text-sm font-medium text-text-muted transition-colors duration-150 hover:text-text-primary no-underline after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-primary-400 after:transition-all after:duration-200 hover:after:w-full"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* ── Desktop CTA ── */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors duration-150 hover:bg-bg-elevated hover:text-text-primary no-underline"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-card transition-all duration-150 hover:bg-primary-500 hover:-translate-y-0.5 no-underline"
          >
            Get Started
          </Link>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors duration-150 hover:bg-bg-elevated md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/40"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (
            <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="3" y1="3" x2="15" y2="15" />
              <line x1="15" y1="3" x2="3" y2="15" />
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="2" y1="5"  x2="16" y2="5"  />
              <line x1="2" y1="9"  x2="16" y2="9"  />
              <line x1="2" y1="13" x2="16" y2="13" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="border-t border-border-subtle bg-bg-card md:hidden motion-safe:animate-slide-down">

          {/* Menu header row — brand + explicit close */}
          <div className="flex items-center justify-between border-b border-border-subtle px-6 py-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">Menu</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted transition-colors duration-150 hover:bg-bg-elevated hover:text-text-primary focus-visible:outline-none"
            >
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <line x1="3" y1="3" x2="15" y2="15" />
                <line x1="15" y1="3" x2="3" y2="15" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-0.5 px-4 pt-2 pb-1" aria-label="Mobile navigation">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-text-secondary transition-colors duration-150 hover:bg-bg-elevated hover:text-text-primary no-underline"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="flex flex-col gap-2 px-4 pb-5 pt-3">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl border border-border px-4 py-3 text-center text-sm font-medium text-text-secondary transition-colors duration-150 hover:border-primary-600/30 hover:bg-bg-surface hover:text-primary-300 no-underline"
            >
              Log in
            </Link>
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-primary-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-500 no-underline"
            >
              Get Started — It's Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
