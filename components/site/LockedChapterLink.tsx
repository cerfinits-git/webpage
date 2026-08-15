"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function LockedChapterLink({
  children,
  href,
  isLoggedIn
}: {
  children: React.ReactNode;
  href: string;
  isLoggedIn: boolean;
}) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      window.dispatchEvent(new CustomEvent('open-login'));
    } else {
      router.push(href);
    }
  };

  return (
    <a 
      className="tl" 
      href={href} 
      onClick={handleClick} 
      style={{ display: 'flex', alignItems: 'center' }} 
      title={isLoggedIn ? "Premium Required - Click to Upgrade" : "Login to continue"}
    >
      {children}
    </a>
  );
}
