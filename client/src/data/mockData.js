// =============================================
// STARCRAFT CUP 2027 — Mock Data
// =============================================

export const teams = [
  { id: 1, name: 'Edo Warriors', shortName: 'EDO', logo: '🦁', city: 'Benin City', coach: 'Emmanuel Okoro', group: 'A', played: 3, won: 3, draw: 0, lost: 0, gf: 9, ga: 2, gd: 7, points: 9, form: ['W','W','W'], color: '#D4AF37' },
  { id: 2, name: 'Oredo United', shortName: 'ORU', logo: '⚡', city: 'Oredo', coach: 'Victor Ihejirika', group: 'A', played: 3, won: 2, draw: 1, lost: 0, gf: 7, ga: 3, gd: 4, points: 7, form: ['W','D','W'], color: '#3B82F6' },
  { id: 3, name: 'Ugbowo Stars', shortName: 'UGS', logo: '⭐', city: 'Ugbowo', coach: 'Chidi Nwosu', group: 'A', played: 3, won: 1, draw: 1, lost: 1, gf: 4, ga: 5, gd: -1, points: 4, form: ['L','D','W'], color: '#10B981' },
  { id: 4, name: 'Sapele City FC', shortName: 'SAP', logo: '🌊', city: 'Sapele', coach: 'Emeka Eze', group: 'A', played: 3, won: 1, draw: 0, lost: 2, gf: 3, ga: 6, gd: -3, points: 3, form: ['L','W','L'], color: '#8B5CF6' },
  { id: 5, name: 'Warri Wolves', shortName: 'WAR', logo: '🐺', city: 'Warri', coach: 'Festus Agbamu', group: 'A', played: 3, won: 0, draw: 1, lost: 2, gf: 2, ga: 7, gd: -5, points: 1, form: ['L','L','D'], color: '#EF4444' },
  { id: 6, name: 'Ughelli Rangers', shortName: 'UGR', logo: '🦅', city: 'Ughelli', coach: 'Dickson Owie', group: 'A', played: 3, won: 0, draw: 0, lost: 3, gf: 1, ga: 8, gd: -7, points: 0, form: ['L','L','L'], color: '#F97316' },
  { id: 7, name: 'Benin Royals', shortName: 'BNR', logo: '👑', city: 'Benin City', coach: 'Austin Oghuvwu', group: 'B', played: 3, won: 2, draw: 1, lost: 0, gf: 8, ga: 2, gd: 6, points: 7, form: ['W','W','D'], color: '#EC4899' },
  { id: 8, name: 'Delta Eagles', shortName: 'DEL', logo: '🦆', city: 'Asaba', coach: 'John Ochuko', group: 'B', played: 3, won: 2, draw: 0, lost: 1, gf: 6, ga: 4, gd: 2, points: 6, form: ['W','L','W'], color: '#14B8A6' },
  { id: 9, name: 'Uromi FC', shortName: 'URO', logo: '🛡️', city: 'Uromi', coach: 'Peter Aigbe', group: 'B', played: 3, won: 1, draw: 2, lost: 0, gf: 5, ga: 4, gd: 1, points: 5, form: ['D','W','D'], color: '#6366F1' },
  { id: 10, name: 'Ekpoma Lions', shortName: 'EKP', logo: '🦁', city: 'Ekpoma', coach: 'Felix Idahosa', group: 'B', played: 3, won: 1, draw: 1, lost: 1, gf: 4, ga: 5, gd: -1, points: 4, form: ['W','L','D'], color: '#F59E0B' },
  { id: 11, name: 'Auchi City', shortName: 'AUC', logo: '🏰', city: 'Auchi', coach: 'Sunday Omotosho', group: 'B', played: 3, won: 0, draw: 1, lost: 2, gf: 2, ga: 6, gd: -4, points: 1, form: ['D','L','L'], color: '#84CC16' },
  { id: 12, name: 'Esan Warriors', shortName: 'ESA', logo: '⚔️', city: 'Irrua', coach: 'Mike Odalume', group: 'B', played: 3, won: 0, draw: 0, lost: 3, gf: 1, ga: 9, gd: -8, points: 0, form: ['L','L','L'], color: '#06B6D4' },
]

export const players = [
  { id: 1, name: 'Chukwuemeka Obi', position: 'Forward', team: 'Edo Warriors', teamId: 1, jersey: 9, age: 24, goals: 7, assists: 3, cleanSheets: 0, yellowCards: 1, redCards: 0, mvpVotes: 145, nationality: '🇳🇬', marketValue: '₦45M', rating: 9.1, bio: 'Prolific striker with explosive pace and clinical finishing. Former youth team standout.' },
  { id: 2, name: 'Victor Ehigie', position: 'Midfielder', team: 'Oredo United', teamId: 2, jersey: 8, age: 26, goals: 4, assists: 6, cleanSheets: 0, yellowCards: 2, redCards: 0, mvpVotes: 112, nationality: '🇳🇬', marketValue: '₦32M', rating: 8.7, bio: 'Creative playmaker with exceptional vision and passing range. Captain of Oredo United.' },
  { id: 3, name: 'Emmanuel Okuosa', position: 'Goalkeeper', team: 'Benin Royals', teamId: 7, jersey: 1, age: 28, goals: 0, assists: 0, cleanSheets: 5, yellowCards: 0, redCards: 0, mvpVotes: 98, nationality: '🇳🇬', marketValue: '₦28M', rating: 8.5, bio: 'Shot-stopper extraordinaire. Known for his reflexes and commanding presence in the box.' },
  { id: 4, name: 'Samuel Oriaifo', position: 'Defender', team: 'Edo Warriors', teamId: 1, jersey: 4, age: 25, goals: 1, assists: 2, cleanSheets: 0, yellowCards: 3, redCards: 0, mvpVotes: 87, nationality: '🇳🇬', marketValue: '₦25M', rating: 8.2, bio: 'Commanding centre-back. Leader at the back, strong in the air and tackles well.' },
  { id: 5, name: 'David Akhigbe', position: 'Forward', team: 'Delta Eagles', teamId: 8, jersey: 11, age: 22, goals: 5, assists: 4, cleanSheets: 0, yellowCards: 1, redCards: 0, mvpVotes: 76, nationality: '🇳🇬', marketValue: '₦30M', rating: 8.0, bio: 'Exciting winger with blistering pace. The youngest top scorer in the tournament.' },
  { id: 6, name: 'Peter Osagie', position: 'Midfielder', team: 'Ugbowo Stars', teamId: 3, jersey: 6, age: 27, goals: 3, assists: 5, cleanSheets: 0, yellowCards: 2, redCards: 0, mvpVotes: 65, nationality: '🇳🇬', marketValue: '₦20M', rating: 7.8, bio: 'Box-to-box midfielder with incredible stamina and work rate.' },
  { id: 7, name: 'Felix Agbonlahor', position: 'Forward', team: 'Oredo United', teamId: 2, jersey: 10, age: 23, goals: 4, assists: 3, cleanSheets: 0, yellowCards: 0, redCards: 0, mvpVotes: 60, nationality: '🇳🇬', marketValue: '₦22M', rating: 7.9, bio: 'Technical forward, excellent dribbler and has great awareness in tight spaces.' },
  { id: 8, name: 'Monday Ogunbor', position: 'Defender', team: 'Benin Royals', teamId: 7, jersey: 5, age: 30, goals: 0, assists: 1, cleanSheets: 0, yellowCards: 4, redCards: 0, mvpVotes: 42, nationality: '🇳🇬', marketValue: '₦18M', rating: 7.5, bio: 'Experienced defender, reads the game superbly. Team captain and mentor to younger players.' },
  { id: 9, name: 'John Uwaifo', position: 'Forward', team: 'Warri Wolves', teamId: 5, jersey: 7, age: 21, goals: 2, assists: 1, cleanSheets: 0, yellowCards: 1, redCards: 0, mvpVotes: 38, nationality: '🇳🇬', marketValue: '₦12M', rating: 7.2, bio: 'Young talent from Warri with a strong shot and direct playing style.' },
  { id: 10, name: 'Chris Ehigiamusoe', position: 'Midfielder', team: 'Uromi FC', teamId: 9, jersey: 14, age: 24, goals: 2, assists: 7, cleanSheets: 0, yellowCards: 1, redCards: 0, mvpVotes: 55, nationality: '🇳🇬', marketValue: '₦19M', rating: 7.7, bio: 'Assist machine. Deep-lying playmaker with superb distribution and set-piece delivery.' },
  { id: 11, name: 'Bright Omokhagbo', position: 'Goalkeeper', team: 'Edo Warriors', teamId: 1, jersey: 23, age: 26, goals: 0, assists: 0, cleanSheets: 6, yellowCards: 0, redCards: 0, mvpVotes: 72, nationality: '🇳🇬', marketValue: '₦24M', rating: 8.3, bio: 'Agile goalkeeper with exceptional distribution. Golden Glove favourite.' },
  { id: 12, name: 'Kingsley Idehen', position: 'Forward', team: 'Sapele City FC', teamId: 4, jersey: 9, age: 25, goals: 3, assists: 2, cleanSheets: 0, yellowCards: 2, redCards: 1, mvpVotes: 30, nationality: '🇳🇬', marketValue: '₦15M', rating: 6.9, bio: 'Powerful striker. Holds the ball up well and brings teammates into play.' },
]

export const fixtures = [
  // Completed
  { id: 1, homeTeam: 'Edo Warriors', awayTeam: 'Ughelli Rangers', homeScore: 4, awayScore: 0, date: '2027-03-01', time: '15:00', venue: 'University of Benin Bowl', status: 'completed', referee: 'James Okafor' },
  { id: 2, homeTeam: 'Oredo United', awayTeam: 'Sapele City FC', homeScore: 2, awayScore: 1, date: '2027-03-01', time: '17:30', venue: 'University of Benin Bowl', status: 'completed', referee: 'Paul Agbakoba' },
  { id: 3, homeTeam: 'Ugbowo Stars', awayTeam: 'Warri Wolves', homeScore: 1, awayScore: 1, date: '2027-03-03', time: '15:00', venue: 'Samuel Ogbemudia Stadium', status: 'completed', referee: 'Ehis Omoregie' },
  { id: 4, homeTeam: 'Benin Royals', awayTeam: 'Esan Warriors', homeScore: 3, awayScore: 0, date: '2027-03-03', time: '17:30', venue: 'Samuel Ogbemudia Stadium', status: 'completed', referee: 'Tom Adaeze' },
  { id: 5, homeTeam: 'Delta Eagles', awayTeam: 'Auchi City', homeScore: 2, awayScore: 0, date: '2027-03-05', time: '15:00', venue: 'University of Benin Bowl', status: 'completed', referee: 'John Onyeka' },
  { id: 6, homeTeam: 'Uromi FC', awayTeam: 'Ekpoma Lions', homeScore: 1, awayScore: 1, date: '2027-03-05', time: '17:30', venue: 'University of Benin Bowl', status: 'completed', referee: 'Chris Agoro' },
  // Upcoming
  { id: 7, homeTeam: 'Edo Warriors', awayTeam: 'Benin Royals', homeScore: null, awayScore: null, date: '2027-03-20', time: '15:00', venue: 'Samuel Ogbemudia Stadium', status: 'upcoming', referee: 'James Okafor', round: 'Quarter-Final' },
  { id: 8, homeTeam: 'Oredo United', awayTeam: 'Delta Eagles', homeScore: null, awayScore: null, date: '2027-03-20', time: '18:00', venue: 'Samuel Ogbemudia Stadium', status: 'upcoming', referee: 'Paul Agbakoba', round: 'Quarter-Final' },
  { id: 9, homeTeam: 'Ugbowo Stars', awayTeam: 'Uromi FC', homeScore: null, awayScore: null, date: '2027-03-22', time: '15:00', venue: 'University of Benin Bowl', status: 'upcoming', referee: 'Ehis Omoregie', round: 'Quarter-Final' },
  { id: 10, homeTeam: 'Warri Wolves', awayTeam: 'Sapele City FC', homeScore: null, awayScore: null, date: '2027-03-22', time: '18:00', venue: 'University of Benin Bowl', status: 'upcoming', referee: 'Tom Adaeze', round: 'Quarter-Final' },
  // Semi-Finals
  { id: 11, homeTeam: 'TBD', awayTeam: 'TBD', homeScore: null, awayScore: null, date: '2027-04-05', time: '15:00', venue: 'Samuel Ogbemudia Stadium', status: 'upcoming', referee: 'TBD', round: 'Semi-Final' },
  { id: 12, homeTeam: 'TBD', awayTeam: 'TBD', homeScore: null, awayScore: null, date: '2027-04-05', time: '18:30', venue: 'Samuel Ogbemudia Stadium', status: 'upcoming', referee: 'TBD', round: 'Semi-Final' },
  // Final
  { id: 13, homeTeam: 'TBD', awayTeam: 'TBD', homeScore: null, awayScore: null, date: '2027-04-20', time: '16:00', venue: 'Samuel Ogbemudia Stadium', status: 'upcoming', referee: 'TBD', round: 'Grand Final' },
]

export const liveMatches = [
  { id: 'L1', homeTeam: 'Edo Warriors', awayTeam: 'Benin Royals', homeScore: 2, awayScore: 1, minute: 67, venue: 'Samuel Ogbemudia Stadium', possession: [58, 42], shots: [12, 8], corners: [6, 3], fouls: [8, 11], status: 'live' },
]

export const news = [
  { id: 1, title: 'StarCraft Cup 2027 Officially Kicks Off to Massive Fanfare', category: 'Tournament Updates', date: '2027-03-01', image: null, summary: 'The highly anticipated StarCraft Cup 2027 kicked off in spectacular fashion at the University of Benin Bowl, Ugbowo, drawing thousands of football fans from across Edo State.', author: 'Sports Desk' },
  { id: 2, title: 'Chukwuemeka Obi Fires Edo Warriors to Dominant 4-0 Victory', category: 'Match Reports', date: '2027-03-02', image: null, summary: 'Striker Chukwuemeka Obi starred with a stunning hat-trick as Edo Warriors demolished Ughelli Rangers in the tournament opener.', author: 'John Adeyemi' },
  { id: 3, title: 'Edo State Governor Hails StarCraft Cup as Nation-Building Initiative', category: 'Press Releases', date: '2027-03-04', image: null, summary: 'Edo State Governor commended the organizers for delivering a world-class football event that showcases Edo talent on a national stage.', author: 'Press Office' },
  { id: 4, title: 'Golden Boot Race: Obi Leads with 7 Goals After Group Stage', category: 'Statistics', date: '2027-03-18', image: null, summary: 'With the group stage concluded, Edo Warriors\' Chukwuemeka Obi tops the scoring charts with 7 goals, two ahead of nearest rival David Akhigbe.', author: 'Sports Desk' },
  { id: 5, title: 'Quarter-Final Draw: Edo Warriors Face Benin Royals in Blockbuster Clash', category: 'Tournament Updates', date: '2027-03-15', image: null, summary: 'The quarter-final draw has produced a mouth-watering tie as tournament favourites Edo Warriors take on Benin Royals in what promises to be an epic encounter.', author: 'John Adeyemi' },
  { id: 6, title: 'Emmanuel Okuosa Named Best Goalkeeper of Group Stage', category: 'Awards', date: '2027-03-17', image: null, summary: 'Benin Royals keeper Emmanuel Okuosa received the Best Goalkeeper award for the group stage after keeping a record 5 clean sheets in 3 matches.', author: 'Press Office' },
]

export const sponsors = {
  platinum: [
    { name: 'Edo State Government', logo: '🏛️', description: 'Official Government Sponsor & Host', website: '#' },
    { name: 'First Bank Nigeria', logo: '🏦', description: 'Official Banking Partner', website: '#' },
  ],
  gold: [
    { name: 'MTN Nigeria', logo: '📶', description: 'Official Telecommunications Partner', website: '#' },
    { name: 'Dangote Group', logo: '🏭', description: 'Official Corporate Sponsor', website: '#' },
    { name: 'Zenith Bank', logo: '💳', description: 'Official Financial Services Partner', website: '#' },
  ],
  silver: [
    { name: 'Indomie Nigeria', logo: '🍜', description: 'Official Food Partner', website: '#' },
    { name: 'Pepsi Nigeria', logo: '🥤', description: 'Official Beverage Partner', website: '#' },
    { name: 'UBA Bank', logo: '🏪', description: 'Banking Support Partner', website: '#' },
    { name: 'Globacom', logo: '📱', description: 'Media & Technology Partner', website: '#' },
  ],
  official: [
    { name: 'Nigeria Football Federation', logo: '⚽', description: 'Official Football Body', website: '#' },
    { name: 'University of Benin', logo: '🎓', description: 'Official Host Institution', website: '#' },
    { name: 'Supersport', logo: '📺', description: 'Official Broadcast Partner', website: '#' },
    { name: 'Channels TV', logo: '🎙️', description: 'Official Media Partner', website: '#' },
  ]
}

export const galleryItems = [
  { id: 1, type: 'photo', category: 'Opening Ceremony', title: 'Tournament Opening Ceremony', description: 'A spectacular opening at Samuel Ogbemudia Stadium' },
  { id: 2, type: 'photo', category: 'Matches', title: 'Edo Warriors vs Ughelli Rangers', description: 'Action from the tournament opener' },
  { id: 3, type: 'photo', category: 'Fan Moments', title: 'The Fans Show Up', description: 'Thousands of fans fill the stadium' },
  { id: 4, type: 'photo', category: 'Matches', title: 'Goal Celebration', description: 'Obi celebrates his hat-trick' },
  { id: 5, type: 'video', category: 'Highlights', title: 'Group Stage Highlights', description: 'Best moments from the group stage' },
  { id: 6, type: 'photo', category: 'Behind the Scenes', title: 'Team Training', description: 'Edo Warriors in pre-match training' },
  { id: 7, type: 'photo', category: 'Awards', title: 'Player of the Match', description: 'Obi receives his award' },
  { id: 8, type: 'video', category: 'Drone Footage', title: 'Stadium Aerial View', description: 'Stunning drone footage of the venue' },
  { id: 9, type: 'photo', category: 'Opening Ceremony', title: 'Fireworks Display', description: 'Tournament kicked off with a fireworks show' },
  { id: 10, type: 'photo', category: 'Fan Moments', title: 'Young Fans', description: 'The next generation of football stars' },
  { id: 11, type: 'photo', category: 'Matches', title: 'Referee Decision', description: 'Referee awards a penalty kick' },
  { id: 12, type: 'video', category: 'Highlights', title: 'Top Goals Compilation', description: 'Best goals of the tournament so far' },
]

export const committeeMembers = [
  { name: 'Chief James Osagie Edomwonyi', role: 'Tournament Chairman', bio: 'Respected community leader with 20+ years of sports administration experience.' },
  { name: 'Dr. Amina Uzamere', role: 'Secretary General', bio: 'Sports lawyer and youth development advocate. Mastermind behind the tournament structure.' },
  { name: 'Mr. Festus Ogbeifun', role: 'Technical Director', bio: 'Former professional footballer and UEFA-certified coach. Oversees all technical aspects.' },
  { name: 'Mrs. Grace Aigbe', role: 'Marketing & Sponsorship', bio: 'Brand strategist with deep corporate connections. Secured the tournament\'s major sponsors.' },
  { name: 'Engr. Richard Omokhafe', role: 'Facilities Director', bio: 'Civil engineer who managed the stadium upgrade and venue preparations.' },
  { name: 'Miss Blessing Osaghae', role: 'Media & Communications', bio: 'Broadcast journalist and social media expert handling all tournament communications.' },
]

export const prizeStructure = [
  { position: '🥇 Champion', prize: '₦5,000,000', additional: 'Trophy + Medals + Promotion to State League' },
  { position: '🥈 Runner-Up', prize: '₦2,500,000', additional: 'Trophy + Medals' },
  { position: '🥉 Third Place', prize: '₦1,000,000', additional: 'Medal + Certificate' },
  { position: '4th Place', prize: '₦500,000', additional: 'Certificate' },
  { position: '🥅 Golden Boot', prize: '₦300,000', additional: 'Golden Boot Trophy' },
  { position: '🧤 Golden Glove', prize: '₦200,000', additional: 'Golden Glove Trophy' },
  { position: '⭐ Best Player', prize: '₦250,000', additional: 'MVP Trophy' },
  { position: '🌟 Best Young Player', prize: '₦150,000', additional: 'Rising Star Award' },
]

export const tournamentStats = {
  totalTeams: 12,
  totalMatches: 33,
  totalGoals: 89,
  totalAttendance: '47,500',
  matchesPlayed: 18,
  avgGoalsPerMatch: 4.9,
  topScorer: 'Chukwuemeka Obi',
  topScorerGoals: 7,
}
