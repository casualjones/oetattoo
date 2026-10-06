# Events feed maintenance

The monthly calendar is generated from public local calendars plus two reviewed
files:

- `events-supplemental.json` — approved one-off submissions
- `events-recurring.json` — recurring listings that are still active

## Approving a submission

Add an object to `events-supplemental.json` only after checking the original
listing. Each object needs a future ISO date and a public source URL:

```json
{
  "title": "Community class",
  "url": "https://example.org/event",
  "location": "Arcata, CA",
  "source": "Submitted listing",
  "detail_time": "6 p.m.",
  "startDateIso": "2026-10-15T18:00:00-07:00"
}
```

## Recurring listings

Recurring definitions use Python weekday numbers (`0` is Monday and `6` is
Sunday). Add `monthlyWeek: 1` for the first matching weekday of each month.
Only include a recurring item while its official source still confirms it.

The scheduled workflow regenerates the feed daily. Run
`python generate_events_json.py` locally when checking a new source or
submission.
