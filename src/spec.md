# Specification

## Summary
**Goal:** Make diary entry deletion reliably delete only the selected entry without causing redirects or unrelated “live video theme” screens.

**Planned changes:**
- Update the frontend delete UI handler to prevent any default navigation/submission behavior and ensure it never uses `window.location`, external links, or anchor/form-driven redirects.
- Add a backend API to delete exactly one diary entry owned by the authenticated user using the entry `timestamp` as the identifier.
- Wire the frontend delete action to call the new backend delete API for the selected entry and refetch/invalidate the React Query `['diaryEntries']` cache on success.
- Add English UI error handling for failed deletions without navigating away.

**User-visible outcome:** Deleting a diary entry removes only that entry, keeps the user on the diary UI (no redirects/new tabs/unrelated screens), and the list refreshes to reflect the deletion; failures show an English error message.
