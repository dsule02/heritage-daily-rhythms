# Heritage: Daily Rhythms - Stage 1 Plan

## File Structure Outline

```text
/
├── app/
│   ├── layout.tsx              # Root layout: PWA meta tags, iOS safe areas, Context Provider
│   ├── page.tsx                # Dashboard Screen (Today's Rituals)
│   ├── settings/
│   │   └── page.tsx            # Settings Screen (Placeholder)
│   ├── manifest.ts             # PWA configuration (Next.js 14 style)
│   └── globals.css             # Global styles (Tailwind + Base Bedtime Mode colors)
├── components/
│   ├── BottomNav.tsx           # iOS-style bottom nav with env(safe-area-inset-bottom)
│   ├── RitualList.tsx          # Renders grouped rituals (Morning/Evening)
│   └── RitualItem.tsx          # Checkable ritual component (min 44x44px tap targets)
├── context/
│   └── HeritageContext.tsx     # React Context + localStorage state management
├── types/
│   └── index.ts                # TypeScript interfaces (Child, Ritual, AppState)
├── tailwind.config.ts          # Custom Bedtime Mode color palette
└── public/
    ├── icons/                  # PWA and Apple touch icons
    └── splash/                 # iOS splash screens
```

## Stage 1 Implementation Steps

1. **Next.js Initialization**: Bootstrap standard Next.js (App Router) + Tailwind CSS project.
2. **Bedtime Mode Theme**: Configure Tailwind colors (charcoal backgrounds, warm gold/amber accents, soft off-white text) tailored for low-light environments.
3. **PWA & iOS Configuration**: Add `manifest.json`, Apple meta tags (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`), and configure viewport for notch/home indicator safe areas.
4. **Data Models**: Define TS types for `Child` and `Ritual`.
5. **State Management**: Build `HeritageContext` wrapping standard `localStorage` getters/setters. Pre-load with foundational rituals.
6. **UI Components**: Build `RitualItem` (large tap targets, satisfying check animation) and `BottomNav` using `lucide-react`.
7. **Dashboard Assembly**: Connect the Dashboard (`app/page.tsx`) to the context state, separating "Morning" and "Evening" routines.