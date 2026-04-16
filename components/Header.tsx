"use client";

export default function Header() {
  return (
    <header className="bg-[#1a1a1a]">
      <div className="px-6 py-3 flex items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#95BF47] flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white font-semibold text-[15px] tracking-tight">
              Shopify
            </span>
            <svg className="w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white/60 text-[13px]">
              Clean Data
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
