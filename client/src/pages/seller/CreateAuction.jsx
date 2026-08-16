import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import PageHeader   from '../../components/layout/PageHeader';
import AuctionForm  from '../../components/seller/AuctionForm';
import { createAuction, uploadAuctionImages } from '../../api/auctions';

function CreateAuction() {
  const navigate        = useNavigate();
  const [error,  setError]  = useState('');
  const [saving, setSaving] = useState(false);
  // Ref to access pending image files from AuctionForm
  const pendingFilesRef = useRef([]);

  async function handleDraft(formData) {
    setSaving(true);
    setError('');
    try {
      await createAuction({ ...formData, status: 'draft' });
      navigate('/seller/my-auctions');
    } catch (err) {
      const data = err?.response?.data;
      setError(data?.errors?.map((e) => e.message).join(' · ') || data?.message || 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish(formData) {
    setSaving(true);
    setError('');
    try {
      // Step 1: Create the auction
      const result = await createAuction({ ...formData, status: 'upcoming' });
      const newId  = result.auction?._id || result.auction?.id || result._id;

      // Step 2: Upload any pending images right after creation
      if (newId && pendingFilesRef.current.length > 0) {
        try {
          const fd = new FormData();
          pendingFilesRef.current.forEach((file) => fd.append('images', file));
          await uploadAuctionImages(newId, fd);
        } catch {
          // Image upload failed silently — auction still created
        }
      }

      navigate('/seller/my-auctions');
    } catch (err) {
      const data = err?.response?.data;
      setError(data?.errors?.map((e) => e.message).join(' · ') || data?.message || 'Failed to publish auction');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Create Auction"
        subtitle="List a new item for bidding on BidStream."
        breadcrumbs={[
          { label: 'Home',             href: '/'                   },
          { label: 'Seller Dashboard', href: '/seller/dashboard'   },
          { label: 'My Auctions',      href: '/seller/my-auctions' },
          { label: 'Create Auction'                                 },
        ]}
        actions={
          <Link to="/seller/my-auctions"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-card px-4 py-2 text-sm font-semibold text-text-secondary shadow-card transition-all duration-150 hover:border-border no-underline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to My Auctions
          </Link>
        }
      />

      {error && (
        <div className="rounded-xl border border-danger/20 bg-danger-100 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <AuctionForm
        initial={{}}
        onDraft={handleDraft}
        onPublish={handlePublish}
        isEdit={false}
        loading={saving}
        pendingFilesRef={pendingFilesRef}
      />
    </div>
  );
}

export default CreateAuction;
