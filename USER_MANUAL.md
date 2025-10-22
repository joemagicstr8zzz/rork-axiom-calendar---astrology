Axiom Calendar — Start Here + User Manual

Welcome. This guide is a clear, friendly reference for setting up your calendar, creating Events and Reminders, and running a single, intentional Quote of the Day that can be sourced from Inject and optionally polished by AI (GPT). It also includes a practical “Start Here,” scripting/performance tips, real‑world scenarios, and broader historical reasoning for using a calendar.

Start Here (5‑minute setup)
1) Open the app to the Month screen
- Tap dates to view their Day details. The Add bar or + creates new items.

2) Decide how you’ll create quotes
- Manual: Type the quote yourself in Notes.
- Semi‑auto: Provide an Inject endpoint that returns JSON { "value": "your text" } and use that raw text.
- Polished by AI: Turn the Inject value into a ready‑to‑share quote by enabling GPT in Settings.

3) Set a single Reveal Day for the Quote of the Day
- Only one reveal day can exist at a time. Setting a new reveal day replaces the previous.
- If a reveal day is already set, the quote appears right away when you land on the Month screen with that day selected.

4) Add your normal items
- Events and Reminders are separate from the Quote. They show as small bars on the Month view and full details in Day details.

5) Confirm Inject is working (if used)
- In Settings, paste your Inject address (without http/https) and tap Validate. We expect JSON with a single field named value.

Core Concepts
- Event: Anything scheduled (meeting, birthday, rehearsal). Can include location, times, notes, repeat, alerts.
- Reminder: A lightweight event that nudges you at a chosen time.
- Quote of the Day: One intentional quote attached to a single reveal date. Appears on that date’s Day details; the month grid can show a colored indicator.
- Inject: A simple JSON source for a single value field. Example payload: { "value": "courage" }.
- GPT Polishing (optional): Converts Inject value into a succinct, attributed quote. If GPT fails, we fall back to raw Inject.
- Focus of the Month: A guiding word/phrase you choose per month (e.g., January = Foundation, February = Connection). It’s a thematic lens that informs your quote selection and event planning.

How Quotes Work (at a glance)
- One reveal day at a time: The latest setting wins; older reveal days are replaced.
- Where it shows: Full quote in Day details. The month grid shows a small indicator to hint something is scheduled.
- When it shows: If a reveal day is set, the quote appears as soon as you open the app and that day is selected—no extra taps needed.
- Live updates: When Inject changes while you’re on the calendar, the preview updates within about a second.

Create a Quote of the Day
1) Tap Add (bar or +) on the Month screen.
2) Choose Quote (or the Quote template).
3) Pick the reveal date. Remember: only one reveal date exists at a time.
4) If Inject and GPT are enabled, review the preview. You can still edit Notes.
5) Save. The quote is now attached to that date.

Add Events or Reminders
- From Month or Day details, tap Add. Fill in Title, Date, times, reminder, repeat, location, notes, or attachments. Save. Items appear in Month and Day views.

Settings — Plain English
- Inject
  • Purpose: Feed a single word/short text that represents your quote theme.
  • Address: Enter without http/https (e.g., 11z.co/_w/123456/selection).
  • Format: JSON with a value field only. Example: { "value": "renewal" }.
  • Tools: Validate to check status; Timeout controls how long we wait.
- Use GPT Translation (optional)
  • Purpose: Turn Inject value into a refined quote with attribution.
  • How: Provide OpenAI key, choose a model, enable the toggle, and optionally customize the prompt.
  • Validate: Verifies your key/model.
- Quote day default
  • Purpose: Pre‑fill a date when creating a Quote (Today, Tomorrow, or custom).
- Performance time zone
  • Purpose: Keep date math consistent across locales.

Real‑World Scenarios
- Client coaching cadence
  • Focus of the Month: January = Foundation. Inject surfaces a daily cue (e.g., resilience). GPT refines it into a clean reflection. You schedule one reveal day per week for group focus.
- Studio production schedule
  • Events track milestones; Reminders nudge handoffs. A single Quote reveals on sprint kickoff day to set tone (e.g., craft, clarity, rhythm).
- Ritual calendar for practitioners
  • Focus aligns with lunar phases or seasonal rites. Inject cycles a virtue; the quote reveals on the key ritual date. Everything stays contained in one day to avoid clutter.
- Sales team momentum
  • Monday reveal day sets intent (service, integrity). Events capture calls, demos; Reminders handle follow‑ups. Single weekly reveal prevents notification fatigue.

Scripting & Performance Tips
- Keep Inject minimal and stable
  • Use a cached endpoint that returns only { "value": "…" }. Avoid large payloads, HTML, or changing keys.
- Debounce your updates
  • If your backend updates value rapidly, gate changes to at most once every few seconds to avoid flicker.
- Keep quotes succinct
  • Aim for 1–3 lines. Long quotes truncate on smaller screens. Let Notes hold any extended commentary.
- Time zones
  • Set and stick to a performance time zone in Settings so reveal days behave the same for distributed teams.
- GPT prompting
  • Be explicit about tone and length. Example: “One original, inspiring line with author name; add plausible dates if unknown.”
- Offline behavior
  • On save, the final quote text is written into Notes so it’s still visible without network.
- Testing checklist
  • Change Inject value; confirm preview updates on the Month screen.
  • Set a reveal day; reopen app to Month; ensure the quote is already visible for that date.
  • Replace the reveal day; confirm only the new date shows a quote.
  • Turn off GPT; ensure raw Inject text is used. Break Inject; confirm graceful fallback.

Why a Calendar? Practical and Philosophical
- Calendars are human tools for rhythm: agricultural seasons, liturgical cycles, studio sprints, and personal rituals. They transform intention into scheduled action. A single reveal day for a Quote enforces focus—one theme, one anchor—rather than fragmented inspiration.
- Historically, calendars united communities around shared moments (harvests, festivals, markets) and synchronized effort. Philosophically, they embody the dance of cyclical time (seasons) with linear progress (projects). By binding quotes to dates, we move from vague aspiration to timed commitment.

Troubleshooting
- Inject doesn’t change
  • Ensure the endpoint returns JSON with value. Use Validate in Settings.
- Quote didn’t appear
  • Confirm the reveal day is set for that date. Only one reveal day can exist.
- Old quote persists
  • Wait a second on the Month screen for the preview to refresh, or reopen the app to that month view with the date selected.
- GPT errors
  • Recheck key/model and run Validate. We fall back to raw Inject automatically.

Privacy & Safety
- Keep your Inject URL and API keys private. They are stored locally on your device.

Glossary
- Reveal Day: The single date on which the Quote of the Day appears.
- Inject: A JSON endpoint returning { "value": "…" } only.
- Focus of the Month: Your thematic word guiding quotes and planning.
- Preview: The currently computed text shown before saving.

You’re set. Use Focus to pick an intentional theme, Inject to keep inputs simple, GPT to refine when needed, and the calendar to turn ideas into timed, visible action.