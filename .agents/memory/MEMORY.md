# Memory Index

- [Team-dashboard auth model](team-dashboard-auth.md) — team-rep routes use ref+dashboardToken, not session auth; any new team-dashboard route must follow the token pattern.
- [Upload hardening convention](upload-hardening-convention.md) — reuse the shared magic-byte sniffing helper for any new file-upload feature instead of trusting client MIME/extension.
- [In-memory data & backend restarts](in-memory-restart-quirk.md) — this app's data lives in an in-memory Map; restarting the backend workflow wipes it, so re-seed test data after every restart.
- [Fan/Ticket identity model & simulated checkout](fan-ticket-identity-model.md) — fans are a separate email-keyed Map/session like chairmen/players; must canonicalize email everywhere; checkout is a simulated card gateway pending a real processor choice.
