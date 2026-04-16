# Clean Data — Ventura Demo

Interactive demo showing how Ventura transforms messy distributor data (emails, purchase orders, CSVs) into structured, catalog-matched line items.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Modes

- **Mock mode** (default): Rule-based parsing, works without any API key
- **AI mode**: Uses Claude API for intelligent parsing. Add your key to `.env.local`:

```bash
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
```

## Sample Data

The demo includes three pre-loaded samples:
- **Email Request** — informal customer email with product descriptions
- **Purchase Order** — formal PO with SKUs and quantities
- **Messy CSV** — poorly formatted spreadsheet with typos

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Claude API (optional)
