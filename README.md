# Practice Work #13 — Smart Campus Room Availability Checker (Code-Based vs. Low-Code)

## Scenario & Shared Rules
- **Room:** Room A-101
- **Existing Bookings (non-mutating):** `09:00–10:00`, `11:00–12:00`, `15:00–16:00`
- **Reference Current Time (`NOW`):** `08:00`
- **Duration Constraints:** `1` to `120` minutes (`0` and `121` rejected)
- **Data Policy:** Fictional campus data only; no real personal data or external secrets.

## Links & Artifacts
- **Low-Code Live Demo (Appsmith):** `https://app.appsmith.com/app/untitled-application-2/page1-6b05cb7f5441f3e820a02eb4`
- **Code-Based Live Demo / Source:** `https://smart-campus-room-av-nu0h.bolt.host`
- **Appsmith JSObject Code:** `appsmith/RoomAvailabilityJSObject.js`
- **T1–T8 Acceptance Test Spec:** `tests/checkAvailability.t1-t8.test.ts`
- **Screenshots:** Uploaded directly to the root of this repository (`appsmith` and `bolt` UI screenshots & Vitest `T1–T8` test output).

##  — Identical Test Execution (`T1–T8`)

| Test ID | Scenario | Inputs (`start`, `duration`, `blocked`) | Expected Result | Code-Based Result | Low-Code (Appsmith) Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **T1** | Valid free interval | `12:30`, `60 min`, `false` | `Available` (`AVAILABLE`) | `Available` (`AVAILABLE`) | `Available [AVAILABLE]: Room A-101 is available.` | Pass |
| **T2** | Overlap with existing booking (`11:00–12:00`) | `11:30`, `45 min`, `false` | `Unavailable` (`OVERLAP`) | `Unavailable` (`OVERLAP`) | `Unavailable [OVERLAP]: Overlaps with Algorithms Lab.` | Pass |
| **T3** | Blocked room | `12:30`, `60 min`, `true` | `Unavailable` (`ROOM_BLOCKED`) | `Unavailable` (`ROOM_BLOCKED`) | `Unavailable [ROOM_BLOCKED]: Room A-101 is blocked.` | Pass |
| **T4** | Duration = 0 | `12:30`, `0 min`, `false` | Validation error (`available: false`) | Validation error (`START_AFTER_END`) | Validation error (`INVALID_DURATION`) | Pass |
| **T5** | Duration = 121 minutes | `12:30`, `121 min`, `false` | Validation error (`available: false`) | Validation error (`EXCEEDS_MAX_DURATION`) | Validation error (`INVALID_DURATION`) | Pass |
| **T6** | Past start time | `07:30`, `30 min`, `false` | Validation error (`START_AFTER_NOW`) | Validation error (`START_AFTER_NOW`) | Validation error (`START_AFTER_NOW`) | Pass |
| **T7** | Adjacent non-overlapping interval | `10:00`, `60 min`, `false` | `Available` (`AVAILABLE`) | `Available` (`AVAILABLE`) | `Available [AVAILABLE]: Room A-101 is available.` | Pass |
| **T8** | Booking data unchanged after checks | Post-check room bookings state | Existing bookings preserved | Preserved (read-only `.find()`, no mutation) | Preserved (3 bookings intact in `JSObject1`) | Pass |

### Code-Based Test Suite Summary (Vitest)
- `src/lib/checkAvailability.test.ts` (38 tests) and `src/lib/explainAvailability.test.ts` (34 tests): **72 / 72 passed** (including all 8 `T1–T8` scenarios against Room A-101 with `NOW=480` / `08:00`), with lint, typecheck, and build passing.

## Task #06 — Engineering Effort Comparison

### Time Breakdown by Phase

| Phase | Code-Based (Bolt / TypeScript) | Low-Code (Appsmith Free Tier) |
| :--- | :--- | :--- |
| **Setup** | ~8 min | ~10 min |
| **Implementation** | ~12 min | ~10 min |
| **Debugging** | ~5 min | ~5 min |
| **Testing** | ~10 min | ~5 min |
| **Total Time** | **~35 min** | **~30 min** |

- **Acceptance Tests & Defects:** `8 / 8` passed in both implementations; `0` unresolved defects in core room availability logic.
- **Review, Export & Version Control:** Code-based work is version-controlled in Git with automated tests and type/lint checks; Appsmith is published via live deployment URL and platform snapshots/export rather than granular Git source diffs.
- **Measured Results vs. Personal Impressions:** Both approaches achieved full `8/8` test parity in ~30–35 minutes. Low-code was quick once on desktop for wiring widgets and previewing output (mobile touch drag-and-drop was awkward), whereas code-based work offered stronger automated testing, clean modularity, and full Git tracking.

## Task #07 — Security Review (Lecture #12)
- **Input Validation & Output Handling (Injection / XSS):** Inputs (`HH:MM` format, duration `1..120`, future start time) are validated prior to rule checks; text outputs render as plain text without HTML/script execution (`dangerouslySetInnerHTML` or unsafe JS evaluation is not used).
- **Permissions, Public Sharing, Secrets & Connectors:** Uses fictional room/booking data only; no real user data, credentials, tokens, or external database connectors are embedded. Public links/repos are shared without exposing secrets.
- **SCA (Dependencies & Platform Updates):** Code-based dependencies (`package.json` / lockfile) require periodic updates/audits; Appsmith runtime and hosting patches are managed by the platform vendor on the free tier while custom JS logic remains the author's responsibility.
- **DAST (Safe Manual Runtime Checks):** Manual boundary and negative checks (`0` min, `121` min, `07:30`, blocked flag, overlap `11:30` for `45` min, adjacent `10:00` for `60` min) ran only against the demo apps. No unauthorized scanning of third-party services was performed.

## Comparison Matrix

| Criterion | Code-Based (Bolt / TypeScript) | Low-Code (Appsmith Free Tier) |
| :--- | :--- | :--- |
| **Functional tests** | `8 / 8` (`72/72` total unit tests passed) | `8 / 8` (`T1–T8` verified on Room A-101) |
| **Build and repair time** | `~35 min` | `~30 min` |
| **Customization** | High (full UI/responsive control, pure logic, unit tests) | Moderate (standard widgets + custom JS expressions) |
| **Security controls** | Deterministic validation, safe text rendering, no secrets/connectors | Fictional data, regex/range checks in `JSObject`, vendor-managed runtime, careful public sharing |
| **Versioning / portability** | High (Git repository & portable source code) | Moderate (Appsmith URL & platform export) |
| **Ongoing cost** | Free (open-source stack & local/static workflow) | Free tier used (no paid subscription purchased) |

**Recommendation:** Use code-based development when deterministic business logic, automated regression tests, responsive UI control, and Git version control are needed; use low-code for rapid internal prototypes or demos on a free tier when requirements fit built-in widgets.

## AI-Use Reflection & Simulated / Incomplete Low-Code Behavior
- **AI Reflection:** AI assisted with test structure, edge cases, and report drafting, while all rules and test outcomes were verified deterministically rather than taken on faith.
- **Incomplete / Simulated Low-Code Behavior:** Uses in-memory fictional bookings and a fixed reference time (`08:00`) instead of a live campus scheduling database/API, and mobile touch drag-and-drop in the browser required desktop/JS configuration.
