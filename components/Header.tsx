"use client";

export default function Header() {
  return (
    <header className="border-b border-ventura-border bg-ventura-surface/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8" viewBox="0 0 109.5 124.5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M95.6 28.2c-.1-.8-.7-1.2-1.2-1.3-1.5-.2-3.1-.3-3.1-.3s-4.2-4.1-4.6-4.5c-.4-.4-1.3-.3-1.6-.2 0 0-.9.3-2.3.7-.5-1.5-1.1-3.3-2-5.1-2.9-5.6-7.2-8.5-12.3-8.5h-.3c-1.2-1.5-2.6-2.2-3.9-2.2-10.2.3-15.1 12.8-16.9 19.3-4.5 1.4-7.7 2.4-8.1 2.5-2.5.8-2.6.9-2.9 3.3-.2 1.8-6.8 52.5-6.8 52.5l54.2 9.4 23.4-5.1S95.7 29 95.6 28.2zM67.3 20.8c-1.6.5-3.5 1.1-5.5 1.7v-1.2c0-3.5-.5-6.4-1.3-8.7 3.2.5 5.3 4 6.8 8.2zm-10-7.6c.9 2.2 1.5 5.3 1.5 9.6v.6c-3.6 1.1-7.5 2.3-11.5 3.6 2.2-8.5 6.5-12.7 10-13.8zm-4-4.6c.7 0 1.3.2 1.9.7-4.8 2.2-9.9 7.9-12.1 19.2-3.2 1-6.3 2-9.2 2.8C36 22.5 41.3 8.9 53.3 8.6z" fill="#95BF47"/>
            <path d="M94.4 26.9c-1.5-.2-3.1-.3-3.1-.3s-4.2-4.1-4.6-4.5c-.2-.2-.4-.3-.6-.3l-7.7 56.9 23.4-5.1S95.7 29 95.6 28.2c-.1-.8-.7-1.2-1.2-1.3z" fill="#5E8E3E"/>
            <path d="M64 43.7l-2.2 8.2s-2.4-1.1-5.2-1.1c-4.2.3-4.2 2.9-4.2 3.6.2 3.8 10.2 4.6 10.7 13.5.4 7-3.7 11.8-9.7 12.2-7.2.4-11.2-3.8-11.2-3.8l1.5-6.5s3.9 3 7.1 2.8c2.1-.1 2.8-1.8 2.8-3 -.3-4.9-8.4-4.6-8.9-12.8-.4-6.9 4.1-13.8 14.1-14.4 3.9-.3 5.9.7 5.9.7l.3.6z" fill="#fff"/>
          </svg>
          <span className="text-ventura-text font-semibold text-lg">
            Shopify
          </span>
          <span className="text-ventura-muted text-sm ml-2 hidden sm:inline">
            Clean Data Demo
          </span>
        </div>
        <a
          href="https://shopify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-ventura-muted hover:text-ventura-text transition-colors"
        >
          shopify.com
        </a>
      </div>
    </header>
  );
}
