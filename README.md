# LuxeBook - Hotel Analytics & Bookings Dashboard

LuxeBook is a premium, state-of-the-art hotel analytics dashboard built using **React**, **TypeScript**, **Vite**, and **Recharts**. It provides hotel operators with real-time insight into booking volumes, revenue collections, occupancy rates, conversion statistics, performance trends, and dynamic bookings tracking.

## Architecture & Technical Decisions

### 1. Design System & Theming
- **CSS Custom Variables**: Global colors, typography, borders, shadows, and transitions are managed through a custom property system inside [index.css](file:///Users/apple/hotel-dashboard/src/index.css).
- **Manual & Automatic Light/Dark Mode**: The dashboard automatically detects system color preference via `prefers-color-scheme` but allows manual selection via a theme toggler. Selection is persisted via `localStorage` and applied via the `data-theme` document attribute.
- **Harmonious Palette**: Traditional red/green/blue alert-like status indicators are replaced with beautiful, high-contrast HSL accents (emerald for confirmed, amber for pending, rose for cancelled) that adapt smoothly across themes.
- **Premium Typography**: Integrates Google Fonts' **Plus Jakarta Sans** and **Outfit** for clean headings and UI elements, replacing default system fonts.

### 2. Client-Side Operations & Performance
- **Interactive Filtering**: Bookings are fetched for a user-selected time window (7d, 30d, 90d, 180d, 365d) to minimize network traffic. Sub-filtering (searching by guest/booking ID, filtering by hotel, room category, status, and payment status) is handled fully on the client.
- **Dynamic Filter Suggestions**: Dropdowns for Hotel Name, Room Category, and Payment status dynamically extract unique values from the fetched dataset, avoiding hardcoding and keeping filter lists context-relevant.
- **Column Sorting**: Clickable table headers support interactive client-side sorting of booking IDs, names, dates, status, and transaction amounts.
- **Responsive Table Card-Fallback**: On screens below 768px, the tabular bookings grid automatically shifts to a stacked card layout, preventing horizontal overflow and keeping the layout perfectly readable on mobile.

### 3. Progressive Loading States
- **Skeleton Shimmers**: Avoids blocking full-screen loaders by introducing localized, animated skeleton blocks. Skeletons occupy the precise layout footprints of the metric cards, graphs, and table rows to minimize layout shifts (CLS) during API fetches.

### 4. Code Quality & Type Safety
- **Strict TypeScript Types**: Created interfaces (`Booking`, `Metrics`, `Trend`, `APIResponse`) under [types.ts](file:///Users/apple/hotel-dashboard/src/api/types.ts) to replace raw `any` declarations.
- **Type-Only Imports**: Set up explicit `import type` definitions to satisfy `verbatimModuleSyntax` TS specifications, preventing build compile-time bundle complications.

## Getting Started

### Installation
```bash
npm install
```

### Running Locally
To run the Vite dev server:
```bash
npm run dev
```

### Build & Compilation
To lint and compile the production build:
```bash
npm run lint
npm run build
```
