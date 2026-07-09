---
name: Fan/Ticket identity model & simulated checkout
description: How the fan/ticket registration flow authenticates, prices tickets, and processes payment
---

Fans are a separate identity space from `users`/chairmen/players, keyed by canonical
(trimmed + lowercased) email in an in-memory `fans` Map, with their own session key
(`req.session.fanEmail`) — mirrors the chairman/player precedent of dedicated Maps + session
keys instead of reusing `AuthContext`.

**Why:** Legacy `users` map (`mode: 'individual'`) and `Tickets.jsx`/`Profile.jsx` already
existed for fan-ish flows but didn't satisfy the full registration → payment → approval →
digital-ticket lifecycle the redesign required, so a clean parallel system was built instead
of extending the legacy one. Legacy files were left in place as unlinked dead code.

**How to apply:** Any email-keyed identity map (fans, users, chairmen, players) must
canonicalize (`trim().toLowerCase()`) at every touch point — registration dedupe check,
storage key, and login lookup — or dedupe checks can be bypassed and accounts silently
overwritten/taken over. This was caught in code review after an initial mismatch between
the dedupe check and the storage key.

Payment gateway: the user was asked twice to choose a real processor (Stripe proposal was
dismissed) and never engaged, so a self-contained simulated secure checkout was built instead
(Luhn/expiry/CVV validation, only last-4 digits + a generated reference persisted, no real
processor call). Swap in Stripe/Whop later if the user wants a real processor — the checkout
route (`/api/fan/pay`) is the single integration point.
