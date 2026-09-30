# CURRENT UI/UX SNAPSHOT — Salon CRM
> **Forensic Reference Document**
> This document captures the exact current state of the Salon CRM application UI/UX as of the latest inspection. It serves as a visual and structural source of truth for the Figma redesign process.

**Note:** All data herein represents the *current* implementation.

---

## 1. Design System & Visual Tokens

The application employs a custom theme built on top of Tailwind CSS (`app/globals.css`), featuring a dark-mode first or heavily-weighted dark aesthetic with gold accents.

### 1.1 Typography
The system uses `next/font/google` for typography mapping to CSS variables:
*   **Sans-serif** (`--font-sans`): Geist Sans
*   **Monospace** (`--font-mono`): Geist Mono
*   **Serif / Headings** (`--font-serif`): Playfair Display
    *   *Usage:* Often used in prominent headers (e.g. `font-serif font-medium`) alongside gold/italic accents.

### 1.2 Color Palette
The CSS uses `oklch` color definitions. The default theme (Light) and Dark theme are explicitly defined.

**Core Tokens (Light Mode):**
*   **Background:** Warm Ivory (`oklch(0.99 0.005 90)`)
*   **Foreground / Text:** Deep Charcoal (`oklch(0.2 0.01 250)`)
*   **Primary (Buttons):** Deep Charcoal (`oklch(0.18 0.01 250)`)
*   **Ring / Accent (Gold):** `oklch(0.78 0.11 82)`
*   **Secondary:** Soft Warm Gray (`oklch(0.95 0.01 90)`)
*   **Card / Popover:** Pure White (`oklch(1 0 0)`)

**Core Tokens (Dark Mode):**
*   **Background:** `oklch(0.15 0.01 250)`
*   **Foreground:** `oklch(0.98 0.01 90)`
*   **Primary:** `oklch(0.98 0.01 90)`
*   **Card / Popover:** `oklch(0.18 0.01 250)`

### 1.3 Layout & Structural Tokens
*   **Border Radius:** Base radius is `0.5rem`. Extended tokens include `--radius-sm` (0.3rem), `--radius-md` (0.4rem), up to `--radius-4xl`.
*   **Container Max Widths:** Commonly `max-w-7xl` or `max-w-6xl` for main page containers.
*   **Animations:** Uses `tailwindcss-animate` (`tw-animate-css`) for `fade-in`, `slide-in-from-bottom`, `zoom-in`.

---

## 2. Global Layouts & Shells

### 2.1 Public Shell (`/app/page.tsx` & `/app/appointments/page.tsx`)
*   **Header (Home):** Fixed `top-0`, `bg-black/50 backdrop-blur-md border-b border-white/10`. Features a logo (using `mix-blend-screen`), desktop navigation links, and a primary "Book Now" CTA.
*   **Hero Section (Home):** 100vh height. Features a background video (`opacity-60 mix-blend-luminosity`) with a cinematic gradient overlay (black to black/80). Content uses staggered entry animations.
*   **Appointments Header:** Sticky top, `bg-white/90 backdrop-blur-md`, featuring a "Back" button and the Business Name in a serif font.

### 2.2 Admin Shell (`/app/admin/layout.tsx`)
*   **Sidebar Navigation:** Fixed left sidebar (`w-64`, `bg-sidebar`), hidden on mobile behind a hamburger menu. Contains links to Dashboard, Appointments, Customers, Services, Staff.
*   **Main Content Area:** Takes up remaining space with a top header (mobile only) and a main scrollable area (`bg-muted/30`).
*   **Role-Based Rendering:** Sidebar items like Customers, Services, and Staff are restricted to `ADMIN` or `OWNER` roles.

---

## 3. Core UI Components

The application relies heavily on Shadcn UI components configured in `client/components.json` using the `base-nova` style.

### 3.1 Base Shadcn Components (`src/components/ui/`)
*   `button.tsx`
*   `calendar.tsx`
*   `dialog.tsx`
*   `input.tsx`
*   `label.tsx`
*   `popover.tsx`
*   `select.tsx`
*   `sheet.tsx`
*   `table.tsx`

### 3.2 Custom Functional Components
*   **`Gallery.tsx`:** Renders a masonry-style image/video grid. It uses static manifests (`STATIC_GALLERY_IMAGES`) to map media assets for serverless environments.
*   **`ReelsPlayer.tsx`:** Custom video player component for rendering short-form video content.
*   **`ReviewCarousel.tsx`:** Carousel for displaying customer testimonials.
*   **`BookingForm.tsx` (Inside Appointments):** Multi-step form for user appointment booking. Handles service selection, staff selection, date/time, and user details.

---

## 4. Key User Flows & Pages

### 4.1 Landing Page (`/`)
1.  **Hero:** Video background, logo, value proposition ("Where Beauty Becomes Confidence"), CTA buttons.
2.  **About/Ethos:** Text-heavy section introducing the salon philosophy. Grid layout with 4 key value props.
3.  **Services Preview:** Links to specific treatments.
4.  **Gallery & Reviews:** Visual proof using `Gallery` and `ReviewCarousel`.

### 4.2 Customer Booking Flow (`/appointments`)
1.  **Entry:** Clean, white-themed page (`bg-slate-50`).
2.  **State Handling:** If the API is down, a specific "Booking System Offline" card is shown.
3.  **Form (`BookingForm`):** Encapsulated form card handling the step-by-step wizard.
4.  **Fallback Contact:** Links to call or WhatsApp provided below the form.

### 4.3 Admin Dashboard (`/admin/dashboard`)
1.  **Header:** Welcome message with the current date.
2.  **KPI Cards (Top Row):** 
    *   Total Revenue (Indian Rupee icon)
    *   Total Bookings (Calendar icon)
    *   Upcoming Today (Clock icon)
    *   *Styling:* White cards (`bg-card`), rounded-2xl, border, subtle hover shadows, absolute positioned large faded icons in the background.
3.  **Data Views (Bottom Row):**
    *   *Next Appointments List:* List of upcoming customers with status badges (e.g., PENDING in amber, COMPLETED in green, CONFIRMED in blue). Uses initials in circles as avatars.
    *   *Service Popularity Chart:* Recharts `BarChart` showing top services.

---

## 5. Accessibility & Responsiveness
*   **Responsiveness:** Extensive use of Tailwind's breakpoint prefixes (`md:`, `lg:`). The Admin sidebar collapses into a hamburger menu on smaller screens. Public headers switch from full nav to simplified mobile nav.
*   **Accessibility:** Focus states are globally defined in `globals.css` (`outline-ring/50`). Semantic HTML (`<header>`, `<main>`, `<nav>`, `<aside>`) is consistently used.

---
*Documented for Figma Reference — No Code Changes Executed.*
