"use client";

// Fallback "download PDF" for reports that don't ship a static PDF: opens the
// browser print dialog (→ Save as PDF). Print CSS in research.css strips the
// site chrome so the output is just the report.
export default function PrintButton({ className, label }: { className?: string; label: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.print()}>
      {label}
    </button>
  );
}
