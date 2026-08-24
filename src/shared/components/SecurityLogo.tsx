/**
 * The course mark: a shield with a keyhole — the universal "security" motif.
 * Drawn as a single monochrome path filled with `currentColor`, so callers set
 * the colour (the Navbar and Footer render it in brand green) and it stays
 * crisp in both light and dark themes. The evenodd rule carves the shield into
 * an outline band with a solid keyhole at its centre. Size is controlled by the
 * caller via `className`.
 */
export function SecurityLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.62 1.55a1.5 1.5 0 0 1 .76 0l7.5 2.1A1.5 1.5 0 0 1 21 5.1v5.73c0 5.05-3.36 9.18-8.4 11.55a1.4 1.4 0 0 1-1.2 0C6.36 20.01 3 15.88 3 10.83V5.1a1.5 1.5 0 0 1 1.12-1.45l7.5-2.1Zm.38 2.05L5.5 5.42v5.41c0 4.02 2.6 7.49 6.5 9.61 3.9-2.12 6.5-5.59 6.5-9.61V5.42L12 3.6Zm0 3.9a2.25 2.25 0 0 0-1.13 4.2v2.55a1.13 1.13 0 0 0 2.26 0V11.7A2.25 2.25 0 0 0 12 7.5Z"
      />
    </svg>
  );
}
