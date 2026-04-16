"use client";

export default function Header() {
  return (
    <header className="border-b border-ventura-border bg-ventura-surface/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-ventura-accent flex items-center justify-center font-bold text-white text-sm">
            V
          </div>
          <span className="text-ventura-text font-semibold text-lg">
            Ventura
          </span>
          <span className="text-ventura-muted text-sm ml-2 hidden sm:inline">
            Clean Data Demo
          </span>
        </div>
        <a
          href="https://ventura.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-ventura-muted hover:text-ventura-text transition-colors"
        >
          ventura.ai
        </a>
      </div>
    </header>
  );
}
