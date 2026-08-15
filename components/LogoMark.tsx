export default function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`logo-mark ${className}`.trim()}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 4H27V10H10V22H27V28H4V4Z" fill="currentColor" />
      <path d="M22 13H28V19H22V13Z" fill="var(--gold)" />
    </svg>
  );
}
