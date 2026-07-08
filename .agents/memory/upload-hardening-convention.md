---
name: Upload hardening convention
description: Standard pattern for handling any new file/image upload feature in this app
---

This app had a stored-XSS-via-upload risk in an earlier feature (gallery photo uploads),
fixed by never trusting client-supplied MIME type or filename extension. The fix pattern is
now the house standard for all uploads:

1. Use `multer` with `storage: multer.memoryStorage()` (never disk storage keyed off
   client filename/extension).
2. Sniff the real file type from the byte buffer via magic-byte detection (a shared
   `detectImageExt(buffer)` helper) instead of trusting `req.file.mimetype` or the
   original filename's extension. Reject if no known signature matches.
3. Write the file to disk yourself using a server-generated filename + the sniffed
   extension.
4. Serve the upload directory with `express.static` and set
   `X-Content-Type-Options: nosniff` on responses, so browsers can't be tricked into
   executing a mis-typed file.
5. Enforce `limits` (file size, file count) on the multer instance.

**Why:** Prevents a malicious upload (e.g. an HTML/SVG file renamed to `.png`) from being
served and executed as active content in the browser.

**How to apply:** Any new upload feature (e.g. player profile photos) should reuse the
existing `detectImageExt` helper and mirror this exact flow rather than re-deriving upload
validation from scratch.
