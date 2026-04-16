"use client";

import { useState } from "react";

export default function Header() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="bg-[#1a1a1a]">
      <div className="px-4 py-2 flex items-center justify-between">
        {/* Left: logo + store name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#95BF47] flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-white/70 text-[13px] font-medium hidden sm:block">
            Shopify
          </span>
        </div>

        {/* Center: search bar */}
        <div className="flex-1 max-w-xl mx-6">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              searchFocused
                ? "bg-white/20 ring-1 ring-white/30"
                : "bg-white/10 hover:bg-white/15"
            }`}
          >
            <svg className="w-4 h-4 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search"
              className="bg-transparent text-white/90 placeholder:text-white/40 outline-none w-full text-sm caret-white"
            />
          </div>
        </div>

        {/* Right: notifications + avatar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:bg-white/10 transition-colors"
              onMouseEnter={() => setShowNotif(true)}
              onMouseLeave={() => setShowNotif(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            {showNotif && (
              <div className="absolute top-full right-0 mt-1.5 px-3 py-2 bg-white rounded-lg shadow-polaris-md text-[12px] text-p-text whitespace-nowrap z-50 animate-fade-in">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#047b5d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  You&apos;re all caught up
                </div>
              </div>
            )}
          </div>
          <div className="w-7 h-7 rounded-full bg-[#36a3ff] flex items-center justify-center">
            <span className="text-white text-[11px] font-semibold">BJ</span>
          </div>
        </div>
      </div>
    </header>
  );
}
