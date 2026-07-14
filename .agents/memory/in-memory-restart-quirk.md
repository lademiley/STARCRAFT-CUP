---
name: In-memory data & backend restarts
description: All Maps (users, chairmen, players, fans, teamRegistrations, orders) are now persisted to server/data/*.json so restarts no longer wipe accounts. Player phone/email indexes are rebuilt from the players Map on startup.
---

# In-memory data persistence

**Rule:** All data Maps are now mirrored to JSON files in `server/data/` via `persistMap()` / `loadMap()` helpers declared near the top of `server/index.js`. Any new Map that stores user-facing data must call `persistMap(name, map)` after every `.set()` / `.delete()` write.

**Why:** Replit restarts the Node process periodically. Before the fix, every restart wiped all accounts (users, LGA chairmen, players, fans, team registrations, orders), making accounts appear "deactivated". The fix is file-based persistence — no external database needed.

**How to apply:**
- New Map: initialize with `loadMap('mystore')` instead of `new Map()`
- New object (like siteContent/paymentSettings): initialize with `loadObj('name', defaultValue)`
- After every write: call `persistMap('mystore', myMap)` or `persistObj('name', obj)`
- Derived index Maps (like `playersByPhone`, `playersByEmail`): rebuild from the primary Map in a loop after `loadMap()`, do not persist them separately

**Also note:** `siteContent` and `paymentSettings` use `persistObj` / `loadObj`. `siteContent` keeps its hardcoded default block and then calls `siteContent = loadObj('siteContent', siteContent)` immediately after the closing `}` to override with any saved admin edits.
