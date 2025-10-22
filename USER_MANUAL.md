# User Manual — Axiom Calendar (Quote of the Day)

This guide explains how to use the Quote of the Day and one-day event features, Inject and OpenAI integrations, and the updated Day layout.

## Quick Start

- Open the app to the month calendar. The selected day shows its events and Quote of the Day card in Day Detail.
- Tap the Add event bar to create an event. The plus button on the right opens the same editor.

## Quote of the Day

- Appears only on the selected date’s Day Detail and a small bar in the month grid cell.
- The quote is saved into the event notes so it renders offline.
- Only one quote is generated per save; no pop-up notifications.

### Live updates from Inject

- When the app is open on the calendar screen, if the Inject value changes on your endpoint, the quote updates automatically within about a second without tapping anything.

## Settings

Open Settings to configure sources and defaults.

### Inject

- Enabled: Toggle to allow automatic sourcing of the word.
- Endpoint: Enter without protocol, like 11z.co/_w/123456/selection
- Timeout: Network timeout in seconds.
- Validate: Tests the endpoint and shows status.

Expected JSON: { "value": "word", ... } Only value is used.

### Use GPT Translation

- Enabled: Toggle to enable OpenAI polishing/generation.
- API Key: Your OpenAI key.
- Model: e.g., gpt-4o-mini or a supported model.
- Prompt: Editable template used to turn the Inject word into a quote.
- Validate: Verifies key/model.

Recommended prompt template:
Write a short, real inspirational quote about the word "{word}" if one exists with the real author and birth–death years. If none exists, create a plausible original quote with a believable author and birth–death years. If the author is alive, use “YYYY–present”. Return only the quote and attribution.

### Quote Day Default

- Today, Tomorrow, or Pick a date. This pre-fills the Date field in the Add Quote flow.

### Performance Time Zone

- All dates are saved using the performance time zone.

## Adding an Event

1) From Day Detail, tap Add event on {DATE} or the right-aligned plus button.
2) In Event Editor, fill fields:
- Title
- All day toggle. If off, Start time → End time appear
- Date (single day only)
- Location (optional)
- Calendar (defaults to My calendars or Axiom)
- Reminder (minutes before)
- Repeat (Don’t repeat by default)
- Notes
- Attachment (optional)
- Time zone
3) Footer: Cancel or Save.

### Event Sources (read-only mirror)

- Shows Inject status and endpoint when ON
- Shows Use GPT status and a validity badge when ON
- Displays This will display: “{preview quote}” when both are ON; with Inject-only, shows raw Inject value; with both OFF, the quote field is manual via Title/Notes.

## Quote Event Behavior

- Type: Quote or Regular.
- Quote of the Day events are detected when you choose the Quote type or title contains "Quote of the Day".
- On Save:
  - If Inject is ON: fetch selection → use text
  - If GPT is ON too: polish/generate final quote using the prompt
  - If Inject fails: fall back to last preview; if none, use Notes
  - If GPT fails: fall back to raw Inject text
- Final text is saved into notes. Rendered in Day Detail body, clamped to 4 lines; tap to open full event.

## Day Detail Layout

- Focus line and Astrology badge share the same top row.
- Two info boxes below are tightened to about half height with adjusted padding.
- Add event bar sits above Android navigation buttons; plus is right-aligned and vertically centered with the bar text.

## Month Grid Rendering

- The selected day’s cell shows a thin horizontal bar for each event (up to 3). Quote events use the app color scheme.

## Event Detail Screen

- Title, date, calendar, and full body text.
- Bottom actions: Duplicate, Edit, Share, Delete, More.

## Privacy & Safety

- Do not share Inject IDs or API keys publicly. They are stored locally on-device.

## Troubleshooting (Quotes)

- Repeating quotes generating: Ensure only one of Inject + GPT flows is triggered at save; do not repeatedly tap Save.
- Inject not updating: Verify the endpoint format (no http://), ensure it returns value, and Validate in Settings.
- GPT errors: Check API key/model, then Validate. The app falls back to raw Inject text automatically.
- Live update not visible: Make sure the calendar screen is open and the device has network connectivity.
