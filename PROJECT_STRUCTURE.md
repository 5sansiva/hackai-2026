# HackAI 2026 — Project Structure

Next.js + Firebase hackathon website for HackAI 2026.

## Tech Stack

| Layer | Tech |
|-------|------|
| **Framework** | Next.js 16 (Pages Router) |
| **Frontend** | React 19, Tailwind CSS 4 |
| **Auth** | Firebase Auth (email/password) |
| **Database** | Firestore (`applicants` collection) |
| **Admin Auth** | Email allowlist in `utils/adminAccess.ts` |
| **Email** | Nodemailer (via API routes) |
| **QR Codes** | `qrcode.react` (generate) + `jsqr` (scan) |
| **Hosting** | Vercel |

## Main User Flows

1. **Hacker flow**: `signin` → `verify-email` → `completeProfile` → `userProfile` (shows QR code)
2. **Admin flow**: `admin/hackers/index` (dashboard with table, waitlist queue, bulk email) → `admin/hackers/[id]` (individual hacker detail)
3. **Day-of flow**: `scanner` (QR scan for check-in & food tracking), `schedule`, `menu`, `day-of`
4. **Public site**: `Home`, `About`, `Sponsors`, `Donors`, `Stats`, `Tracks`, `countdown`

## Directory Tree

```
hackai-2026/
│
├── Config & Root Files
│   ├── package.json                  # Next.js 16, React 19, Firebase, Tailwind 4
│   ├── next.config.ts                # Next.js config
│   ├── tsconfig.json                 # TypeScript config
│   ├── postcss.config.mjs            # PostCSS (Tailwind)
│   ├── eslint.config.mjs             # ESLint
│   ├── globals.css                   # Global styles
│   ├── firestore.rules               # Firestore security rules
│   ├── .env.local                    # Firebase keys, Nodemailer creds (secret)
│   └── .gitignore
│
├── firebase/                         # Firebase setup
│   ├── clientApp.ts                  # Client-side Firebase init (Auth, Firestore)
│   └── admin.ts                      # Server-side Firebase Admin SDK init
│
├── utils/
│   └── adminAccess.ts                # List of admin email addresses for access control
│
├── pages/                            # Next.js Pages Router (all routes)
│   ├── _app.tsx                      # App wrapper (global layout, providers)
│   ├── _error.tsx                    # Custom error page
│   ├── index.tsx                     # Landing page — routes to Home or day-of
│   │
│   ├── ── Public Pages ──
│   ├── Home.tsx                      # Main landing/hero section
│   ├── About.tsx                     # About HackAI section
│   ├── Sponsors.tsx                  # Sponsors display page
│   ├── Donors.tsx                    # Donors page
│   ├── Stats.tsx                     # Stats/numbers showcase
│   ├── Tracks.tsx                    # Hackathon tracks info
│   ├── countdown.tsx                 # Countdown timer to event
│   ├── menu.tsx                      # Food menu for the event
│   ├── schedule.tsx                  # Day-of schedule
│   ├── day-of.tsx                    # Day-of hub/landing page
│   │
│   ├── ── Auth & User Pages ──
│   ├── signin.tsx                    # Sign in / sign up (Firebase Auth)
│   ├── verify-email.tsx              # Email verification flow
│   ├── completeProfile.tsx           # Post-signup profile completion form
│   ├── userProfile.tsx               # User profile view (QR code, status)
│   │
│   ├── ── Admin Section ──
│   ├── admin/
│   │   └── hackers/
│   │       ├── index.tsx             # Admin dashboard
│   │       │                         #   - Hacker table with search/filter
│   │       │                         #   - Waitlist management & queue
│   │       │                         #   - Bulk actions (accept, reject, check-in)
│   │       │                         #   - Stats overview (applied, accepted, etc.)
│   │       │                         #   - Email sending (acceptance/waitlist)
│   │       └── [id].tsx              # Individual hacker detail page
│   │                                 #   - View/edit hacker profile
│   │                                 #   - Check-in, food tracking, status changes
│   │
│   ├── scanner.tsx                   # QR code scanner
│   │                                 #   - Scan hacker QR codes
│   │                                 #   - Check-in / food pickup tracking
│   │                                 #   - Manual ID entry fallback
│   │
│   └── ── API Routes ──
│       └── api/
│           ├── faqRoute.ts                   # FAQ data endpoint
│           └── admin/
│               ├── sendHackerEmail.ts        # Send acceptance emails (Nodemailer)
│               ├── sendWaitlistQueueEmail.ts  # Send waitlist queue emails
│               └── assignFoodGroups.ts       # Assign food groups to hackers
│
├── components/                       # Reusable React components
│   ├── Navbar.tsx                    # Navigation bar
│   ├── Navbar.module.css             # Navbar styles (CSS modules)
│   ├── Footer.tsx                    # Footer
│   ├── Preloader.tsx                 # Loading animation
│   ├── FaqCards.tsx                  # FAQ accordion/cards
│   ├── KeynoteSpeaker.tsx            # Keynote speaker spotlight
│   └── StatsCarousel.tsx             # Stats carousel/slider
│
├── scripts/                          # One-off admin/migration scripts (gitignored)
│   ├── migrateApplicants.js          # Migrate applicant data in Firestore
│   ├── assignFoodGroups.js           # Assign food groups from script
│   ├── updateTestHackersAcceptedFromCsv.js   # Bulk accept from CSV
│   ├── setApplicantsFieldFalseFromCsv.js     # Bulk set field from CSV
│   └── validateAcceptancesFinal.js           # Validate acceptance data
│
├── csv/                              # Data files used by scripts (gitignored)
│   ├── HackAI Preliminary Sort - Acceptances.csv
│   ├── HackAI Preliminary Sort - Acceptances-final.csv
│   ├── email_skip_report_*.csv       # Email sending logs
│   ├── unmatched_acceptance_rows.csv
│   ├── unmatched_set_false_rows.csv
│   └── validation_acceptance_issues.csv
│
└── public/                           # Static assets
    ├── fonts/                        # Custom fonts (OctinSpraypaint, StreetFlowNYC)
    ├── Home/                         # Hero section images/SVGs
    ├── About/                        # About section background
    ├── KeynoteSpeaker/               # Keynote speaker decorations
    ├── Stats/                        # Stats section graphics
    ├── Tracks/                       # Tracks section borders/backgrounds
    ├── Countdown/                    # Countdown page assets
    ├── Menu/                         # Food menu backgrounds
    ├── Logos/                        # Social media icons
    ├── Email/                        # Email template image
    ├── sponsors/                     # Sponsor tier plaques & backgrounds
    ├── schedule/                     # Schedule page doodles, icons, tags
    ├── footer/                       # Footer logos
    ├── mainbg.svg                    # Site-wide background
    └── tabLogo.webp                  # Browser tab favicon
```

## Key Files by Size

| File | Lines | Purpose |
|------|-------|---------|
| `pages/admin/hackers/index.tsx` | 1120 | Admin dashboard — the big one |
| `pages/scanner.tsx` | 985 | QR scanner for check-in & food |
| `pages/admin/hackers/[id].tsx` | 699 | Individual hacker detail/edit |
| `pages/signin.tsx` | 508 | Auth page (sign in + sign up) |
| `pages/schedule.tsx` | 308 | Day-of event schedule |
| `pages/completeProfile.tsx` | 248 | Profile completion form |
| `pages/menu.tsx` | 247 | Food menu display |
| `pages/countdown.tsx` | 218 | Countdown timer |
| `pages/userProfile.tsx` | 201 | User profile + QR code |
| `pages/index.tsx` | 194 | Root page routing |
| `pages/verify-email.tsx` | 138 | Email verification |
| `pages/day-of.tsx` | 48 | Day-of hub |
