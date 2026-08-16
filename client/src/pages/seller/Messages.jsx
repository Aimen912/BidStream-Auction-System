// Seller Messages re-uses the shared real-API Messages page.
// Both buyer (/messages) and seller (/seller/messages) render the same
// component inside their respective layouts — sidebar detects /seller prefix.
export { default } from '../messages/Messages';
