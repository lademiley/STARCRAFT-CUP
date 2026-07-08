// =============================================
// STARCRAFT CUP — Mock Data (Premier Edition 2026)
// =============================================

// ── Edition Registry ─────────────────────────
export const editions = [
  { year: 2026, label: 'Premier Edition', status: 'current',  dates: 'Dec 1 – 20, 2026', teams: 20, groups: '4 × 5', ageGroup: 'U17–U20' },
  { year: 2027, label: '2nd Edition',     status: 'upcoming', dates: 'TBD 2027',           teams: 20, groups: '4 × 5', ageGroup: 'U17–U20' },
  { year: 2028, label: '3rd Edition',     status: 'future',   dates: 'TBD 2028',           teams: 24, groups: '4 × 6', ageGroup: 'U17–U21' },
  { year: 2029, label: '4th Edition',     status: 'future',   dates: 'TBD 2029',           teams: 24, groups: '4 × 6', ageGroup: 'U17–U21' },
  { year: 2030, label: '5th Edition',     status: 'future',   dates: 'TBD 2030',           teams: 32, groups: '8 × 4', ageGroup: 'U17–U21' },
]

// ── 20 Teams — 18 LGAs + Host XI + Defending Champion ────
export const teams = [
  // GROUP A
  { id: 1,  name: 'Akoko-Edo Panthers',    shortName: 'AKP', logo: '🐆', lga: 'Akoko-Edo',      coach: 'Gabriel Alagbe',    group: 'A', played: 4, won: 3, draw: 1, lost: 0, gf: 10, ga: 3,  gd: 7,   points: 10, form: ['W','W','D','W'], color: '#D4AF37' },
  { id: 2,  name: 'Egor United',           shortName: 'EGU', logo: '🔥', lga: 'Egor',           coach: 'Emeka Olokor',      group: 'A', played: 4, won: 2, draw: 1, lost: 1, gf: 7,  ga: 5,  gd: 2,   points: 7,  form: ['W','D','L','W'], color: '#3B82F6' },
  { id: 3,  name: 'Esan Central FC',       shortName: 'ESC', logo: '⭐', lga: 'Esan Central',   coach: 'Chidi Nwosu',       group: 'A', played: 4, won: 1, draw: 2, lost: 1, gf: 5,  ga: 6,  gd: -1,  points: 5,  form: ['D','W','D','L'], color: '#10B981' },
  { id: 4,  name: 'Esan North Stars',      shortName: 'ENS', logo: '🌠', lga: 'Esan North-East', coach: 'Osaro Akhigbe',    group: 'A', played: 4, won: 1, draw: 1, lost: 2, gf: 4,  ga: 7,  gd: -3,  points: 4,  form: ['L','W','L','D'], color: '#8B5CF6' },
  { id: 5,  name: 'Esan South FC',         shortName: 'ESS', logo: '🌊', lga: 'Esan South-East', coach: 'Festus Agbamu',    group: 'A', played: 4, won: 0, draw: 1, lost: 3, gf: 2,  ga: 9,  gd: -7,  points: 1,  form: ['L','L','D','L'], color: '#EF4444' },
  // GROUP B
  { id: 6,  name: 'Esan West Rangers',     shortName: 'EWR', logo: '🦅', lga: 'Esan West',      coach: 'Dickson Owie',      group: 'B', played: 4, won: 3, draw: 0, lost: 1, gf: 9,  ga: 4,  gd: 5,   points: 9,  form: ['W','L','W','W'], color: '#F97316' },
  { id: 7,  name: 'Etsako Central FC',     shortName: 'ETC', logo: '🏰', lga: 'Etsako Central', coach: 'Sunday Omotosho',   group: 'B', played: 4, won: 2, draw: 2, lost: 0, gf: 8,  ga: 3,  gd: 5,   points: 8,  form: ['W','D','W','D'], color: '#EC4899' },
  { id: 8,  name: 'Etsako East United',    shortName: 'EEU', logo: '🦆', lga: 'Etsako East',    coach: 'John Ochuko',       group: 'B', played: 4, won: 2, draw: 0, lost: 2, gf: 6,  ga: 6,  gd: 0,   points: 6,  form: ['W','L','W','L'], color: '#14B8A6' },
  { id: 9,  name: 'Etsako West FC',        shortName: 'ETW', logo: '🛡️', lga: 'Etsako West',    coach: 'Peter Aigbe',       group: 'B', played: 4, won: 1, draw: 1, lost: 2, gf: 5,  ga: 7,  gd: -2,  points: 4,  form: ['D','W','L','L'], color: '#6366F1' },
  { id: 10, name: 'Igueben FC',            shortName: 'IGU', logo: '⚔️', lga: 'Igueben',        coach: 'Felix Idahosa',     group: 'B', played: 4, won: 0, draw: 1, lost: 3, gf: 2,  ga: 9,  gd: -7,  points: 1,  form: ['L','D','L','L'], color: '#F59E0B' },
  // GROUP C
  { id: 11, name: 'Ikpoba-Okha FC',        shortName: 'IKO', logo: '🏆', lga: 'Ikpoba-Okha',    coach: 'Austin Oghuvwu',    group: 'C', played: 4, won: 4, draw: 0, lost: 0, gf: 12, ga: 2,  gd: 10,  points: 12, form: ['W','W','W','W'], color: '#D4AF37' },
  { id: 12, name: 'Oredo City FC',         shortName: 'ORC', logo: '👑', lga: 'Oredo (Host)',   coach: 'Victor Ihejirika',  group: 'C', played: 4, won: 2, draw: 1, lost: 1, gf: 8,  ga: 5,  gd: 3,   points: 7,  form: ['W','W','D','L'], color: '#84CC16' },
  { id: 13, name: 'Orhionmwon FC',         shortName: 'ORH', logo: '🌿', lga: 'Orhionmwon',     coach: 'Mike Odalume',      group: 'C', played: 4, won: 1, draw: 2, lost: 1, gf: 5,  ga: 6,  gd: -1,  points: 5,  form: ['D','L','W','D'], color: '#06B6D4' },
  { id: 14, name: 'Ovia North Rangers',    shortName: 'ONR', logo: '🦁', lga: 'Ovia North-East', coach: 'Emmanuel Okoro',   group: 'C', played: 4, won: 1, draw: 1, lost: 2, gf: 4,  ga: 7,  gd: -3,  points: 4,  form: ['L','W','D','L'], color: '#A78BFA' },
  { id: 15, name: 'Ovia South United',     shortName: 'OSU', logo: '🌍', lga: 'Ovia South-West', coach: 'Bright Osifo',     group: 'C', played: 4, won: 0, draw: 0, lost: 4, gf: 1,  ga: 12, gd: -11, points: 0,  form: ['L','L','L','L'], color: '#F43F5E' },
  // GROUP D
  { id: 16, name: 'Owan East FC',          shortName: 'OWE', logo: '🦊', lga: 'Owan East',      coach: 'Richard Ebore',     group: 'D', played: 4, won: 3, draw: 1, lost: 0, gf: 11, ga: 3,  gd: 8,   points: 10, form: ['W','W','W','D'], color: '#22D3EE' },
  { id: 17, name: 'Owan West United',      shortName: 'OWW', logo: '🌙', lga: 'Owan West',      coach: 'Samuel Oriaifo',    group: 'D', played: 4, won: 2, draw: 2, lost: 0, gf: 7,  ga: 4,  gd: 3,   points: 8,  form: ['W','D','W','D'], color: '#F9A8D4' },
  { id: 18, name: 'Uhunmwonde FC',         shortName: 'UHU', logo: '🏔️', lga: 'Uhunmwonde',     coach: 'Kingsley Egbase',   group: 'D', played: 4, won: 1, draw: 1, lost: 2, gf: 5,  ga: 7,  gd: -2,  points: 4,  form: ['L','W','D','L'], color: '#4ADE80' },
  { id: 19, name: 'Oredo Host XI',         shortName: 'HXI', logo: '🏠', lga: 'Host (Oredo)',   coach: 'Chief Osagie-Eweka', group: 'D', played: 4, won: 1, draw: 0, lost: 3, gf: 4,  ga: 9,  gd: -5,  points: 3,  form: ['L','W','L','L'], color: '#FB923C' },
  { id: 20, name: 'Bendel Insurance Youth',shortName: 'BIY', logo: '🦁', lga: 'Defending 🏆',   coach: 'Godwin Enakhena',   group: 'D', played: 4, won: 0, draw: 0, lost: 4, gf: 1,  ga: 10, gd: -9,  points: 0,  form: ['L','L','L','L'], color: '#6B7280' },
]

// ── Players ─────────────────────────────────
export const players = [
  { id: 1,  name: 'Chukwuemeka Obi',     position: 'Forward',    team: 'Akoko-Edo Panthers',  teamId: 1,  jersey: 9,  age: 17, goals: 8,  assists: 3, cleanSheets: 0, yellowCards: 1, redCards: 0, mvpVotes: 145, nationality: '🇳🇬', rating: 9.1, bio: 'Prolific striker with explosive pace and clinical finishing. Top scorer of the Premier Edition.' },
  { id: 2,  name: 'Victor Ehigie',        position: 'Midfielder',  team: 'Egor United',          teamId: 2,  jersey: 8,  age: 19, goals: 4,  assists: 6, cleanSheets: 0, yellowCards: 2, redCards: 0, mvpVotes: 112, nationality: '🇳🇬', rating: 8.7, bio: 'Creative playmaker with exceptional vision. Captain of Egor United.' },
  { id: 3,  name: 'Emmanuel Okuosa',      position: 'Goalkeeper',  team: 'Ikpoba-Okha FC',       teamId: 11, jersey: 1,  age: 18, goals: 0,  assists: 0, cleanSheets: 6, yellowCards: 0, redCards: 0, mvpVotes: 98,  nationality: '🇳🇬', rating: 8.5, bio: 'Shot-stopper extraordinaire. Kept 6 clean sheets in the group stage.' },
  { id: 4,  name: 'Samuel Oriaifo',       position: 'Defender',    team: 'Owan West United',     teamId: 17, jersey: 4,  age: 20, goals: 1,  assists: 2, cleanSheets: 0, yellowCards: 3, redCards: 0, mvpVotes: 87,  nationality: '🇳🇬', rating: 8.2, bio: 'Commanding centre-back and leader at the back. Strong in the air.' },
  { id: 5,  name: 'David Akhigbe',        position: 'Forward',     team: 'Oredo City FC',        teamId: 12, jersey: 11, age: 17, goals: 6,  assists: 4, cleanSheets: 0, yellowCards: 1, redCards: 0, mvpVotes: 76,  nationality: '🇳🇬', rating: 8.0, bio: 'Exciting winger with blistering pace. Youngest top scorer in the tournament.' },
  { id: 6,  name: 'Peter Osagie',         position: 'Midfielder',  team: 'Owan East FC',         teamId: 16, jersey: 6,  age: 18, goals: 3,  assists: 5, cleanSheets: 0, yellowCards: 2, redCards: 0, mvpVotes: 65,  nationality: '🇳🇬', rating: 7.8, bio: 'Box-to-box midfielder with incredible stamina and work rate.' },
  { id: 7,  name: 'Felix Agbonlahor',     position: 'Forward',     team: 'Esan Central FC',      teamId: 3,  jersey: 10, age: 19, goals: 4,  assists: 3, cleanSheets: 0, yellowCards: 0, redCards: 0, mvpVotes: 60,  nationality: '🇳🇬', rating: 7.9, bio: 'Technical forward, excellent dribbler with great awareness in tight spaces.' },
  { id: 8,  name: 'Monday Ogunbor',       position: 'Defender',    team: 'Etsako Central FC',    teamId: 7,  jersey: 5,  age: 20, goals: 0,  assists: 1, cleanSheets: 0, yellowCards: 4, redCards: 0, mvpVotes: 42,  nationality: '🇳🇬', rating: 7.5, bio: 'Experienced defender who reads the game superbly. Team captain.' },
  { id: 9,  name: 'John Uwaifo',          position: 'Forward',     team: 'Esan West Rangers',    teamId: 6,  jersey: 7,  age: 17, goals: 5,  assists: 1, cleanSheets: 0, yellowCards: 1, redCards: 0, mvpVotes: 38,  nationality: '🇳🇬', rating: 7.2, bio: 'Young talent with a strong shot and direct playing style.' },
  { id: 10, name: 'Chris Ehigiamusoe',    position: 'Midfielder',  team: 'Owan West United',     teamId: 17, jersey: 14, age: 18, goals: 2,  assists: 7, cleanSheets: 0, yellowCards: 1, redCards: 0, mvpVotes: 55,  nationality: '🇳🇬', rating: 7.7, bio: 'Assist machine. Deep-lying playmaker with superb distribution.' },
  { id: 11, name: 'Bright Omokhagbo',     position: 'Goalkeeper',  team: 'Owan East FC',         teamId: 16, jersey: 23, age: 19, goals: 0,  assists: 0, cleanSheets: 5, yellowCards: 0, redCards: 0, mvpVotes: 72,  nationality: '🇳🇬', rating: 8.3, bio: 'Agile goalkeeper with exceptional distribution. Golden Glove favourite.' },
  { id: 12, name: 'Kingsley Idehen',      position: 'Forward',     team: 'Ikpoba-Okha FC',       teamId: 11, jersey: 9,  age: 17, goals: 5,  assists: 2, cleanSheets: 0, yellowCards: 2, redCards: 1, mvpVotes: 30,  nationality: '🇳🇬', rating: 6.9, bio: 'Powerful striker who holds the ball up well and brings teammates into play.' },
]

// ── Fixtures — Dec 1–20, 2026 ─────────────────
// Stadiums: Ugbowo Campus Main Bowl (group/QF/SF), Ogbemudia Main Bowl (Final/Closing)
export const fixtures = [
  // Dec 1 — Opening Ceremony + Special Exhibition Match
  { id: 1,  homeTeam: 'LGA Chairman XI',       awayTeam: 'Ex-Bendel Insurance XI', homeScore: 3, awayScore: 2, date: '2026-12-01', time: '17:00', venue: 'Ugbowo Campus Main Bowl', status: 'completed', referee: 'Chief James Edomwonyi', round: 'Opening Exhibition', note: 'Opening Ceremony' },

  // Dec 2 — Group Stage MD1 (4 matches)
  { id: 2,  homeTeam: 'Akoko-Edo Panthers',    awayTeam: 'Esan South FC',          homeScore: 3, awayScore: 0, date: '2026-12-02', time: '09:00', venue: 'Ugbowo Campus Main Bowl', status: 'completed', referee: 'James Okafor',   round: 'Group Stage' },
  { id: 3,  homeTeam: 'Egor United',           awayTeam: 'Esan North Stars',        homeScore: 2, awayScore: 1, date: '2026-12-02', time: '11:30', venue: 'Ugbowo Campus Main Bowl', status: 'completed', referee: 'Paul Agbakoba', round: 'Group Stage' },
  { id: 4,  homeTeam: 'Esan West Rangers',     awayTeam: 'Igueben FC',              homeScore: 2, awayScore: 0, date: '2026-12-02', time: '14:00', venue: 'Ugbowo Campus Main Bowl', status: 'completed', referee: 'Ehis Omoregie', round: 'Group Stage' },
  { id: 5,  homeTeam: 'Etsako Central FC',     awayTeam: 'Etsako West FC',          homeScore: 1, awayScore: 1, date: '2026-12-02', time: '16:30', venue: 'Ugbowo Campus Main Bowl', status: 'completed', referee: 'Tom Adaeze',    round: 'Group Stage' },

  // Dec 3 — Group Stage MD1 cont. (4 matches)
  { id: 6,  homeTeam: 'Ikpoba-Okha FC',        awayTeam: 'Ovia South United',       homeScore: 4, awayScore: 0, date: '2026-12-03', time: '09:00', venue: 'Ugbowo Campus Main Bowl', status: 'completed', referee: 'John Onyeka',   round: 'Group Stage' },
  { id: 7,  homeTeam: 'Oredo City FC',         awayTeam: 'Ovia North Rangers',      homeScore: 2, awayScore: 1, date: '2026-12-03', time: '11:30', venue: 'Ugbowo Campus Main Bowl', status: 'completed', referee: 'Chris Agoro',   round: 'Group Stage' },
  { id: 8,  homeTeam: 'Owan East FC',          awayTeam: 'Bendel Insurance Youth',  homeScore: 3, awayScore: 0, date: '2026-12-03', time: '14:00', venue: 'Ugbowo Campus Main Bowl', status: 'completed', referee: 'James Okafor',   round: 'Group Stage' },
  { id: 9,  homeTeam: 'Owan West United',      awayTeam: 'Oredo Host XI',           homeScore: 2, awayScore: 1, date: '2026-12-03', time: '16:30', venue: 'Ugbowo Campus Main Bowl', status: 'completed', referee: 'Paul Agbakoba', round: 'Group Stage' },

  // Dec 4–11 — Remaining Group Stage Matchdays (representative)
  { id: 10, homeTeam: 'Esan Central FC',       awayTeam: 'Akoko-Edo Panthers',     homeScore: 1, awayScore: 3, date: '2026-12-04', time: '09:00', venue: 'Ugbowo Campus Main Bowl', status: 'completed', referee: 'Ehis Omoregie', round: 'Group Stage' },
  { id: 11, homeTeam: 'Esan North Stars',      awayTeam: 'Esan South FC',          homeScore: 1, awayScore: 0, date: '2026-12-04', time: '11:30', venue: 'Ugbowo Campus Main Bowl', status: 'completed', referee: 'Tom Adaeze',    round: 'Group Stage' },
  { id: 12, homeTeam: 'Etsako East United',    awayTeam: 'Esan West Rangers',       homeScore: 1, awayScore: 2, date: '2026-12-04', time: '14:00', venue: 'Ugbowo Campus Main Bowl', status: 'completed', referee: 'John Onyeka',   round: 'Group Stage' },
  { id: 13, homeTeam: 'Igueben FC',            awayTeam: 'Etsako Central FC',       homeScore: 0, awayScore: 2, date: '2026-12-04', time: '16:30', venue: 'Ugbowo Campus Main Bowl', status: 'completed', referee: 'Chris Agoro',   round: 'Group Stage' },
  { id: 14, homeTeam: 'Orhionmwon FC',         awayTeam: 'Ikpoba-Okha FC',          homeScore: 0, awayScore: 3, date: '2026-12-05', time: '09:00', venue: 'Ugbowo Campus Main Bowl', status: 'completed', referee: 'James Okafor',  round: 'Group Stage' },
  { id: 15, homeTeam: 'Ovia North Rangers',    awayTeam: 'Orhionmwon FC',           homeScore: 1, awayScore: 1, date: '2026-12-05', time: '11:30', venue: 'Ugbowo Campus Main Bowl', status: 'completed', referee: 'Paul Agbakoba', round: 'Group Stage' },
  { id: 16, homeTeam: 'Uhunmwonde FC',         awayTeam: 'Owan East FC',            homeScore: 1, awayScore: 3, date: '2026-12-05', time: '14:00', venue: 'Ugbowo Campus Main Bowl', status: 'completed', referee: 'Ehis Omoregie', round: 'Group Stage' },
  { id: 17, homeTeam: 'Oredo Host XI',         awayTeam: 'Uhunmwonde FC',           homeScore: 2, awayScore: 1, date: '2026-12-05', time: '16:30', venue: 'Ugbowo Campus Main Bowl', status: 'completed', referee: 'Tom Adaeze',    round: 'Group Stage' },

  // Dec 13 — Rest day (no fixtures)

  // Dec 14 — Quarter-Finals (4 matches)
  { id: 18, homeTeam: 'Akoko-Edo Panthers',    awayTeam: 'Etsako Central FC',       homeScore: null, awayScore: null, date: '2026-12-14', time: '09:00', venue: 'Ugbowo Campus Main Bowl', status: 'upcoming', referee: 'James Okafor',   round: 'Quarter-Final' },
  { id: 19, homeTeam: 'Ikpoba-Okha FC',        awayTeam: 'Esan West Rangers',       homeScore: null, awayScore: null, date: '2026-12-14', time: '12:00', venue: 'Ugbowo Campus Main Bowl', status: 'upcoming', referee: 'Paul Agbakoba', round: 'Quarter-Final' },
  { id: 20, homeTeam: 'Owan East FC',          awayTeam: 'Egor United',             homeScore: null, awayScore: null, date: '2026-12-14', time: '15:00', venue: 'Ugbowo Campus Main Bowl', status: 'upcoming', referee: 'Ehis Omoregie', round: 'Quarter-Final' },
  { id: 21, homeTeam: 'Owan West United',      awayTeam: 'Oredo City FC',           homeScore: null, awayScore: null, date: '2026-12-14', time: '18:00', venue: 'Ugbowo Campus Main Bowl', status: 'upcoming', referee: 'Tom Adaeze',    round: 'Quarter-Final' },

  // Dec 15 — Rest day

  // Dec 16 — Semi-Finals (2 matches)
  { id: 22, homeTeam: 'TBD',                   awayTeam: 'TBD', homeScore: null, awayScore: null, date: '2026-12-16', time: '14:00', venue: 'Ugbowo Campus Main Bowl', status: 'upcoming', referee: 'TBD', round: 'Semi-Final' },
  { id: 23, homeTeam: 'TBD',                   awayTeam: 'TBD', homeScore: null, awayScore: null, date: '2026-12-16', time: '17:30', venue: 'Ugbowo Campus Main Bowl', status: 'upcoming', referee: 'TBD', round: 'Semi-Final' },

  // Dec 17 — Rest day

  // Dec 18 — Third Place + Grand Final
  { id: 24, homeTeam: 'TBD',                   awayTeam: 'TBD', homeScore: null, awayScore: null, date: '2026-12-18', time: '14:00', venue: 'Ogbemudia Main Bowl',      status: 'upcoming', referee: 'TBD', round: 'Third Place Play-Off' },
  { id: 25, homeTeam: 'TBD',                   awayTeam: 'TBD', homeScore: null, awayScore: null, date: '2026-12-18', time: '17:00', venue: 'Ogbemudia Main Bowl',      status: 'upcoming', referee: 'TBD', round: 'Grand Final' },

  // Dec 20 — Closing Ceremony + Exhibition
  { id: 26, homeTeam: 'Bendel Insurance',      awayTeam: 'StarCraft Elite XI',      homeScore: null, awayScore: null, date: '2026-12-20', time: '16:00', venue: 'Ogbemudia Main Bowl',      status: 'upcoming', referee: 'TBD', round: 'Closing Exhibition', note: 'Closing Ceremony' },
]

// ── Live Matches ──────────────────────────────
export const liveMatches = [
  { id: 'L1', homeTeam: 'Ikpoba-Okha FC', awayTeam: 'Oredo City FC', homeScore: 2, awayScore: 1, minute: 67, venue: 'Ugbowo Campus Main Bowl', possession: [58, 42], shots: [12, 8], corners: [6, 3], fouls: [8, 11], status: 'live' },
]

// ── News ─────────────────────────────────────
export const news = [
  { id: 1, title: 'StarCraft Cup 2026 Premier Edition Officially Launches', category: 'Tournament Updates', date: '2026-12-01', image: null, summary: 'The StarCraft Cup 2026 Premier Edition opened in spectacular fashion at Ugbowo Campus Main Bowl with a dazzling ceremony, drawing thousands from across all 18 LGAs in Edo State.', author: 'Sports Desk' },
  { id: 2, title: 'LGA Chairman XI Beat Ex-Bendel Insurance XI in Thrilling Opener', category: 'Match Reports', date: '2026-12-01', image: null, summary: 'The opening exhibition match set the tournament alight as the LGA Chairman XI claimed a 3-2 victory over the Ex-Bendel Insurance XI in front of a packed Ugbowo Bowl.', author: 'John Adeyemi' },
  { id: 3, title: 'Edo State Governor Hails StarCraft Cup as Youth Development Masterclass', category: 'Press Releases', date: '2026-12-02', image: null, summary: 'The Edo State Governor praised organizers for creating a world-class platform for U17–U20 talent, calling it the most ambitious youth football initiative in the South-South.', author: 'Press Office' },
  { id: 4, title: 'Ikpoba-Okha FC Perfect After Group Stage — All 4 Wins', category: 'Statistics', date: '2026-12-12', image: null, summary: 'Ikpoba-Okha FC are the only team with a 100% group stage record, winning all four matches to top Group C with 12 points and a +10 goal difference.', author: 'Sports Desk' },
  { id: 5, title: 'Quarter-Final Draw: Dream Clashes Confirmed for Dec 14', category: 'Tournament Updates', date: '2026-12-13', image: null, summary: 'The quarter-final lineup is set — Akoko-Edo Panthers vs Etsako Central and Ikpoba-Okha FC vs Esan West Rangers lead a day of four blockbuster knockout ties at Ugbowo Campus Main Bowl.', author: 'John Adeyemi' },
  { id: 6, title: 'Chukwuemeka Obi: 8 Goals in Group Stage — Golden Boot Race Heats Up', category: 'Awards', date: '2026-12-12', image: null, summary: 'Akoko-Edo Panthers striker Chukwuemeka Obi leads the Golden Boot race with 8 goals — three more than his nearest rival — as the knockout rounds approach.', author: 'Press Office' },
]

// ── Sponsors ─────────────────────────────────
export const sponsors = {
  platinum: [
    {
      name: 'His Royal Majesty, the Oba of Benin',
      image: '/sponsors/oba-of-benin.png',
      description: 'Royal Patron & Custodian of Benin Culture',
      website: '#',
      bio: "His Royal Majesty, the Oba of Benin, is the traditional ruler and custodian of the centuries-old Benin Kingdom. As Royal Patron of StarCraft Cup 2027, His Majesty lends the tournament the full weight of Benin's rich heritage and royal blessing, championing youth development and the preservation of culture through sport across Edo State.",
    },
    { name: 'Edo State Government', logo: '🏛️', image: '/edo-state-gov.jpeg', description: 'Official Government Patron & Host', website: '#' },
    { name: 'First Bank Nigeria',    logo: '🏦', image: '/firstbank-logo.jpeg', description: 'Official Banking Partner', website: '#' },
  ],
  gold: [
    { name: 'MTN Nigeria',    logo: '📶', image: '/mtn-logo.jpeg',        description: 'Official Telecommunications Partner', website: '#' },
    { name: 'Dangote Group',  logo: '🏭', image: '/dangote-logo.jpeg',    description: 'Official Corporate Sponsor', website: '#' },
    { name: 'Zenith Bank',    logo: '💳', image: '/zenith-bank-logo.jpeg', description: 'Official Financial Services Partner', website: '#' },
  ],
  silver: [
    { name: 'Indomie Nigeria', logo: '🍜', image: '/sponsors/indomie-logo.png',  description: 'Official Food Partner', website: '#' },
    { name: 'Pepsi Nigeria',   logo: '🥤', image: '/sponsors/pepsi-logo.png',    description: 'Official Beverage Partner', website: '#' },
    { name: 'UBA Bank',        logo: '🏪', image: '/sponsors/uba-logo.png',      description: 'Banking Support Partner', website: '#' },
    { name: 'Globacom',        logo: '📱', image: '/sponsors/globacom-logo.png', description: 'Media & Technology Partner', website: '#' },
  ],
  official: [
    { name: 'Nigeria Football Federation', logo: '⚽', image: '/sponsors/nff-logo.png',        description: 'Official Football Governing Body', website: '#' },
    { name: 'University of Benin',         logo: '🎓', image: '/sponsors/uniben-logo.png',     description: 'Official Host Institution', website: '#' },
    { name: 'Supersport',                  logo: '📺', image: '/sponsors/supersport-logo.png', description: 'Official Broadcast Partner', website: '#' },
    { name: 'Channels TV',                 logo: '🎙️', image: '/sponsors/channelstv-logo.png', description: 'Official Media Partner', website: '#' },
  ]
}

// ── Gallery ──────────────────────────────────
export const galleryItems = [
  { id: 1,  type: 'photo', category: 'Opening Ceremony', title: 'Premier Edition Opening Ceremony',       description: 'A spectacular opening at Ugbowo Campus Main Bowl — Dec 1, 2026' },
  { id: 2,  type: 'photo', category: 'Matches',          title: 'LGA Chairman XI vs Ex-Bendel Insurance', description: 'Action from the thrilling opening exhibition match' },
  { id: 3,  type: 'photo', category: 'Fan Moments',      title: 'All 18 LGAs in One Stadium',             description: 'Fans from every LGA fill the Ugbowo Campus Main Bowl' },
  { id: 4,  type: 'photo', category: 'Matches',          title: 'Ikpoba-Okha FC 4-0 Ovia South United',   description: 'Dominant group stage victory for the Group C leaders' },
  { id: 5,  type: 'video', category: 'Highlights',       title: 'Group Stage — Best Moments',             description: 'Top plays, goals, and celebrations from Dec 2–12' },
  { id: 6,  type: 'photo', category: 'Behind the Scenes','title': 'Team Training Sessions',               description: 'U17–U20 squads prepare at the Ugbowo Campus facilities' },
  { id: 7,  type: 'photo', category: 'Awards',           title: 'Obi Receives Man of the Match',          description: 'Chukwuemeka Obi collects his award after a hat-trick' },
  { id: 8,  type: 'video', category: 'Drone Footage',    title: 'Aerial: Ugbowo Campus Main Bowl',        description: 'Stunning drone footage of the group stage venue' },
  { id: 9,  type: 'photo', category: 'Opening Ceremony', title: 'Fireworks Over Ugbowo',                  description: 'The Premier Edition kicked off with a fireworks spectacular' },
  { id: 10, type: 'photo', category: 'Fan Moments',      title: 'Young Fans',                             description: 'The next generation of Edo football stars in the stands' },
  { id: 11, type: 'photo', category: 'Matches',          title: 'Quarter-Final: Akoko-Edo vs Etsako Central', description: 'Intense knockout action at Ugbowo Campus Main Bowl' },
  { id: 12, type: 'video', category: 'Highlights',       title: 'Top Goals — Premier Edition',            description: 'The best strikes from Dec 1–20, 2026' },
]

// ── Organizing Committee ──────────────────────
export const committeeMembers = [
  { name: 'Chief James Osagie Edomwonyi', role: 'Tournament Chairman',       bio: 'Respected community leader with 20+ years of sports administration experience in Edo State.' },
  { name: 'Dr. Amina Uzamere',            role: 'Secretary General',          bio: 'Sports lawyer and youth development advocate. Mastermind behind the U17–U20 tournament structure.' },
  { name: 'Mr. Festus Ogbeifun',          role: 'Technical Director',         bio: 'Former professional footballer and UEFA-certified coach. Oversees all technical aspects of the competition.' },
  { name: 'Mrs. Grace Aigbe',             role: 'Marketing & Sponsorship',    bio: 'Brand strategist with deep corporate connections. Secured all major tournament sponsors.' },
  { name: 'Engr. Richard Omokhafe',       role: 'Facilities Director',        bio: 'Civil engineer who managed both Ugbowo Campus Main Bowl and Ogbemudia Main Bowl preparations.' },
  { name: 'Miss Blessing Osaghae',        role: 'Media & Communications',     bio: 'Broadcast journalist and social media expert handling all tournament communications.' },
]

// ── Prize Structure ───────────────────────────
export const prizeStructure = [
  { position: '🥇 Champion',         prize: '₦5,000,000', additional: 'Trophy + Medals + Promotion Pathway' },
  { position: '🥈 Runner-Up',        prize: '₦2,500,000', additional: 'Trophy + Medals' },
  { position: '🥉 Third Place',      prize: '₦1,000,000', additional: 'Medal + Certificate' },
  { position: '4th Place',           prize: '₦500,000',   additional: 'Certificate' },
  { position: '🥅 Golden Boot',      prize: '₦300,000',   additional: 'Golden Boot Trophy' },
  { position: '🧤 Golden Glove',     prize: '₦200,000',   additional: 'Golden Glove Trophy' },
  { position: '⭐ Best Player',      prize: '₦250,000',   additional: 'MVP Trophy' },
  { position: '🌟 Best Young Player',prize: '₦150,000',   additional: 'Rising Star Award' },
]

// ── Tournament Stats ──────────────────────────
export const tournamentStats = {
  totalTeams: 20,
  totalMatches: 53,   // 40 group + 4 QF + 2 SF + 2 final/3rd + 2 exhibition
  totalGoals: 74,
  totalAttendance: '62,000+',
  matchesPlayed: 17,
  avgGoalsPerMatch: 4.4,
  topScorer: 'Chukwuemeka Obi',
  topScorerGoals: 8,
  groups: 4,
  ageGroup: 'U17–U20',
  editions: ['2026', '2027', '2028', '2029', '2030'],
}
