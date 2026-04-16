"use client";

export default function Header() {
  return (
    <header className="bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Shopify bag logo - proper green bag with S */}
          <svg className="w-8 h-8" viewBox="0 0 40 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M35.5 10.8c0-.1-.1-.2-.2-.2-.1 0-1.2-.1-1.2-.1s-1.6-1.5-1.7-1.7c-.1-.1-.2-.1-.3-.1h-.1l-.8.3c-.5-1.4-1.3-2.7-2.8-2.7h-.2c-.4-.5-.9-.8-1.4-.8-3.5.1-5.2 4.4-5.7 6.6-1.5.5-2.6.8-2.7.8-.8.3-.9.3-1 1.1-.1.6-2.3 17.8-2.3 17.8l18.4 3.2 8-1.7s-2.2-17.4-2.2-17.5zm-7.1-1.2c-.5.2-1.2.4-1.9.6v-.4c0-1.2-.2-2.2-.4-3 1.1.2 1.8 1.4 2.3 2.8zm-3.4-2.5c.3.7.5 1.8.5 3.3v.2c-1.2.4-2.6.8-3.9 1.2.7-2.9 2.2-4.3 3.4-4.7zm-1.4-1.6c.2 0 .4.1.6.2-1.6.8-3.4 2.7-4.1 6.5-1.1.3-2.1.7-3.1 1C17.8 9.9 19.6 5.6 23.6 5.5z" fill="#95BF47"/>
            <path d="M35.3 10.6c-.1 0-1.2-.1-1.2-.1s-1.6-1.5-1.7-1.7c-.1-.1-.1-.1-.2-.1l-2.6 19.3 8-1.7s-2.2-17.4-2.2-17.5c0-.2-.1-.2-.1-.2z" fill="#5E8E3E"/>
            <path d="M27.2 16.3l-.7 2.8s-.8-.4-1.8-.4c-1.4.1-1.4 1-1.4 1.2.1 1.3 3.5 1.6 3.6 4.6.1 2.4-1.3 4-3.3 4.1-2.4.2-3.8-1.3-3.8-1.3l.5-2.2s1.3 1 2.4 1c.7 0 1-.6 1-1-.1-1.7-2.8-1.6-3-4.4-.1-2.3 1.4-4.7 4.8-4.9 1.3-.1 2 .2 2 .2l-.3.3z" fill="#fff"/>
          </svg>
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
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-white/50 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Demo
          </div>
        </div>
      </div>
    </header>
  );
}
