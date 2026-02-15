# Schedule – Firestore collection

The schedule is loaded from the **`schedule`** collection (same pattern as `faqs`).

## Collection: `schedule`

Each document **must have real values** (not empty strings) for events to show.

### Fields the app uses

| Field       | Type   | Required | Description |
|------------|--------|----------|-------------|
| `name`     | string | yes      | Event name (e.g. "OPENING CEREMONY"). **Must not be empty.** |
| `time`     | string | yes      | Display time (e.g. "10:00 AM CT") |
| `day`      | string | yes      | `"saturday"` or `"sunday"` (defaults to "saturday" if missing) |
| `order`    | number | no       | Sort order for the day (0, 1, 2, …). Default 0. |
| `location` or `room` | string | no | Location (e.g. "ECSW ATRIUM"). Either name works. |
| `tag` or `eventType` | string | no | One of: `MANDATORY`, `FOOD`, `#FUN`, `WORKSHOP`, `SUPPORT`. Either name works. |

So you can use either **`location`** or **`room`**, and either **`tag`** or **`eventType`**.

## Example document

```json
{
  "day": "saturday",
  "name": "OPENING CEREMONY",
  "location": "LOCATION",
  "time": "10:00 AM CT",
  "tag": "MANDATORY",
  "order": 1
}
```

Or with your field names:

```json
{
  "day": "saturday",
  "name": "OPENING CEREMONY",
  "room": "ECSW ATRIUM",
  "time": "10:00 AM CT",
  "eventType": "MANDATORY",
  "order": 1
}
```

**Important:** If `name` is empty (`""`), that document is hidden. Fill in at least `name`, `time`, and (for correct day/order) `day` and `order`.

Events are sorted by `order` within each day. Updates in Firestore appear in real time on the site.
