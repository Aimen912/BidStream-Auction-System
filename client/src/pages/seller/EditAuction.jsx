import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import PageHeader  from '../../components/layout/PageHeader';
import AuctionForm from '../../components/seller/AuctionForm';
import { getAuction, updateAuction, uploadAuctionImages } from '../../api/auctions';
import { editResetsApproval } from '../../utils/auctionPermissions';
import { currency, fmtPKR } from '../../utils/currency';

function EditAuction() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [auction,  setAuction]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [notFound, setNotFound] = useState(false);

  // Holds new image File objects picked in ImageUploadSection before save
  const pendingFilesRef = useRef([]);

  // Fetch auction from backend
  useEffect(() => {
    let active = true;
    getAuction(id)
      .then(({ auction: a }) => {
        if (!active) return;
        setAuction(a);
      })
      .catch((err) => {
        if (!active) return;
        if (err?.response?.status === 404) setNotFound(true);
        else setError(err?.response?.data?.message || 'Failed to load auction');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  async function handleSave(formData) {
    setSaving(true);
    setError('');
    try {
      // Step 1: Save auction fields
      await updateAuction(id, formData);

      // Step 2: Upload any new images that were picked — replace old ones in edit
      if (pendingFilesRef.current?.length > 0) {
        const fd = new FormData();
        pendingFilesRef.current.forEach((file) => fd.append('images', file));
        await uploadAuctionImages(id, fd, { replace: true });
        pendingFilesRef.current = [];
      }

      navigate('/seller/my-auctions');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to update auction';
      setError(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDraft(formData) {
    setSaving(true);
    setError('');
    try {
      await updateAuction(id, { ...formData, status: 'draft' });

      if (pendingFilesRef.current?.length > 0) {
        const fd = new FormData();
        pendingFilesRef.current.forEach((file) => fd.append('images', file));
        await uploadAuctionImages(id, fd, { replace: true });
        pendingFilesRef.current = [];
      }

      navigate('/seller/my-auctions');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save draft');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  }

  // ── Loading ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 rounded-xl bg-navy-100" />
        <div className="h-64 rounded-2xl shimmer-bg motion-safe:animate-shimmer" />
        <div className="h-64 rounded-2xl shimmer-bg motion-safe:animate-shimmer" />
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────

  if (notFound || !auction) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Edit Auction"
          subtitle="Update your auction details."
          breadcrumbs={[
            { label: 'My Auctions', href: '/seller/my-auctions' },
            { label: 'Edit' },
          ]}
        />
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-bg-card py-20 text-center">
          <p className="text-lg font-bold text-text-primary">Auction not found</p>
          <p className="mt-2 text-sm text-text-muted">The auction with ID "{id}" could not be found or you don't have access.</p>
          <Link to="/seller/my-auctions"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-secondary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-colors duration-150 hover:bg-secondary-500 no-underline">
            Back to My Auctions
          </Link>
        </div>
      </div>
    );
  }

  // ── Build initial values for the form ─────────────────────────────────────

  const initial = {
    _id:           auction._id ?? auction.id ?? id,
    title:         auction.title         ?? '',
    category:      auction.category?._id ?? auction.category ?? '',
    description:   auction.description   ?? '',
    startingPrice: auction.startingPrice ?? '',
    minIncrement:  auction.minIncrement  ?? '',
    reservePrice:  auction.reservePrice  ?? '',
    buyNowPrice:   auction.buyNowPrice   ?? '',
    startDate:     auction.startTime ? new Date(auction.startTime).toISOString().slice(0, 16) : '',
    endDate:       auction.endTime   ? new Date(auction.endTime).toISOString().slice(0, 16)   : '',
    condition:     auction.condition ?? '',
    location:      auction.location  ?? '',
    shipping:      auction.shipping  ?? '',
    tags:          (auction.tags ?? []).join(', '),
    images:        auction.images    ?? [],
  };

  return (
    <div className="flex flex-col gap-6">

      <PageHeader
        title="Edit Auction"
        subtitle="Update the details of your auction listing."
        breadcrumbs={[
          { label: 'Home',             href: '/'                   },
          { label: 'Seller Dashboard', href: '/seller/dashboard'   },
          { label: 'My Auctions',      href: '/seller/my-auctions' },
          { label: 'Edit'                                           },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <span className={[
              'rounded-xl border px-3 py-1.5 text-xs font-semibold capitalize',
              auction.status === 'live'     ? 'border-success/30 bg-success-100 text-success'          :
              auction.status === 'draft'    ? 'border-border bg-bg-elevated text-text-muted'           :
              auction.status === 'upcoming' ? 'border-accent-600/30 bg-accent-100 text-accent-600'   :
              'border-secondary-600/30 bg-secondary-100 text-secondary-600',
            ].join(' ')}>
              {auction.status}
            </span>
            <Link to="/seller/my-auctions"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-card px-4 py-2 text-sm font-semibold text-text-secondary shadow-card transition-all duration-150 hover:border-border no-underline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              Back
            </Link>
          </div>
        }
      />

      {/* Error banner */}
      {error && (
        <div className="rounded-xl border border-danger/20 bg-danger-100 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Auction identity strip */}
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-bg-card p-4 shadow-card">
        {auction.images?.[0]
          ? <img src={auction.images[0]} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
          : <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br from-secondary-600 to-primary-700" />
        }
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-text-primary">{auction.title}</p>
          <p className="text-xs text-text-muted">
            {auction.category?.name || '—'} · {auction.bids ?? 0} bids ·{' '}
            {auction.currentBid > 0
              ? `Current bid: ${currency(auction.currentBid)} · ≈ ${fmtPKR(auction.currentBid)}`
              : 'No bids yet'}
          </p>
        </div>
      </div>

      {/* Re-review warning — shown when editing an already-approved upcoming auction */}
      {editResetsApproval(auction) && (
        <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning-100 px-5 py-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mt-0.5 shrink-0 text-warning" aria-hidden="true">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div>
            <p className="text-sm font-bold text-warning">Re-review required</p>
            <p className="mt-0.5 text-xs text-amber-700 leading-relaxed">
              This auction is already approved. Saving changes will reset it to <strong>Pending Review</strong> and hide it from buyers until the admin re-approves it.
            </p>
          </div>
        </div>
      )}

      {/* Form pre-filled with real auction data */}
      <AuctionForm
        initial={initial}
        onDraft={handleDraft}
        onPublish={handleSave}
        isEdit={true}
        loading={saving}
        pendingFilesRef={pendingFilesRef}
      />
    </div>
  );
}

export default EditAuction;
