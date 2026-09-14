# InvoiceCraft

> Instant, professional invoice generator with real-time live preview, custom branding, multi-currency support, tax & discount calculations, and client-side PDF export.

## Features

- **Real-Time Live Preview**: Instant side-by-side rendering as you edit details, items, taxes, and discounts.
- **Client-Side PDF Generation**: High-fidelity vector/canvas PDF download powered by `jspdf` and `html2canvas-pro` without needing external servers.
- **Custom Branding**: Upload your business logo, choose accent themes, and customize headers.
- **Multi-Currency Support**: Switch between major currencies (USD, EUR, GBP, INR, CAD, AUD, JPY, etc.) with automatic symbol and formatting rules.
- **Automated Calculations**: Dynamic subtotals, item quantity/rate pricing, fixed or percentage discounts, and configurable sales tax/GST/VAT.
- **A4 Print Ready**: Clean `@media print` CSS optimization for browser printing and save-as-PDF.
- **Local Persistence**: Drafts automatically persist to your browser's local storage so progress is never lost.

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PDF Export**: jsPDF + html2canvas-pro
- **Animations**: Motion

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/invoicecraft.git

# Navigate to the project directory
cd invoicecraft

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000` (or the port specified by Vite).

### Building for Production

```bash
npm run build
```

This compiles optimized static assets into the `dist/` folder.

## Deploying to GitHub Pages

This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) configured for automatic deployment to GitHub Pages:

1. Push this repository to GitHub.
2. In your repository on GitHub, navigate to **Settings** > **Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Pushing to the `main` or `master` branch will automatically trigger the workflow and deploy your live site.
