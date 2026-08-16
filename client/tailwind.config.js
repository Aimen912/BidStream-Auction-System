/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        sm: '1.5rem',
        md: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },

    extend: {
      /*
      |--------------------------------------------------------------------------
      | BidStream Design Tokens — Midnight Navy + Indigo + Violet + Amber
      |
      | ARCHITECTURE NOTES
      | ─────────────────────────────────────────────────────────────────────────
      | There are two token namespaces here that co-exist intentionally:
      |
      | 1. NEW canonical tokens (background.*, primary.DEFAULT/bright, violet,
      |    auction, softBlue, text.*, border.*) — use these going forward.
      |
      | 2. LEGACY aliases (bg.*, navy.*, secondary.*, accent.*) — kept so that
      |    existing component references (bg-bg-card, secondary-600, accent-500,
      |    etc.) continue to compile without touching any component files yet.
      |    Values have been updated to match the new palette. These will be
      |    migrated to canonical tokens in STEP 4.
      |--------------------------------------------------------------------------
      */

      colors: {

        // ── NEW: Canonical background system (Levels 1–5) ───────────────────
        // Level 1 = deepest/main page; Level 5 = highest elevation (modals)
        background: {
          primary:  '#080B1A',   // L1 — main page background
          navy:     '#0B1026',   // L2 — structural (navbar bg)
          sidebar:  '#0D132D',   // L3 — sidebar / nav surfaces
          navbar:   '#0B1026',   // L2 alias — explicit navbar token
          card:     '#121936',   // L4 — cards / content surfaces
          elevated: '#171F42',   // L5 — modals, dropdowns, popovers
        },

        // ── LEGACY alias: bg.* — components still reference bg-bg-card etc.
        // Values updated to match the new background.* system.
        bg: {
          base:     '#080B1A',   // was #0B1120 → now background.primary
          surface:  '#0B1026',   // was #111827 → now background.navy
          card:     '#121936',   // was #161F36 → now background.card
          elevated: '#171F42',   // was #1C2541 → now background.elevated
        },

        // ── NEW: Primary brand — Indigo ──────────────────────────────────────
        primary: {
          DEFAULT: '#4F46E5',   // primary action, CTA, active nav, buttons
          bright:  '#6366F1',   // lighter indigo for text accents, gradients
          // Numeric scale kept for backward compat with primary-100/300/etc.
          100: '#E0E4FF',
          300: '#A5AEFB',
          500: '#6366F1',       // = primary.bright
          600: '#4F46E5',       // = primary.DEFAULT
          700: '#4338CA',
          900: '#1E1B4B',       // updated: was #312E81 (too purple for bg)
        },

        // ── NEW: Violet — secondary brand accent ─────────────────────────────
        violet: {
          DEFAULT: '#7C3AED',
          light:   '#A78BFA',   // for text on dark bg
          dark:    '#5B21B6',   // for deeper surfaces
        },

        // ── NEW: Auction accent — Amber ──────────────────────────────────────
        // Semantically: bid values, money, auction CTAs, live indicators
        auction: {
          DEFAULT: '#F59E0B',
          light:   '#FCD34D',   // brighter for text/highlights
          dark:    '#B45309',   // for borders/subdued contexts
        },

        // ── NEW: Soft blue — minor highlights only, use sparingly ─────────────
        softBlue: '#60A5FA',

        // ── LEGACY alias: navy.* ─────────────────────────────────────────────
        // navy-100/300 used as border/muted-panel colors in several components
        navy: {
          100: '#1A2540',       // was #1E2A4A — dark border/panel
          300: '#1F2D4A',       // was #243049 — muted border
          500: '#334155',       // stays — muted text/stroke
          700: '#080B1A',       // was #0B1120 → aligns with background.primary
        },

        // ── LEGACY alias: secondary.* ────────────────────────────────────────
        // secondary-600 (#2563EB) is the main driver of "too blue" — it is
        // used on almost every primary button, CTA, and active state across
        // the codebase. Value updated to primary indigo so those usages
        // immediately shift without touching component files.
        // The full migration (renaming secondary → primary in components) is
        // done in STEP 4.
        secondary: {
          100: '#1E2A5E',       // was #1E3A5F — dark indigo tint (badge bg)
          500: '#6366F1',       // was #3B82F6 — now primary.bright
          600: '#4F46E5',       // was #2563EB — now primary.DEFAULT ← KEY FIX
        },

        // ── LEGACY alias: accent.* ───────────────────────────────────────────
        // accent-500 (#F59E0B) = amber, correct already. Values confirmed.
        accent: {
          100: '#1C1500',       // was #422006 — very dark amber tint
          500: '#F59E0B',       // = auction.DEFAULT ✓
          600: '#D97706',       // warm amber, slightly deeper
        },

        // ── Semantic text ─────────────────────────────────────────────────────
        // UPDATED to match new spec:
        text: {
          primary:   '#F8FAFC',   // was #F1F5F9 — near-white, updated
          secondary: '#CBD5E1',   // was #94A3B8 — updated (was too muted)
          muted:     '#94A3B8',   // was #64748B — updated (was too dark)
        },

        // ── Borders ───────────────────────────────────────────────────────────
        // UPDATED: subtle becomes rgba (requires CSS var approach for Tailwind).
        // Since Tailwind can't use rgba() in the color map directly for opacity
        // shorthand, we define them as CSS variable values and provide hex
        // fallbacks for components that reference border-border / border-border-subtle.
        border: {
          DEFAULT: '#1F2D4A',   // was #243049 — subtle dark border
          subtle:  '#141D38',   // was #1C2541 — very subtle inner border
          active:  '#4F46E5',   // NEW — indigo active/focus border
        },

        // ── Status ────────────────────────────────────────────────────────────
        // success unchanged (#22C55E ✓)
        // danger updated from #EF4444 (red) → #F43F5E (rose) per spec
        // warning unchanged (#F59E0B ✓)
        success: {
          DEFAULT: '#22C55E',
          50:  '#052E16',
          100: '#14532D',
        },
        warning: {
          DEFAULT: '#F59E0B',
          50:  '#1C1200',
          100: '#422006',
        },
        danger: {
          DEFAULT: '#F43F5E',   // UPDATED: was #EF4444 (red) → rose per spec
          50:  '#2D0010',       // updated dark rose tint
          100: '#4C0519',       // updated dark rose tint
        },
      },

      /*
      |--------------------------------------------------------------------------
      | Typography
      |--------------------------------------------------------------------------
      */

      fontFamily: {
        sans:    ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      /*
      |--------------------------------------------------------------------------
      | Border Radius
      |--------------------------------------------------------------------------
      */

      borderRadius: {
        sm:   '0.25rem',
        md:   '0.375rem',
        lg:   '0.5rem',
        xl:   '0.75rem',
        '2xl':'1rem',
      },

      /*
      |--------------------------------------------------------------------------
      | Shadows — dark-theme, updated for deeper navy backgrounds
      |--------------------------------------------------------------------------
      */

      boxShadow: {
        // Standard elevation levels
        card:
          '0 1px 3px rgb(0 0 0 / 0.45), 0 1px 2px rgb(0 0 0 / 0.35)',
        dropdown:
          '0 10px 20px rgb(0 0 0 / 0.55), 0 4px 8px rgb(0 0 0 / 0.35)',
        modal:
          '0 25px 60px rgb(0 0 0 / 0.65)',
        // Accent glows — use sparingly on focal elements only
        'glow-indigo':
          '0 0 24px rgba(79, 70, 229, 0.35)',
        'glow-violet':
          '0 0 24px rgba(124, 58, 237, 0.3)',
        'glow-amber':
          '0 0 20px rgba(245, 158, 11, 0.3)',
      },

      /*
      |--------------------------------------------------------------------------
      | Spacing Tokens
      |--------------------------------------------------------------------------
      */

      spacing: {
        'container-x': '1.5rem',
        'section-sm':  '3rem',
        section:       '5rem',
        'section-lg':  '7.5rem',
        page:          '2rem',
      },

      /*
      |--------------------------------------------------------------------------
      | Animation — unchanged, kept intact
      |--------------------------------------------------------------------------
      */

      transitionDuration: {
        DEFAULT: '150ms',
      },

      transitionTimingFunction: {
        'out-smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'   },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)'    },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0'  },
        },
        pulseRing: {
          '0%':   { boxShadow: '0 0 0 0 rgb(var(--pulse-color) / 0.4)'  },
          '100%': { boxShadow: '0 0 0 12px rgb(var(--pulse-color) / 0)' },
        },
        bidFlash: {
          // Updated tint to match new warning dark tint
          '0%':   { backgroundColor: '#1C1200' },
          '60%':  { backgroundColor: '#1C1200' },
          '100%': { backgroundColor: 'transparent' },
        },

        // ── Hero entrance — content fades/slides up from subtle offset ────────
        heroEnter: {
          '0%':   { opacity: '0', transform: 'translateY(20px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)'       },
        },

        // ── Card entrance variants (each card enters differently) ─────────────
        cardEnterUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
        cardEnterRight: {
          '0%':   { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)'    },
        },
        cardEnterDown: {
          '0%':   { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'     },
        },

        // ── Continuous floating — three variants for independent rhythm ────────
        float1: {
          '0%, 100%': { transform: 'translateY(0px)'  },
          '50%':      { transform: 'translateY(-8px)' },
        },
        float2: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(6px)' },
        },
        float3: {
          '0%, 100%': { transform: 'translateY(0px)'  },
          '50%':      { transform: 'translateY(-5px)' },
        },
        // Background card float — slower, subtler
        float4: {
          '0%, 100%': { transform: 'translateY(0px)'  },
          '50%':      { transform: 'translateY(-4px)' },
        },
        float5: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(3px)'  },
        },

        // ── Live dot — opacity-only pulse, no scale/grow ──────────────────────
        livePulse: {
          '0%, 100%': { opacity: '0.75' },
          '50%':      { opacity: '0.3'  },
        },
      },

      animation: {
        'fade-in':    'fadeIn 200ms ease-out',
        'slide-up':   'slideUp 250ms cubic-bezier(0.16,1,0.3,1)',
        'slide-down': 'slideDown 200ms ease-out',
        'scale-in':   'scaleIn 150ms cubic-bezier(0.16,1,0.3,1)',
        shimmer:      'shimmer 1.5s linear infinite',
        'pulse-ring': 'pulseRing 1.4s cubic-bezier(0.4,0,0.6,1) infinite',
        'bid-flash':  'bidFlash 800ms ease-out forwards',

        // Hero entrance sequence
        'hero-enter':       'heroEnter 600ms cubic-bezier(0.16,1,0.3,1) both',

        // Card entrance (fill-mode: both — holds opacity:0 before delay fires)
        'card-enter-up':    'cardEnterUp    550ms cubic-bezier(0.16,1,0.3,1) both',
        'card-enter-right': 'cardEnterRight 550ms cubic-bezier(0.16,1,0.3,1) both',
        'card-enter-down':  'cardEnterDown  550ms cubic-bezier(0.16,1,0.3,1) both',

        // Continuous floating — different durations = asynchronous movement
        'float-1': 'float1 6s ease-in-out infinite',
        'float-2': 'float2 7s ease-in-out infinite',
        'float-3': 'float3 5s ease-in-out infinite',
        'float-4': 'float4 9s ease-in-out infinite',
        'float-5': 'float5 8s ease-in-out infinite',

        // Live dot subtle pulse
        'live-pulse': 'livePulse 2s ease-in-out infinite',
      },
    },
  },

  plugins: [],
};
