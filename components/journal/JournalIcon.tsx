export type JournalIconName =
  | "overview" | "trades" | "analytics" | "playbook" | "settings"
  | "upload" | "plus" | "search" | "calendar" | "account" | "chevron"
  | "dots" | "arrow-left" | "arrow-right" | "check" | "close" | "download"
  | "sun" | "moon" | "chart" | "trend" | "target" | "grid" | "split" | "zap";

export default function JournalIcon({ name, size = 20 }: { name: JournalIconName; size?: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg className="j-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <g {...common}>
        {name === "overview" || name === "trend" || name === "chart" ? <><path d="M3 18l5-6 4 3 7-9"/><path d="M16 6h3v3"/></> : null}
        {name === "trades" ? <><path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></> : null}
        {name === "zap" ? <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="none"/> : null}
        {name === "target" ? <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></> : null}
        {name === "grid" || name === "split" ? <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></> : null}
        {name === "analytics" ? <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></> : null}
        {name === "playbook" ? <><path d="M3 5.5A3.5 3.5 0 0 1 6.5 2H11v18H6.5A3.5 3.5 0 0 0 3 23z"/><path d="M21 5.5A3.5 3.5 0 0 0 17.5 2H13v18h4.5A3.5 3.5 0 0 1 21 23z"/></> : null}
        {name === "settings" ? <><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a8 8 0 0 0-1.8-1L14.4 3h-4.8l-.4 3.1a8 8 0 0 0-1.8 1l-2.4-1-2 3.4L5.1 11a7 7 0 0 0 0 2L3 14.5l2 3.4 2.4-1a8 8 0 0 0 1.8 1l.4 3.1h4.8l.4-3.1a8 8 0 0 0 1.8-1l2.4 1 2-3.4L18.9 13c.1-.3.1-.7.1-1z"/></> : null}
        {name === "upload" ? <><path d="M12 16V3M7 8l5-5 5 5"/><path d="M4 14v6h16v-6"/></> : null}
        {name === "download" ? <><path d="M12 3v13M7 11l5 5 5-5"/><path d="M4 14v6h16v-6"/></> : null}
        {name === "plus" ? <path d="M12 5v14M5 12h14"/> : null}
        {name === "search" ? <><circle cx="10.5" cy="10.5" r="6.5"/><path d="M16 16l5 5"/></> : null}
        {name === "calendar" ? <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></> : null}
        {name === "account" ? <><circle cx="12" cy="8" r="3"/><path d="M5 21a7 7 0 0 1 14 0"/></> : null}
        {name === "chevron" ? <path d="M9 6l6 6-6 6"/> : null}
        {name === "dots" ? <><circle cx="12" cy="5" r=".8" fill="currentColor"/><circle cx="12" cy="12" r=".8" fill="currentColor"/><circle cx="12" cy="19" r=".8" fill="currentColor"/></> : null}
        {name === "arrow-left" ? <path d="M15 5l-7 7 7 7"/> : null}
        {name === "arrow-right" ? <path d="M9 5l7 7-7 7"/> : null}
        {name === "check" ? <path d="M5 12l4 4L19 6"/> : null}
        {name === "close" ? <path d="M5 5l14 14M19 5L5 19"/> : null}
        {name === "sun" ? <><circle cx="12" cy="12" r="4.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/></> : null}
        {name === "moon" ? <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/> : null}
      </g>
    </svg>
  );
}

