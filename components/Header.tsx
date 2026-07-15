"use client";

import { useState } from "react";

export default function Header() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="bg-white border-b border-v-border">
      <div className="px-4 py-2 flex items-center justify-between">
        {/* Left: logo */}
        <a href="https://ventura.ai" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
          <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.6 10.3C4.2 11.4 7 14.2 9.6 19.8C13.4 12.8 18 6.6 23.2 2.6C17.8 5.4 13.4 9.2 10.2 13.8C7.8 11.2 4.6 10.1 1.6 10.3Z"
              fill="#0e1e50"
            />
          </svg>
          <span className="text-[#0e1e50] text-[17px] font-bold tracking-tight">ventura</span>
        </a>

        {/* Center: search bar */}
        <div className="flex-1 max-w-xl mx-6">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              searchFocused
                ? "bg-white ring-1 ring-[#0e1e50]/30 shadow-ventura-sm"
                : "bg-gray-100 hover:bg-gray-200/70"
            }`}
          >
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search"
              className="bg-transparent text-v-text placeholder:text-gray-400 outline-none w-full text-sm"
            />
          </div>
        </div>

        {/* Right: notifications + avatar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              onMouseEnter={() => setShowNotif(true)}
              onMouseLeave={() => setShowNotif(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            {showNotif && (
              <div className="absolute top-full right-0 mt-1.5 px-3 py-2 bg-white border border-v-border rounded-lg shadow-ventura-md text-[12px] text-v-text whitespace-nowrap z-50 animate-fade-in">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#047b5d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  You&apos;re all caught up
                </div>
              </div>
            )}
          </div>
          <div className="w-7 h-7 rounded-full bg-[#0e1e50] flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-[#0e1e50]/30 hover:ring-offset-1 hover:ring-offset-white transition-all hover:scale-110">
            <span className="text-white text-[11px] font-semibold">BJ</span>
          </div>
        </div>
      </div>
    </header>
  );
}
