Axiom Calendar — Friendly User Manual

Welcome! This guide explains, in plain language, how to use the calendar, add events, and work with Quotes of the Day. It also covers how the “Inject” source and optional AI polishing (GPT) can help you create cleaner quotes. No magic jargon required.

1) What you see on the Home screen
- Month view: A normal calendar. Tap any date to see that day’s details.
- Day details: Shows the selected date, any events for that day, and—if one exists—the Quote of the Day.
- Add event bar and + button: Two ways to add an event. They do the same thing.

2) Events, reminders, and quotes — what’s the difference?
- Regular event: Anything you schedule (meeting, birthday, etc.).
- Reminder: A lightweight event with an alert time. (You set this when creating an event.)
- Quote of the Day: A special one‑day event whose main content is a quote. It appears only on the date it belongs to and inside that date’s detail screen.

3) Quote of the Day rules
- Only one “Reveal Day” at a time: If you set a new reveal day, the previous one is replaced. There isn’t more than one reveal day.
- Where it shows: The full quote shows in that day’s detail screen. In the month grid, that day can show a small colored bar so you know something is scheduled.
- When it shows: If a reveal day is already set, the quote appears as soon as you open the app to the month screen and that day is selected. You don’t need to tap again.

4) How quotes are created
You can type a quote yourself, or let the app help gather and polish it:
- Inject (optional): Pulls a single piece of text from a simple web address you control. We only read a JSON field named "value". Example: { "value": "courage" }
- GPT polishing (optional): If enabled, the app takes the Inject word and asks AI to turn it into a clean, ready‑to‑use quote (with an author line). If AI is off, the app just uses the raw Inject text.
- Final storage: The text the app ends up with is saved into the event’s notes so it works offline.

Live updates from Inject
- If the app is open on the calendar screen and your Inject value changes on your endpoint, the quote preview updates on its own within about a second. You don’t need to tap anything.

5) Adding a Quote of the Day
- Step 1: Tap the Add event bar (or the + button) on the main screen.
- Step 2: In the editor, choose the event type as “Quote” (or use the Quote of the Day template if offered).
- Step 3: Pick the date for the quote. Remember: only one reveal day can be active at a time. Setting a new day will replace the previous one.
- Step 4: If Inject and GPT are on, the app shows a preview. You can still edit the final text in Notes if you want.
- Step 5: Save. The quote is now attached to that day.

6) Adding a regular event or reminder
- Open the Day details or tap the Add event bar from the month screen.
- Fill in Title, Date, and if needed, Start and End time.
- Optional: Location, which calendar it belongs to, reminder time, repeat, notes, attachment, and time zone.
- Save. The event appears as a small bar on the month view and in the Day details.

7) Settings explained simply
Inject
- Purpose: Automatically provide a single word or short text that represents your quote topic.
- How to set: Enter the address without http/https. Example: 11z.co/_w/123456/selection
- What we expect: JSON with a "value" field. Only that field is used.
- Tools: Validate checks the address and shows you the status. Timeout sets how long we wait.

Use GPT Translation (optional)
- Purpose: Turn the Inject word into a polished quote with an author line.
- How to set: Enter your OpenAI key and pick a model (e.g., gpt-4o-mini). Enable the toggle.
- Prompt: You can edit it. The default asks for a short, inspirational quote and attribution. If no real quote exists, it asks for a plausible original with birth–death years (or “present”).
- Validate: Confirms your key/model are working.

Quote day default
- Purpose: Pre-fill the date when you create a new Quote.
- Options: Today, Tomorrow, or Pick a date.

Performance time zone
- Purpose: Dates and times are saved consistently, regardless of where you are.

8) What you’ll see in the editor for quotes
- Sources box: Shows whether Inject and GPT are ON, and previews what will be saved.
- Save behavior:
  - If Inject is ON and GPT is OFF: We save the Inject value as your quote text.
  - If both are ON: We transform the Inject value into a polished quote.
  - If Inject fails: We fall back to the last preview if available, otherwise your manual text in Notes.
  - If GPT fails: We use the raw Inject value.

9) Viewing and finding things
- Month view: Shows up to a few small bars per day for scheduled items. Quote days are colored to match the app’s theme.
- Day details: Tap any date to see full info and read the quote if one exists for that day.

10) Troubleshooting
- Inject doesn’t change: Make sure the endpoint returns JSON with a "value" and use Validate in Settings.
- The quote didn’t appear: Confirm the reveal day is set to the right date. Only one reveal day can exist.
- Seeing an old quote: If your Inject endpoint changed, give it a second on the main calendar screen. If needed, reopen the app to the month screen with that day selected.
- GPT errors: Check your API key and model, then Validate. We’ll fall back to the raw Inject text automatically.

11) Privacy and safety
- Your Inject address and any API keys are stored locally on your device. Do not share them publicly.

That’s it! You now know how to create and reveal a Quote of the Day, schedule regular events and reminders, and control how quotes are sourced and polished. Enjoy.