/**
 * Auction permission helpers.
 *
 * Rules (updated):
 *   - Seller CAN edit/delete if:
 *       status is 'draft' OR 'upcoming'  (auction has NOT started yet)
 *       (approvalStatus can be anything — pending, approved, rejected)
 *   - Seller CANNOT edit/delete once auction is live, ending_soon, ended, sold, or cancelled
 *   - Admin always retains full permissions
 *
 * Side-effect handled on backend: if an approved auction is edited,
 * approvalStatus is automatically reset to 'pending' and admin is notified.
 */

/** Statuses where the auction has started — permanently locked for seller */
const LIVE_OR_ENDED = new Set(['live', 'ending_soon', 'ended', 'sold', 'cancelled']);

/**
 * Returns true if the seller is allowed to edit this auction.
 */
export function canEdit(auction, role = 'seller') {
  if (role === 'admin') return true;
  if (!auction) return false;

  // Once started or ended — no edits
  if (LIVE_OR_ENDED.has(auction.status)) return false;

  // draft or upcoming — allowed regardless of approvalStatus
  return true;
}

/**
 * Returns true if the seller is allowed to delete this auction.
 * Same rules as canEdit.
 */
export function canDelete(auction, role = 'seller') {
  return canEdit(auction, role);
}

/**
 * Returns a human-readable reason why edit/delete is locked.
 */
export function lockReason(auction, role = 'seller') {
  if (role === 'admin') return null;
  if (!auction) return null;

  if (LIVE_OR_ENDED.has(auction.status)) {
    const label = {
      live:         'Live',
      ending_soon:  'Ending Soon',
      ended:        'Ended',
      sold:         'Sold',
      cancelled:    'Cancelled',
    }[auction.status] || auction.status;
    return `${label} auctions cannot be modified`;
  }
  return null;
}

/**
 * Returns true if editing this auction will cause a re-review warning.
 * (approved + upcoming → edit resets approval to pending)
 */
export function editResetsApproval(auction, role = 'seller') {
  if (role === 'admin') return false;
  return auction?.approvalStatus === 'approved' && auction?.status === 'upcoming';
}
