---
name: In-memory data & backend restarts
description: This app has no persistent database yet — restarting the backend wipes all data
---

Team registrations, players, and gallery albums are held in in-memory `Map`s in the backend
process, with no database or disk persistence. Restarting the `Start application` workflow
(or the `node server/index.js` process specifically) clears all of this data back to empty.

**Why:** No persistence layer has been implemented yet — this is a known, tracked gap
(open project task: "Keep registration and team data after server restarts").

**How to apply:** When testing/verifying any feature that depends on existing registrations,
players, or albums, expect that data to disappear after any workflow restart triggered
during the same session (e.g. after a backend code change). Re-seed test data (register a
team, approve it, etc.) via the API after each restart rather than assuming previously
created test fixtures still exist.
