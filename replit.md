# StarCraft Cup 2027

## Project Overview
Premium football tournament website for **StarCraft Cup 2027** — a world-class grassroots football competition in Oredo LGA, Edo State, Nigeria. Inspired by UEFA Champions League, FIFA World Cup, and Premier League digital experiences.

## Tech Stack
- **Frontend**: React + Vite (in `/client`)
- **Backend**: Express.js (in `/server`, port 3001)
- **Fonts**: Cinzel, Montserrat, Poppins (Google Fonts)
- **Routing**: React Router v6
- **Data**: Mock data in `/client/src/data/mockData.js`

## Design System
- **Primary Gold**: #D4AF37 — headings, medals, premium elements
- **Championship Red**: #8B0E12 — main background
- **Dark Burgundy**: #4A090B — gradients, deep sections
- **Fonts**: Cinzel (headings), Montserrat Bold (secondary), Poppins (body)

## Pages
- `/` — Home (hero, countdown, fixtures, players, table, news, sponsors)
- `/about` — About, history, vision, committee
- `/tournament` — Format, schedule, rules, venues, prizes
- `/teams` — Team profiles with squad lists
- `/players` — Player cards with detailed stats
- `/fixtures` — All matches with filters
- `/live-scores` — Real-time score center + commentary
- `/league-table` — Group standings
- `/statistics` — Golden Boot, assists, ratings, team rankings
- `/gallery` — Photo & video gallery with lightbox
- `/news` — Articles with category filtering
- `/sponsors` — Tiered sponsor display + enquiry form
- `/media-center` — Press accreditation, downloads, contacts
- `/volunteers` — Volunteer roles + registration form
- `/contact` — Contact form, FAQ, map
- `/login` — Auth with 2FA flow
- `/register` — Team or fan registration (multi-step)

## Running the App
```bash
npm run dev
```
This starts both the Vite frontend (port 5000) and Express backend (port 3001) concurrently.

## User Preferences
- Premium, luxury aesthetic (gold + dark red)
- World-class design inspired by Champions League / FIFA World Cup websites
- Fully responsive, mobile-first
- Mock data throughout (ready to connect to real backend/database)
