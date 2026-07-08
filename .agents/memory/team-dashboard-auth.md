---
name: Team-dashboard auth model
description: How team-rep-facing routes authenticate, vs admin/user session routes
---

Team representatives are not logged-in users — they have no session. Their identity for
self-service routes (viewing/editing their own registration, adding/editing/removing
players, uploading player photos) is proven by knowing both the registration `ref` and a
per-registration `dashboardToken`, compared with a constant-time buffer comparison
(`crypto.timingSafeEqual`).

**Why:** Admin/staff use real sessions (`requireAuth`/`requireAdmin` middleware), but team
reps only get a link with `ref` + `token` query params from their registration email. There
is no user account to attach a session to.

**How to apply:** Any new route that lets a team rep act on their own registration must
accept `ref` (URL param) and `token` (body or query, depending on HTTP method — PATCH/POST
use body, GET/DELETE use query) and validate them against the stored `dashboardToken` the
same way, not via `requireAuth`/`requireAdmin`. Also re-check `registration.status !==
'rejected'` before allowing mutations — rejected registrations are locked.
