import { SELLER_PROFILE } from '../../data/seller/SELLER_PROFILE_DATA';

// ─── Verification item ────────────────────────────────────────────────────────

function VerificationItem({ label, verified, description }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border-subtle py-4 last:border-0">
      <div className="flex items-start gap-3">
        <span className={[
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          verified ? 'bg-success-100 text-success' : 'bg-bg-elevated text-text-muted',
        ].join(' ')}>
          {verified ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
        </span>
        <div>
          <p className="text-sm font-semibold text-text-primary">{label}</p>
          <p className="mt-0.5 text-xs text-text-muted">{description}</p>
        </div>
      </div>

      <span className={[
        'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold',
        verified
          ? 'bg-success-100 text-success'
          : 'bg-bg-elevated text-text-muted',
      ].join(' ')}>
        {verified ? 'Verified' : 'Pending'}
      </span>
    </div>
  );
}

// ─── SellerVerificationCard ───────────────────────────────────────────────────

/**
 * Verification status panel for the Seller Profile page.
 */
function SellerVerificationCard() {
  const {
    identityVerified,
    emailVerified,
    phoneVerified,
    bankVerified,
    addressVerified,
  } = SELLER_PROFILE;

  const items = [
    { label: 'Identity Verification',  verified: identityVerified, description: 'Government-issued ID confirmed by BidStream.'         },
    { label: 'Email Address',          verified: emailVerified,    description: 'Email address confirmed via verification link.'        },
    { label: 'Phone Number',           verified: phoneVerified,    description: 'Mobile number confirmed via OTP.'                     },
    { label: 'Bank Account',           verified: bankVerified,     description: 'Bank account linked for secure payouts.'              },
    { label: 'Business Address',       verified: addressVerified,  description: 'Physical address verified by document submission.'    },
  ];

  const verifiedCount = items.filter((i) => i.verified).length;
  const progress      = Math.round((verifiedCount / items.length) * 100);

  return (
    <div className="rounded-2xl border border-border bg-bg-card shadow-card">
      <div className="border-b border-border-subtle px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-text-primary">Verification Status</h3>
            <p className="text-xs text-text-muted">{verifiedCount} of {items.length} checks completed</p>
          </div>
          <span className={[
            'rounded-xl px-3 py-1.5 text-xs font-bold',
            progress === 100
              ? 'bg-success-100 text-success'
              : 'bg-secondary-100 text-secondary-600',
          ].join(' ')}>
            {progress}% complete
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-bg-elevated">
          <div
            className="h-full rounded-full bg-gradient-to-r from-secondary-600 to-success transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="px-6 py-2">
        {items.map(({ label, verified, description }) => (
          <VerificationItem
            key={label}
            label={label}
            verified={verified}
            description={description}
          />
        ))}
      </div>
    </div>
  );
}

export default SellerVerificationCard;
