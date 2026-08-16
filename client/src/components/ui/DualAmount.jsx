import { fmtUSD, fmtPKR } from '../../utils/currency';

/**
 * DualAmount — renders a monetary value in both USD (primary) and PKR (secondary).
 *
 * Usage (block / card context):
 *   <DualAmount value={1240} className="text-2xl font-bold text-auction" />
 *
 *   renders:
 *     $1,240          ← inherits className
 *     ≈ ₨346,360      ← always small / muted below
 *
 * Usage (inline / compact context — pass inline prop):
 *   <DualAmount value={1240} inline />
 *
 *   renders:
 *     $1,240 · ₨346,360   ← on one line
 *
 * @param {number}  value     – the USD amount
 * @param {boolean} [cents]   – show two decimal places on the USD amount
 * @param {boolean} [inline]  – render as a single inline line instead of block
 * @param {string}  [className] – applied to the outer element / USD span
 */
function DualAmount({ value = 0, cents = false, inline = false, className = '' }) {
  const usd = fmtUSD(value, cents);
  const pkr = fmtPKR(value);

  if (inline) {
    return (
      <span className={className}>
        {usd}
        <span className="ml-1.5 text-[0.7em] font-medium opacity-60">· {pkr}</span>
      </span>
    );
  }

  return (
    <span className="flex flex-col leading-tight">
      <span className={className}>{usd}</span>
      <span className="mt-0.5 text-[0.65em] font-medium text-text-muted">≈ {pkr}</span>
    </span>
  );
}

export default DualAmount;
