// ─── Link columns ─────────────────────────────────────────────────────────────

const FOOTER_COLUMNS = [
  {
    heading: 'Company',
    links: [
      { label: 'About Us',    href: '/about'    },
      { label: 'Careers',     href: '/careers'  },
      { label: 'Press',       href: '/press'    },
      { label: 'Blog',        href: '/blog'     },
      { label: 'Contact',     href: '/contact'  },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help Centre',    href: '/help'       },
      { label: 'How It Works',   href: '/how-it-works' },
      { label: 'Seller Guide',   href: '/sellers'    },
      { label: 'Buyer Guide',    href: '/buyers'     },
      { label: 'Disputes',       href: '/disputes'   },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy',  href: '/privacy'   },
      { label: 'Terms of Service', href: '/terms'    },
      { label: 'Cookie Policy',   href: '/cookies'   },
      { label: 'Refund Policy',   href: '/refunds'   },
      { label: 'Compliance',      href: '/compliance'},
    ],
  },
];

// ─── Social icons ─────────────────────────────────────────────────────────────

const SOCIALS = [
  {
    label: 'Twitter / X',
    href: 'https://x.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
];

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background-primary">

      {/* ── Main grid ── */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">

          {/* Brand column */}
          <div className="flex flex-col gap-5">

            {/* Logo */}
            <a href="/" className="inline-flex items-center gap-2 no-underline">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M3 15L9 3l6 12H3z" fill="white" />
                </svg>
              </span>
              <span className="text-xl font-bold tracking-tight text-text-primary">
                Bid<span className="text-primary-400">Stream</span>
              </span>
            </a>

            {/* Tagline */}
            <p className="max-w-xs text-sm leading-relaxed text-text-muted">
              The premium real-time auction platform. Connecting verified buyers and sellers with trust, speed, and transparency.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted transition-colors duration-150 hover:border-primary-600/40 hover:bg-primary-600/10 hover:text-primary-400 no-underline"
                >
                  {icon}
                </a>
              ))}
            </div>

            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 self-start rounded-xl border border-border bg-bg-card px-4 py-2.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="text-xs font-medium text-text-muted">SSL Secured &amp; Verified</span>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-text-muted">
                {heading}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-text-muted transition-colors duration-150 hover:text-white no-underline"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row lg:px-10">

          <p className="text-sm text-text-muted">
            © {year} BidStream, Inc. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookies'].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-xs text-text-muted transition-colors duration-150 hover:text-text-secondary no-underline"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Status pill */}
          <div className="flex items-center gap-2 rounded-full border border-border bg-bg-card px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-xs font-medium text-text-muted">All systems operational</span>
          </div>

        </div>
      </div>

    </footer>
  );
}

export default Footer;
