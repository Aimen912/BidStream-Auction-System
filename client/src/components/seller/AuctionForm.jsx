import { useEffect, useRef, useState } from 'react';
import { listCategories } from '../../api/categories';
import { uploadAuctionImages } from '../../api/auctions';

const AUCTION_CONDITIONS = ['New', 'Like New', 'Excellent', 'Good', 'Fair'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nowLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function localToISO(localStr) {
  if (!localStr) return undefined;
  return new Date(localStr).toISOString();
}

// ─── Field wrapper ─────────────────────────────────────────────────────────────

function Field({ label, htmlFor, required, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-text-secondary">
        {label}
        {required && <span className="ml-0.5 text-danger" aria-hidden="true">*</span>}
      </label>
      {children}
      {error  && <p className="text-xs text-danger">{error}</p>}
      {!error && hint && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  );
}

const inputBase = [
  'w-full rounded-xl border bg-bg-card px-4 py-2.5',
  'text-sm text-text-primary placeholder:text-text-muted',
  'outline-none transition-all duration-150',
  'focus:ring-2 focus:ring-secondary-500/20',
].join(' ');

function inputCls(hasError) {
  return [inputBase, hasError ? 'border-danger' : 'border-border focus:border-secondary-600'].join(' ');
}
const selectBase = [inputBase, 'cursor-pointer appearance-none border-border focus:border-secondary-600'].join(' ');

// ─── Image Upload Section ──────────────────────────────────────────────────────

function ImageUploadSection({ auctionId, savedImages = [], onNewImages, pendingFilesRef }) {
  const fileRef = useRef(null);
  const [previews, setPreviews]       = useState([]);
  const [uploading, setUploading]     = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploaded, setUploaded]       = useState(savedImages);

  function handleFiles(files) {
    const allowed = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (allowed.length === 0) return;
    if (uploaded.length + previews.length + allowed.length > 8) {
      setUploadError('Maximum 8 images allowed');
      return;
    }
    setUploadError('');
    const newPreviews = allowed.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setPreviews((prev) => {
      const updated = [...prev, ...newPreviews];
      // Sync raw File objects to parent ref so CreateAuction can upload them
      if (pendingFilesRef) {
        pendingFilesRef.current = updated.map((p) => p.file);
      }
      return updated;
    });
  }

  function removePreview(idx) {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      const updated = prev.filter((_, i) => i !== idx);
      if (pendingFilesRef) {
        pendingFilesRef.current = updated.map((p) => p.file);
      }
      return updated;
    });
  }

  async function handleUpload() {
    if (previews.length === 0) return;
    if (!auctionId) {
      setUploadError('Save the auction first, then images will be uploaded automatically.');
      return;
    }
    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      previews.forEach((p) => formData.append('images', p.file));
      const result = await uploadAuctionImages(auctionId, formData);
      const newImages = result.images || [];
      setUploaded(newImages);
      onNewImages?.(newImages);
      previews.forEach((p) => URL.revokeObjectURL(p.url));
      setPreviews([]);
      if (pendingFilesRef) pendingFilesRef.current = [];
    } catch (err) {
      setUploadError(err?.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  // Called from parent after auction is created — auto-upload pending images
  ImageUploadSection.uploadPending = async (id) => {
    if (previews.length === 0 || !id) return;
    await handleUpload();
  };

  function handleDrop(e) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  const totalCount = uploaded.length + previews.length;

  return (
    <div className="rounded-2xl border border-border bg-bg-card shadow-card">
      <div className="border-b border-border-subtle px-6 py-4">
        <h3 className="text-base font-bold text-text-primary">Images</h3>
        <p className="text-xs text-text-muted">
          High-quality images increase buyer confidence. Max 8 images (PNG, JPG, WEBP).
        </p>
      </div>

      <div className="p-6 flex flex-col gap-4">

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-bg-surface py-10 text-center cursor-pointer transition-colors duration-150 hover:border-secondary-600/50 hover:bg-secondary-600/5"
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <p className="text-sm font-semibold text-text-secondary">Click or drag images here</p>
          <p className="mt-1 text-xs text-text-muted">PNG, JPG, WEBP — up to 10 MB each · Max 8 images</p>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* Already uploaded images */}
        {uploaded.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold text-text-muted uppercase tracking-wide">Saved Images</p>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
              {uploaded.map((url, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-xl border border-border bg-bg-elevated">
                  <img src={url} alt={`Image ${i + 1}`} className="h-full w-full object-cover"/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending previews */}
        {previews.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold text-text-muted uppercase tracking-wide">
              Selected ({previews.length}) — not yet uploaded
            </p>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
              {previews.map((p, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-xl border-2 border-primary-600/40 bg-bg-elevated group">
                  <img src={p.url} alt={`Preview ${i + 1}`} className="h-full w-full object-cover"/>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removePreview(i); }}
                    className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove"
                  >
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Upload button */}
            {auctionId && (
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="mt-3 flex items-center gap-2 rounded-xl bg-secondary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-secondary-500 disabled:opacity-60"
              >
                {uploading && (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                )}
                {uploading ? 'Uploading…' : `Upload ${previews.length} Image${previews.length !== 1 ? 's' : ''}`}
              </button>
            )}

            {!auctionId && (
              <p className="mt-2 text-xs text-text-muted">
                Images will be uploaded automatically when you save.
              </p>
            )}
          </div>
        )}

        {/* Count indicator */}
        <p className="text-xs text-text-muted">
          {totalCount} / 8 images
          {totalCount >= 8 && <span className="ml-1 text-danger font-semibold">· Limit reached</span>}
        </p>

        {uploadError && <p className="text-xs text-danger">{uploadError}</p>}
      </div>
    </div>
  );
}

// ─── AuctionForm ──────────────────────────────────────────────────────────────

function AuctionForm({ initial = {}, onDraft, onPublish, isEdit = false, loading: saving = false, pendingFilesRef }) {
  const [categories, setCategories] = useState([]);
  const [errors, setErrors]         = useState({});
  const [auctionImages, setAuctionImages] = useState(initial.images || []);
  const [savedAuctionId, setSavedAuctionId] = useState(
    initial._id || initial.id || null
  );

  useEffect(() => {
    let active = true;
    listCategories({ status: 'active' })
      .then(({ categories: cats }) => { if (active) setCategories(cats || []); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const [form, setForm] = useState({
    title:         initial.title         ?? '',
    category:      initial.category      ?? '',
    description:   initial.description   ?? '',
    startingPrice: initial.startingPrice ?? '',
    minIncrement:  initial.minIncrement  ?? '',
    reservePrice:  initial.reservePrice  ?? '',
    buyNowPrice:   initial.buyNowPrice   ?? '',
    startDate:     initial.startDate     ?? '',
    endDate:       initial.endDate       ?? '',
    condition:     initial.condition     ?? '',
    location:      initial.location      ?? '',
    shipping:      initial.shipping      ?? '',
    tags:          Array.isArray(initial.tags) ? initial.tags.join(', ') : (initial.tags ?? ''),
  });

  const set = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  // ── Validation ────────────────────────────────────────────────────────────

  function validate() {
    const errs = {};
    if (!form.title.trim())       errs.title       = 'Auction title is required';
    if (!form.category)           errs.category    = 'Please select a category';
    if (!form.condition)          errs.condition   = 'Please select item condition';
    if (!form.description.trim()) errs.description = 'Description is required';
    const sp = parseFloat(form.startingPrice);
    if (!form.startingPrice || isNaN(sp) || sp < 0)
      errs.startingPrice = 'Enter a valid starting price';
    if (!form.startDate) errs.startDate = 'Start date & time is required';
    if (!form.endDate)   errs.endDate   = 'End date & time is required';
    // Only validate date ordering for new auctions — edit mode may have past dates
    if (!isEdit && form.startDate && form.endDate) {
      if (new Date(form.endDate) <= new Date(form.startDate))
        errs.endDate = 'End time must be after start time';
    }
    return errs;
  }

  // ── Payload ───────────────────────────────────────────────────────────────

  function buildPayload() {
    const bnp = parseFloat(form.buyNowPrice);

    const payload = {
      title:         form.title.trim(),
      category:      form.category,
      description:   form.description.trim(),
      startingPrice: parseFloat(form.startingPrice) || 0,
      minIncrement:  parseFloat(form.minIncrement)  || 1,
      reservePrice:  parseFloat(form.reservePrice)  || 0,
      buyNowPrice:   !isNaN(bnp) && bnp > 0 ? bnp : null,
      condition:     form.condition,
      location:      form.location.trim(),
      shipping:      form.shipping || 'Domestic',
      tags:          form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    // Only include startTime / endTime when seller actually changed them.
    // Compare against what was originally loaded from the DB (initial.*Date).
    // In edit mode, if the field is unchanged, omit it from the payload entirely
    // so the backend keeps the original value.
    const originalStart = initial.startDate ?? '';
    const originalEnd   = initial.endDate   ?? '';

    if (form.startDate !== originalStart && form.startDate) {
      payload.startTime = localToISO(form.startDate);
    }
    if (form.endDate !== originalEnd && form.endDate) {
      payload.endTime = localToISO(form.endDate);
    }
    // For new auctions (not edit) always include times
    if (!isEdit) {
      payload.startTime = localToISO(form.startDate);
      payload.endTime   = localToISO(form.endDate);
    }

    return payload;
  }

  function handleDraft() {
    onDraft?.(buildPayload());
  }

  function handlePublish() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      document.getElementById(`f-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setErrors({});
    onPublish?.(buildPayload(), setSavedAuctionId);
  }

  const minDateTime = nowLocal();

  return (
    <div className="flex flex-col gap-6">

      {/* ── Basic Info ── */}
      <div className="rounded-2xl border border-border bg-bg-card shadow-card">
        <div className="border-b border-border-subtle px-6 py-4">
          <h3 className="text-base font-bold text-text-primary">Basic Information</h3>
          <p className="text-xs text-text-muted">Core details buyers will see first.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">

          <div className="sm:col-span-2">
            <Field label="Auction Title" htmlFor="f-title" required error={errors.title}>
              <input id="f-title" type="text" value={form.title} onChange={set('title')}
                placeholder="e.g. Vintage Leica M6 Film Camera" className={inputCls(errors.title)}/>
            </Field>
          </div>

          <Field label="Category" htmlFor="f-category" required error={errors.category}>
            <div className="relative">
              <select id="f-category" value={form.category} onChange={set('category')}
                className={[selectBase, errors.category ? 'border-danger' : ''].join(' ')}>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </Field>

          <Field label="Condition" htmlFor="f-condition" required error={errors.condition}>
            <div className="relative">
              <select id="f-condition" value={form.condition} onChange={set('condition')}
                className={[selectBase, errors.condition ? 'border-danger' : ''].join(' ')}>
                <option value="">Select condition</option>
                {AUCTION_CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </Field>

          <div className="sm:col-span-2">
            <Field label="Description" htmlFor="f-description" required error={errors.description}
              hint="Describe the item's history, condition, and what's included.">
              <textarea id="f-description" rows={4} value={form.description} onChange={set('description')}
                placeholder="Provide a detailed description…"
                className={[inputCls(errors.description), 'resize-none'].join(' ')}/>
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Tags" htmlFor="f-tags" hint="Comma-separated keywords to help buyers find your item.">
              <input id="f-tags" type="text" value={form.tags} onChange={set('tags')}
                placeholder="e.g. camera, vintage, film" className={inputCls(false)}/>
            </Field>
          </div>
        </div>
      </div>

      {/* ── Pricing ── */}
      <div className="rounded-2xl border border-border bg-bg-card shadow-card">
        <div className="border-b border-border-subtle px-6 py-4">
          <h3 className="text-base font-bold text-text-primary">Pricing</h3>
          <p className="text-xs text-text-muted">Set your starting price and minimum bid increment.</p>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Starting Price" htmlFor="f-startingPrice" required error={errors.startingPrice}
              hint="The lowest price bidding can begin from.">
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-text-muted">$</span>
                <input id="f-startingPrice" type="number" min="0" step="0.01"
                  value={form.startingPrice} onChange={set('startingPrice')}
                  placeholder="0.00"
                  className={[inputCls(errors.startingPrice), 'pl-8'].join(' ')}/>
              </div>
            </Field>

            <Field label="Minimum Bid Increment" htmlFor="f-minIncrement"
              hint="Each new bid must exceed the last by at least this amount.">
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-text-muted">$</span>
                <input id="f-minIncrement" type="number" min="1" step="0.01"
                  value={form.minIncrement} onChange={set('minIncrement')}
                  placeholder="1.00"
                  className={[inputCls(false), 'pl-8'].join(' ')}/>
              </div>
            </Field>
          </div>
        </div>
      </div>

      {/* ── Schedule ── */}
      <div className="rounded-2xl border border-border bg-bg-card shadow-card">
        <div className="border-b border-border-subtle px-6 py-4">
          <h3 className="text-base font-bold text-text-primary">Schedule</h3>
          <p className="text-xs text-text-muted">When does the auction start and end?</p>
        </div>
        <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
          <Field label="Start Date & Time" htmlFor="f-startDate" required error={errors.startDate}>
            <input id="f-startDate" type="datetime-local"
              value={form.startDate} onChange={set('startDate')}
              min={minDateTime} className={inputCls(errors.startDate)}/>
          </Field>
          <Field label="End Date & Time" htmlFor="f-endDate" required error={errors.endDate}>
            <input id="f-endDate" type="datetime-local"
              value={form.endDate} onChange={set('endDate')}
              min={form.startDate || minDateTime} className={inputCls(errors.endDate)}/>
          </Field>
        </div>
      </div>

      {/* ── Logistics ── */}
      <div className="rounded-2xl border border-border bg-bg-card shadow-card">
        <div className="border-b border-border-subtle px-6 py-4">
          <h3 className="text-base font-bold text-text-primary">Location & Shipping</h3>
        </div>
        <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
          <Field label="Location" htmlFor="f-location" hint="Where the item is currently located.">
            <input id="f-location" type="text" value={form.location} onChange={set('location')}
              placeholder="e.g. Lahore, Pakistan" className={inputCls(false)}/>
          </Field>
          <Field label="Shipping Options" htmlFor="f-shipping">
            <div className="relative">
              <select id="f-shipping" value={form.shipping} onChange={set('shipping')} className={selectBase}>
                <option value="">Select shipping</option>
                {['Worldwide', 'Domestic', 'Local Only', 'No Shipping'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </Field>
        </div>
      </div>

      {/* ── Images ── */}
      <ImageUploadSection
        auctionId={savedAuctionId}
        savedImages={auctionImages}
        onNewImages={setAuctionImages}
        pendingFilesRef={pendingFilesRef}
      />

      {/* ── Action buttons ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-bg-card px-6 py-4 shadow-card">
        <p className="text-xs text-text-muted"><span className="text-danger">*</span> Required fields</p>
        <div className="flex items-center gap-3">
          <button type="button" onClick={handleDraft} disabled={saving}
            className="rounded-xl border border-border bg-bg-card px-5 py-2.5 text-sm font-semibold text-text-secondary shadow-card transition-all duration-150 hover:border-border hover:bg-bg-surface disabled:opacity-60">
            {isEdit ? 'Save as Draft' : 'Save Draft'}
          </button>
          <button type="button" onClick={handlePublish} disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-secondary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-card transition-colors duration-150 hover:bg-secondary-500 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed">
            {saving && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            )}
            {isEdit ? 'Save Changes' : 'Publish Auction'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuctionForm;
