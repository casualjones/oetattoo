import html
import json
import re
import sys
import time
import urllib.request
from datetime import datetime

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36'
SEARCH_URL = 'https://www.eventbrite.com/d/ca--eureka/events/'
OUTPUT_FILE = 'events-data.json'
MAX_EVENTS = 30
SLEEP_SECONDS = 1.0


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return resp.read().decode('utf-8', errors='replace')


def parse_event_card(html_text):
    sections = re.findall(r'<section class="discover-vertical-event-card">(.*?)</section>', html_text, flags=re.S)
    events = []
    seen = set()
    for section in sections:
        link_match = re.search(r'<a\b[^>]*class="[^"]*event-card-link[^"]*"[^>]*href="([^"]+)"', section)
        if not link_match:
            link_match = re.search(r'<a\b[^>]*href="([^"]+)"[^>]*class="[^"]*event-card-link[^"]*"', section)
        if not link_match:
            continue
        url = html.unescape(link_match.group(1))
        location_match = re.search(r'data-event-location="([^"]+)"', section)
        location = html.unescape(location_match.group(1)) if location_match else ''
        if url in seen:
            continue
        seen.add(url)

        title_match = re.search(r'<h3[^>]*>(.*?)</h3>', section, flags=re.S)
        title = html.unescape(title_match.group(1).strip()) if title_match else 'Eventbrite Event'
        pvals = [html.unescape(re.sub(r'<[^>]+>', '', p).strip()) for p in re.findall(r'<p[^>]*>(.*?)</p>', section, flags=re.S)]
        time_text = ''
        if len(pvals) >= 2:
            time_text = pvals[1]
        events.append({
            'title': title,
            'url': url,
            'location': location or (pvals[2] if len(pvals) >= 3 else ''),
            'source': 'Eventbrite',
            'detail_time': time_text,
        })
        if len(events) >= MAX_EVENTS:
            break
    return events


def parse_json_ld(event_html):
    matches = re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>', event_html, flags=re.S)
    for raw in matches:
        try:
            data = json.loads(raw.strip())
        except json.JSONDecodeError:
            continue
        if isinstance(data, list):
            items = data
        else:
            items = [data]
        for item in items:
            if not item:
                continue
            type_val = item.get('@type') or item.get('@type', '')
            if isinstance(type_val, list):
                types = type_val
            else:
                types = [type_val]
            if any('Event' in t for t in types):
                return item
    return None


def parse_date(value):
    if not value:
        return None
    try:
        if value.endswith('Z'):
            value = value[:-1] + '+00:00'
        return datetime.fromisoformat(value)
    except ValueError:
        for fmt in ('%B %d, %Y %I:%M %p', '%a, %b %d • %I:%M %p', '%a • %I:%M %p'):
            try:
                return datetime.strptime(value, fmt)
            except ValueError:
                continue
    return None


def enrich_event(event):
    try:
        detail_html = fetch(event['url'])
    except Exception as exc:
        print('Failed to fetch event page:', event['url'], exc)
        return event

    data = parse_json_ld(detail_html)
    if not data:
        return event
    if data.get('name'):
        event['title'] = data['name']
    start_date = data.get('startDate') or data.get('start_date')
    if start_date:
        event['startDate'] = start_date
        dt = parse_date(start_date)
        if dt is not None:
            event['startDateIso'] = dt.isoformat()
    if data.get('location'):
        loc = data['location']
        if isinstance(loc, dict):
            name = loc.get('name')
            address = loc.get('address')
            if address and isinstance(address, dict):
                locality = address.get('addressLocality', '')
                region = address.get('addressRegion', '')
                if locality and region:
                    location = f"{name}, {locality}, {region}" if name else f"{locality}, {region}"
                else:
                    location = name or ''
            else:
                location = name or ''
            if location:
                event['location'] = location
    return event


def main():
    print('Fetching search page...')
    html_text = fetch(SEARCH_URL)
    print('Parsing Eventbrite cards...')
    events = parse_event_card(html_text)
    print(f'Found {len(events)} Eventbrite events.')
    enriched = []
    for idx, evt in enumerate(events, start=1):
        print(f'[{idx}/{len(events)}] Enriching:', evt['title'])
        enriched_event = enrich_event(evt)
        enriched.append(enriched_event)
        time.sleep(SLEEP_SECONDS)

    now = datetime.now().astimezone()
    enriched = [e for e in enriched if 'startDateIso' in e and parse_date(e['startDateIso']) and parse_date(e['startDateIso']) >= now]
    enriched.sort(key=lambda e: e.get('startDateIso', ''))

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(enriched, f, ensure_ascii=False, indent=2)
    print(f'Wrote {OUTPUT_FILE} with {len(enriched)} upcoming events.')


if __name__ == '__main__':
    main()
