# Codebase Improvement Plan

## Status: COMPLETED

All phases of the improvement plan have been executed. See summary below.

## Executive Summary

This plan identified specific issues across the Pickle.me codebase, prioritized by severity. The guiding principle was simplicity—prefer lean code over over-engineered solutions.

---

## CRITICAL ISSUES

### 1. Route Protection Not Working (proxy.ts)
**Severity:** CRITICAL
**Files:** `src/proxy.ts`

**Problem:** The `proxy.ts` file is NOT being executed as middleware. Next.js middleware must be named `middleware.ts` and located in `src/`. The current file exports a `config` with matchers, but is never invoked—**all protected routes are currently unprotected**.

**Fix:**
- Rename `src/proxy.ts` → `src/middleware.ts`
- Verify the middleware runs by checking server logs

**Impact:** `/games`, `/pickle`, `/profile` are accessible without authentication.

---

### 2. Race Condition in useMatchingGame.ts
**Severity:** CRITICAL
**Files:** `src/hooks/useMatchingGame.ts:48-105`

**Problem:** In `handleCardClick`, `setTimeout` captures `flippedCards` from closure. Rapid clicks during flip animation can cause stale state, leading to incorrect card matching behavior.

**Fix:**
```typescript
// Use functional update to get latest state
setTimeout(() => {
  setCards((prevCards) => {
    const currentFlipped = prevCards.filter(c => c.isFlipped && !c.isMatched);
    // ... use currentFlipped instead of flippedCards
  });
}, 1000);
```

---

### 3. Race Condition in usePicklePopGame.ts - Uncleared Intervals
**Severity:** CRITICAL
**Files:** `src/hooks/usePicklePopGame.ts:140-180`

**Problem:** Two separate `useEffect` hooks manage intervals (`spawnIntervalRef` and `checkExpired`). If `endGame` is called while intervals are active, there's a race condition between clearing them.

**Fix:**
- Consolidate interval management into a single `useEffect`
- Ensure all intervals are cleared in cleanup before `endGame` completes

---

### 4. Race Condition in useReactionGame.ts - Timeout Stale Closure
**Severity:** CRITICAL
**Files:** `src/hooks/useReactionGame.ts:70-119`

**Problem:** Multiple `timeoutRef` updates without proper cleanup. `finishGame` can be called while `handleClick` has a pending timeout, causing the timeout handler to execute with stale `resultsRef`.

**Fix:**
- Clear existing timeout before setting a new one
- Use `useRef` for mutable result tracking with proper synchronization

---

### 5. Missing Core Pages
**Severity:** CRITICAL
**Files:** `src/app/` (missing directories)

**Problem:** Legal pages required for a public app are missing:
- `/about` - No page exists
- `/privacy` - Footer links to `#` (broken)
- `/terms` - Footer links to `#` (broken)
- `/not-found.tsx` - No custom 404 page
- `/error.tsx` - No error boundary page

**Fix:** Create these pages:
- `src/app/about/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/terms/page.tsx`
- `src/app/not-found.tsx`
- `src/app/error.tsx`

Update footer links in `src/components/layout/Footer.tsx:72-83`.

---

## IMPORTANT ISSUES

### 6. Firebase Operations Lack Error Handling
**Severity:** IMPORTANT
**Files:** `src/services/scoreService.ts:65-106`, `src/services/adviceService.ts:138-219`

**Problem:** All Firebase operations (`setDoc`, `getDocs`, `updateDoc`, `deleteDoc`) lack try/catch. Network failures or permission errors silently propagate.

**Fix:**
```typescript
async saveScore(params: SaveScoreParams): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.history, docId), { ... });
  } catch (error) {
    console.error('Failed to save score:', error);
    throw new AppError('Failed to save score', ErrorCodes.SAVE_FAILED);
  }
}
```

---

### 7. Auth Error Messages Not Shown to Users
**Severity:** IMPORTANT
**Files:** `src/providers/AuthProvider.tsx:67-74`

**Problem:** Sign-in errors are caught and logged to console but not surfaced to UI. Users see no feedback when authentication fails.

**Fix:**
- Add error state to AuthContext
- Display toast/alert on auth failure
- Components using `signInWithGoogle` should handle the thrown error

---

### 8. Post-Login Redirect Not Working
**Severity:** IMPORTANT
**Files:** `src/proxy.ts:72`, client-side login handling

**Problem:** Redirect parameter is set (`url.searchParams.set("redirect", pathname)`) but never used. After signing in from a protected route, users stay on home instead of returning to intended page.

**Fix:**
- Read `redirect` param after successful login
- Navigate to that path (with validation to prevent open redirect)

---

### 9. Session Cookie Security Issues
**Severity:** IMPORTANT
**Files:** `src/app/api/auth/session/route.ts:22-27, 59`

**Problems:**
1. `isSecureRequest()` uses OR logic incorrectly—should be AND
2. `sameSite: "lax"` should be `"strict"` for auth cookies

**Fix:**
```typescript
function isSecureRequest(request: NextRequest) {
  return (
    request.nextUrl.protocol === "https:" &&
    process.env.NODE_ENV === "production"
  );
}

// Line 59
sameSite: "strict",
```

---

### 10. Firestore Rules: Message Role Allows Assistant Impersonation
**Severity:** IMPORTANT
**Files:** `firestore.rules:46`

**Problem:** Rule validates `role in ['user', 'assistant']` but doesn't restrict which roles users can create. Users could create fake assistant messages in their threads.

**Fix:**
```javascript
// Change line 46 from:
&& request.resource.data.role in ['user', 'assistant']
// To:
&& request.resource.data.role == 'user'
```

---

### 11. Firestore Rules: No GameId Validation
**Severity:** IMPORTANT
**Files:** `firestore.rules:19-21`

**Problem:** `isValidGameId()` only checks for non-empty string. Users can submit scores for invalid game names.

**Fix:**
```javascript
function isValidGameId() {
  return request.resource.data.gameId in [
    'sequence-pickle', 'matching-pickles', 'speed-pickle',
    'pickle-pop', 'reaction-pickle', 'word-pickle'
  ];
}
```

---

### 12. Dark Mode Coverage Gaps in Games
**Severity:** IMPORTANT
**Files:**
- `src/components/games/SpeedPickle.tsx:30, 33`
- `src/components/games/MatchingPickles.tsx:25, 28`
- `src/components/games/SequencePickle.tsx:26, 29`

**Problem:** These games lack dark mode variants for CardHeader gradients and icon containers, causing poor contrast in dark mode.

**Fix:** Add dark mode variants:
```tsx
// Before
bg-gradient-to-r from-violet-50 to-purple-50

// After
bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20
```

---

### 13. Inline Styles in SpeedPickle
**Severity:** IMPORTANT
**Files:** `src/components/games/SpeedPickle.tsx:74-78`

**Problem:** Only component using inline `style={}` for dynamic colors. Breaks design system consistency.

**Fix:** Use CSS custom properties or Tailwind arbitrary values instead of inline styles.

---

### 14. Memory Leak in useSound.ts
**Severity:** IMPORTANT
**Files:** `src/hooks/useSound.ts:35-133`

**Problem:** Cleanup closes AudioContext, but pending `setTimeout` calls might try to play on closed context.

**Fix:**
```typescript
const pendingTimeouts = useRef<NodeJS.Timeout[]>([]);

// In playTone, track timeouts
const timeoutId = setTimeout(() => playTone(...), i * 50);
pendingTimeouts.current.push(timeoutId);

// In cleanup
return () => {
  pendingTimeouts.current.forEach(clearTimeout);
  audioContextRef.current?.close();
};
```

---

### 15. Stale Closure in useGameBase.ts saveScore
**Severity:** IMPORTANT
**Files:** `src/hooks/useGameBase.ts:36-63`

**Problem:** `saveScore` callback depends on `state.bestScore` but could use stale data if game state updates between end and save.

**Fix:** Pass score and bestScore as parameters rather than capturing from closure.

---

## NICE-TO-HAVE IMPROVEMENTS

### 16. Dead Code: Unused Error Utilities
**Files:** `src/lib/errors.ts`

**Remove:**
- `createError()` function - never used
- `AppError` class - defined but never instantiated
- `ErrorCodes` object - never referenced

---

### 17. Dead Code: Deprecated firebaseHelpers.ts
**Files:** `src/lib/firebaseHelpers.ts`

**Action:** Delete file entirely. Code should use `scoreService` directly.

---

### 18. Dead Code: Unused Exports
**Files:**
- `src/components/PageTransition.tsx` - Remove `staggerContainer`, `staggerItem`
- `src/components/ErrorBoundary.tsx` - Remove `withErrorBoundary()` HOC

---

### 19. Dead Code: Unused Type Definitions
**Files:** `src/types/user.ts`, `src/types/game.ts`

**Remove:**
- `UserProfile`, `UserGameScore` from user.ts
- `GameScore`, `GameState`, `Game` from game.ts

---

### 20. Unused Dependency
**Files:** `package.json`

**Remove:** `tailwindcss-animate` - Tailwind CSS 4.0 has built-in animation support.

---

### 21. Over-Engineered: Duplicate Layout Wrappers
**Files:**
- `src/app/games/layout.tsx`
- `src/app/pickle/layout.tsx`
- `src/app/profile/layout.tsx`

**Problem:** All three do identical thing: wrap `AuthGuard` around children. This is redundant since middleware should handle protection.

**Fix:** Remove AuthGuard from layouts once middleware is fixed, or create a shared protected layout.

---

### 22. Over-Engineered: Shell Re-export Indirection
**Files:**
- `src/components/home/HeroSection.tsx`
- `src/components/layout/Header.tsx`

**Problem:** Single-line files that re-export from subdirectories.

**Fix:** Import directly from actual component files.

---

### 23. Missing Barrel Exports
**Files:** Multiple directories

**Add `index.ts` to:**
- `src/components/games/`
- `src/components/layout/`
- `src/hooks/`
- `src/services/`
- `src/types/`

---

### 24. Firebase Files Not Grouped
**Files:** `src/lib/firebaseConfig.ts`, `src/lib/firebaseAdmin.ts`, `src/lib/firebaseHelpers.ts`

**Improvement:** Move to `src/lib/firebase/` subdirectory with barrel export.

---

### 25. No Cross-Tab Auth Sync
**Files:** `src/providers/AuthProvider.tsx`

**Problem:** If user logs out in Tab A, Tab B won't know until page refresh.

**Fix:** Use BroadcastChannel API or storage event listeners to sync auth state across tabs.

---

### 26. Storage Rules Missing File Size Limits
**Files:** `storage.rules:14-16`

**Fix:**
```javascript
match /users/{uid}/{allPaths=**} {
  allow read, write: if isOwner(uid)
    && request.resource.size < 50 * 1024 * 1024; // 50MB max
}
```

---

### 27. Inconsistent Error Display Styling
**Files:**
- `src/app/pickle/PickleContent.tsx:407-409` (has dark mode)
- `src/components/shared/LeaderboardTable.tsx:21-23` (missing dark mode, border)

**Fix:** Standardize error styling across components.

---

### 28. Missing Null Check for displayName
**Files:** `src/app/pickle/PickleContent.tsx:268`

**Fix:** Add null coalescing: `{user.displayName ?? 'User'}`

---

### 29. Game Naming Inconsistency
**Files:** `src/components/games/`

**Issue:** "MatchingPickles" (plural) vs "SpeedPickle" (singular).

**Recommendation:** Low priority, but standardize to singular "Pickle" suffix.

---

### 30. Extract Inline Components
**Files:**
- `src/components/games/WordPickle.tsx` - Extract `LetterTile` to `word/LetterTile.tsx`
- `src/components/games/MatchingPickles.tsx` - Extract instructions to `matching/MatchingRules.tsx`

---

## Implementation Priority

### Phase 1: Critical Security (Do First)
1. Rename `proxy.ts` → `middleware.ts` (#1)
2. Create missing legal pages (#5)
3. Fix session cookie security (#9)
4. Fix Firestore rules (#10, #11)

### Phase 2: Critical Bugs
5. Fix race conditions in game hooks (#2, #3, #4)
6. Add Firebase error handling (#6)
7. Fix auth error display (#7)
8. Fix post-login redirect (#8)

### Phase 3: Important Polish
9. Add dark mode to remaining games (#12)
10. Remove inline styles (#13)
11. Fix memory leaks (#14, #15)

### Phase 4: Cleanup
12. Remove dead code (#16-20)
13. Simplify over-engineered patterns (#21-22)
14. Improve organization (#23-24)

### Phase 5: Nice-to-Have
15. Cross-tab auth sync (#25)
16. Storage rules improvements (#26)
17. UI consistency fixes (#27-30)

---

## Files Changed Summary

| Category | Files to Modify | Files to Create | Files to Delete |
|----------|-----------------|-----------------|-----------------|
| Critical | 5 | 5 | 0 |
| Important | 12 | 0 | 0 |
| Nice-to-Have | 8 | 6 | 2 |
| **Total** | **25** | **11** | **2** |
