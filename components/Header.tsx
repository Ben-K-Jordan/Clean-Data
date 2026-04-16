"use client";

export default function Header() {
  return (
    <header className="bg-[#1a1a1a]">
      <div className="px-4 py-2 flex items-center justify-between">
        {/* Left: logo + store name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#95BF47] flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-white/70 text-[13px] font-medium hidden sm:block">
            Clean Data
          </span>
        </div>

        {/* Center: search bar */}
        <div className="flex-1 max-w-xl mx-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white/40 text-sm cursor-pointer hover:bg-white/15 transition-colors">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search</span>
          </div>
        </div>

        {/* Right: notifications + avatar */}
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:bg-white/10 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="w-7 h-7 rounded-full bg-[#36a3ff] flex items-center justify-center">
            <span className="text-white text-[11px] font-semibold">BJ</span>
          </div>
        </div>
      </div>
    </header>
  );
}
