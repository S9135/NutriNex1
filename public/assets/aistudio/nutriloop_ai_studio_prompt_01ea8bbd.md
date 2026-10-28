# NutriLoop: Master Prompt for Google AI Studio (Build Mode)

> **How to use this file**
> 1. Paste **Section A (Master Prompt)** into AI Studio Build mode as your first message.
> 2. After the app generates, paste the **Section B phase prompts** one at a time, testing each before moving on.
> 3. Use **Section C** as the system instructions inside the Gemini service calls.
> 4. Check the model picker for current Gemini Flash / Pro / Live model names before building, as they change often.

---

# SECTION A: MASTER PROMPT

```
You are an expert full-stack engineer and UX designer. Build a mobile-first
web app called "NutriLoop": a closed-loop digital therapeutic companion that
connects clinical data (lab reports) with daily nutrition behavior.

## PRODUCT GOAL
Help users understand their health screening results, translate them into
practical daily nutrition goals, track food intake with minimal effort
(photo, voice, scan), stay motivated through a fair scoring and rewards
system, and stay safe through reminders and a family emergency network.

## TECH STACK
- React + TypeScript + Vite, Tailwind CSS
- Google Gemini API via the @google/genai SDK
- State: React Context + a storage service layer (localStorage now, designed
  to be swapped for Firebase later)
- Charts: Recharts
- PWA-ready (manifest + service worker) so it can be installed on a phone

## CRITICAL ARCHITECTURE RULES
1. **AI vs. deterministic logic.** NEVER use the LLM to calculate TDEE,
   macro targets, scores, streaks, or rewards. Do those in plain TypeScript
   functions in `services/nutrition.ts` and `services/scoring.ts`.
2. **All Gemini calls live in one file:** `services/gemini.ts`, with typed
   functions, JSON schema responses (responseMimeType: application/json),
   error handling, retries, and timeouts. Add a clear comment that this
   layer must move behind a backend proxy before production so the API key
   is never exposed to the client.
3. **Human-in-the-loop.** AI output (food estimates, lab values, suggested
   goal changes) is NEVER saved or applied automatically. Always show an
   editable confirmation step first.
4. **Not a medical device.** The app educates and explains. It never
   diagnoses, prescribes, or advises starting/stopping medication. Show a
   persistent footer: "Educational use only. Not medical advice."
5. **Folder structure:** `src/services/` (gemini, nutrition, scoring,
   storage, notifications, family), `src/components/`, `src/pages/`,
   `src/types/`, `src/hooks/`, `src/utils/`.
6. Strict TypeScript types for every entity: UserProfile, Meal, FoodItem,
   LabReport, Biomarker, DailyScore, Badge, Reminder, FamilyMember,
   SOSEvent.

## DESIGN SYSTEM
- Calm, clinical-yet-friendly look: soft teal (#0F766E family) + white +
  warm neutral grays, with amber/red used only for alerts.
- Large tap targets (min 48px), accessible contrast (WCAG AA), readable
  type scale, light and dark mode, respects prefers-reduced-motion.
- Bottom tab navigation: Home, Log, Reports, Rewards, Care.
- Friendly, non-judgmental microcopy. Never use shame language about food
  or weight.

## FEATURE SET

### 1. Onboarding and Profile
- Collect: age, sex, height, weight, activity level (sedentary / light /
  moderate / active / very active), goal (lose / maintain / gain),
  dietary preferences (e.g., halal, vegetarian, low-sodium), allergies,
  known conditions (optional multi-select: diabetes, hypertension, high
  cholesterol, kidney disease, none), preferred language.
- Consent screen explaining that health data is sensitive, how it is
  stored, and that the user can export or delete all data at any time.

### 2. TDEE and Targets (deterministic)
- BMR via Mifflin-St Jeor. TDEE = BMR x activity factor
  (1.2, 1.375, 1.55, 1.725, 1.9).
- Goal calorie delta adjustable by the user, with SAFETY FLOORS: never
  suggest below 1,200 kcal (female) / 1,500 kcal (male) and cap weekly
  weight-change targets at a safe rate. Show a gentle warning if the user
  tries to go below.
- Derive daily targets for calories, protein, carbs, fat, fiber, sodium,
  and sugar. Condition-aware defaults (e.g., lower sodium for hypertension)
  but always editable and labelled as "suggested".
- Show the formula and the numbers used, so the calculation is transparent.

### 3. Food Logging: Photo, Scan, Voice, Manual
- **Photo/camera:** capture or upload a meal image. Send to Gemini
  multimodal with a JSON schema:
  `items[{name, portion_grams, calories, protein_g, carbs_g, fat_g,
  fiber_g, sugar_g, sodium_mg, confidence (0-1)}], overall_confidence,
  notes`. Display as editable rows (name, portion, macros). Warn when
  confidence < 0.6. Require a "Confirm and Log" tap.
- **Barcode/label scan:** use the browser BarcodeDetector API (fallback to
  a JS library such as zxing) and look up Open Food Facts. If not found,
  let the user photograph the nutrition label and have Gemini extract it
  into the same schema.
- **Voice logging:** user says "I had two eggs and toast with kopi". Parse
  into structured items, read back a summary, and ask for confirmation.
- **Manual entry** with a searchable local food list and recent/favorite
  foods for quick re-logging.
- Support common regional foods (e.g., Malaysian dishes such as nasi lemak,
  roti canai, char kuey teow) in prompts and examples.

### 4. Health Report Analyzer (clinical data)
- Upload PDF or image of a health screening / lab report (support multiple
  files and camera capture).
- Gemini extracts to JSON:
  `[{test_name, value, unit, reference_range, status: low|normal|high|
  critical, date, lab_name}]`. Show an editable review table so the user
  can correct OCR mistakes before saving.
- Then generate a plain-language explanation: what each abnormal value
  generally means, common lifestyle and nutrition factors related to it,
  and "questions to ask your doctor". Reading level: simple, ~Grade 8.
- Critical values or severe symptoms mentioned: show a prominent red
  banner advising prompt medical attention.
- Store results over time and show trend charts per biomarker with the
  reference range shaded.
- If the document is unreadable or not a lab report, say so; do not guess.
- Always end with: "Please discuss these results with your clinician."

### 5. Closed Loop: Clinical Data to Nutrition Behavior
- Map flagged biomarkers to SUGGESTED nutrition adjustments (rules table in
  code, not AI-generated numbers). Examples: high LDL -> raise soluble
  fiber target, lower saturated fat; high fasting glucose/HbA1c -> lower
  added sugar, emphasize fiber and protein pacing; high BP -> lower sodium.
- Present as "Suggested adjustments" cards. The user must Accept / Edit /
  Dismiss each. Show a banner recommending clinician review before
  adopting changes. Log every accepted change in a history timeline.
- After new lab reports, show a "Progress since last report" view linking
  nutrition adherence to biomarker changes (correlation language only,
  never causation claims).

### 6. Daily Score and Rewards (deterministic, healthy-by-design)
- Daily Nutrition Score (0-100) = weighted adherence: calories within
  range (30%), protein (20%), fiber (15%), fat/carb balance (15%),
  sodium/sugar limits (10%), logging completeness (10%). Score rewards
  being CLOSE to target, not extreme restriction. Over-restriction below
  the safety floor scores lower, never higher.
- Streaks, weekly summary, and milestone badges (e.g., 3 / 7 / 30 / 100
  days at 80+), with unlockable rewards: themes, avatar items, recipe
  packs, a shareable achievement card.
- Include an eating-disorder safeguard: no calorie-deficit leaderboards, no
  "perfect day" pressure, rest-day option that preserves streaks, and a
  gentle check-in if the user repeatedly logs very low intake, with
  supportive resource links.

### 7. Reminders and Alarms
- Reminder types: meals, water, medication, supplement, weigh-in, lab
  retest, exercise. Each with time, repeat days, snooze, and
  "taken / skipped" tracking.
- Use the Notifications API + service worker for web push; architect
  `services/notifications.ts` so scheduling is delegated to a backend
  (mock implementation now, clear TODO for Firebase Cloud Messaging +
  Cloud Scheduler).
- Medication reminders escalate: repeat after 10 min, then optionally
  notify a caregiver if still not confirmed.
- Add a visible note: "Browser alarms may not fire if the app is closed;
  backend push is required for reliable alerts."

### 8. Family Circle and Emergency
- Invite caregivers via code or link with granular sharing toggles per
  member: score only / daily log / lab flags / location during SOS.
  Every toggle off by default, revocable anytime.
- **SOS button** (always reachable): confirm-then-send, shares the
  user's location (Geolocation API), an editable preset message, and
  medical info card (conditions, allergies, medications, blood type) to
  chosen contacts. Also shows a one-tap "Call emergency services"
  button (999 / 112 for Malaysia, configurable by country).
- Optional inactivity check-in: if no app interaction in a set window, ask
  "Are you OK?"; if unanswered, alert the caregiver.
- Caregiver view: simple dashboard showing only what the user permitted.
- All sending goes through a mock `services/family.ts` with a clear
  interface so a real backend (SMS / WhatsApp / push) can plug in.

### 9. AI Coach (chat + voice)
- Chat and push-to-talk voice coach using Gemini (Live API where
  available). Context: profile, today's log, active targets, latest lab
  flags. Answers are short, practical, non-judgmental.
- Refuse diagnosis or medication changes; redirect to the clinician.
- Quick-action chips: "What should I eat for dinner?", "Explain my last
  report", "Swap suggestions for high-sodium meals".

### 10. Live Data (stub for later)
- Create an adapter interface `services/liveData.ts` for steps, heart
  rate, sleep, and glucose (CGM) data, with a mock provider and manual
  entry now. Show activity-adjusted calorie targets when steps data is
  present. Design it so Health Connect / Apple Health / Google Fit can be
  plugged in later.

## PRIVACY, SAFETY, AND COMPLIANCE UX
- Consent flows, data export (JSON/PDF), "Delete all my data" button.
- Mask sensitive data in screenshots/app-switcher where possible.
- Clear disclaimers on AI-estimated values ("estimates; verify").
- Design with PDPA (Malaysia) and GDPR-style principles in mind: data
  minimization, purpose limitation, explicit consent for sharing.
- Never log health data to console in production builds.

## QUALITY BAR
- Loading, empty, and error states for every screen.
- Graceful offline behavior for logging (queue and sync).
- Accessible: labels, focus order, screen-reader text for charts.
- Unit-testable pure functions for nutrition math and scoring; include
  tests for TDEE, safety floors, and score edge cases.
- Seed demo data (a sample user and a sample lab report) behind a
  "Load demo data" button so the app can be evaluated immediately.

## DELIVERY ORDER
Implement in this order and keep each phase working before the next:
1. Onboarding, TDEE, dashboard, manual logging, storage layer
2. Photo/barcode scan and food confirmation flow
3. Health report analyzer and trends
4. Closed-loop suggestions, scoring, rewards
5. Voice logging and AI coach
6. Reminders, Family Circle, SOS (mock backend)
7. Live-data adapter, polish, accessibility pass

Start now with Phase 1, and tell me what to test before moving to Phase 2.
```

---

# SECTION B: PHASE PROMPTS (paste one per message)

## Phase 2: Food vision
```
Add the "Scan Meal" flow. Use the device camera (getUserMedia) with an
upload fallback. Compress images client-side to max 1280px before sending.
Call Gemini with a JSON schema for items[] (name, portion_grams, calories,
protein_g, carbs_g, fat_g, fiber_g, sugar_g, sodium_mg, confidence) plus
overall_confidence and notes. Show editable rows with a portion slider that
rescales macros. Warn if confidence < 0.6. Never auto-log; require
"Confirm and Log". Add a barcode scanner with an Open Food Facts lookup and
a nutrition-label photo fallback.
```

## Phase 3: Report analyzer
```
Add the "Health Report" feature. Accept multiple PDFs/images. Extract
biomarkers into JSON (test_name, value, unit, reference_range, status,
date). Show an editable review table before saving. Generate plain-language
explanations and doctor questions for abnormal values. Add per-biomarker
trend charts with reference-range shading, a red banner for critical
values, and the closing line "Please discuss these results with your
clinician." Do not diagnose.
```

## Phase 4: Closed loop and rewards
```
Implement the rules table mapping flagged biomarkers to suggested nutrition
target adjustments. Show them as Accept / Edit / Dismiss cards with a
clinician-review banner and a change-history timeline. Implement the
deterministic Daily Score, streaks, rest days, milestone badges, and the
Rewards screen. Enforce calorie safety floors and add the supportive
check-in for repeated very-low intake.
```

## Phase 5: Voice and coach
```
Add voice food logging and a push-to-talk coach using the Gemini Live API
(fall back to speech-to-text + text model if unavailable). Parse spoken
meals into structured items, read back a summary, and ask for confirmation.
The coach must use profile, today's log, targets, and lab flags as context,
and must refuse diagnosis or medication advice.
```

## Phase 6: Reminders, family, SOS
```
Add reminders (meal, water, medication, weigh-in, lab retest) with snooze
and taken/skipped tracking. Build the Family Circle with invite codes and
granular sharing toggles (all off by default). Build the SOS flow:
confirm, location, preset message, medical info card, and a one-tap call
to emergency services. Add the optional inactivity check-in. Route all
sending through mock services with clean interfaces for a future backend.
```

## Phase 7: Polish
```
Run an accessibility and performance pass: ARIA labels, focus management,
chart text alternatives, color-contrast fixes, lazy-loading, offline queue
for logging, and a PWA manifest. Add unit tests for TDEE, safety floors,
scoring edge cases, and unit conversions. Add a data export and "Delete all
my data" flow.
```

---

# SECTION C: SYSTEM INSTRUCTIONS FOR GEMINI CALLS

### Lab report analyzer
```
You are a health-literacy assistant. You extract values from medical
screening reports and explain them in plain, simple language. You never
diagnose, prescribe, or advise starting, stopping, or changing medication.
Use the reference range printed on the report to set each value's status.
If a value is critical or the user mentions severe symptoms (chest pain,
trouble breathing, confusion, fainting), advise contacting a doctor or
emergency services promptly. If the document is unreadable or not a lab
report, say so instead of guessing. Do not invent values. Output valid JSON
exactly matching the provided schema.
```

### Food vision
```
Estimate nutrition from food images. Identify each distinct item, estimate
portion size in grams, and give macros per item. Be honest about
uncertainty: lower the confidence score for mixed dishes, sauces, drinks
with unknown sugar, or partly hidden food. Prefer common regional foods
when plausible (including Malaysian, Chinese, Indian, and Western dishes).
Never fabricate precision. Output valid JSON exactly matching the schema.
```

### Voice meal parser
```
Convert the user's spoken meal description into structured food items with
estimated portions and macros. If a portion or item is ambiguous, ask ONE
short clarifying question before finalizing. Always read back a summary and
wait for confirmation. Output valid JSON matching the schema.
```

### AI coach
```
You are a supportive nutrition coach inside a wellness app. Use the
provided profile, today's log, targets, and lab flags. Keep answers short,
practical, and non-judgmental. Never use shame language about food or body
weight. Never diagnose, prescribe, or change medication advice; refer
those questions to the user's clinician. If the user describes an
emergency or signs of an eating disorder or self-harm, respond with care
and direct them to emergency services or appropriate support.
```

---

# NOTES FOR BEFORE GOING LIVE

- **API key:** move all Gemini calls behind a backend proxy (e.g., Cloud Run or Cloud Functions) before real users.
- **Reliable alerts:** reminders, caregiver notifications, and SOS require a server-side scheduler and push/SMS delivery. A browser alone cannot guarantee them.
- **Regulation:** if you make clinical claims, check medical-device rules (MDA, Malaysia) and PDPA obligations for health data.
- **Validation:** have a dietitian or physician review the biomarker-to-nutrition rules table before release.
