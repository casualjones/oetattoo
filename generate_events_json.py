import html
import json
import re
import time
import urllib.request
from datetime import datetime

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36'
SEARCH_URL = 'https://www.northcoastjournal.com/community/'
OUTPUT_FILE = 'events-data.json'
MAX_EVENTS = 40
EVENTBRITE_URL = 'https://www.eventbrite.com/d/ca--eureka/music--events/'
EVENTBRITE_PAGES = 2
SLEEP_SECONDS = 1.0


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return resp.read().decode('utf-8', errors='replace')


def parse_community_cards(html_text):
    blocks = re.split(r'(?=<div class="wp-block-group community-card--stacked)', html_text)
    events = []
    seen = set()
    for block in blocks:
        if 'rdb-heading' not in block or 'wp-block-button__link rdb-button' not in block:
            continue
        title_match = re.search(r'<h3[^>]*class="[^"]*rdb-heading[^"]*"[^>]*>(.*?)</h3>', block, flags=re.S)
        time_match = re.search(r'<p[^>]*class="[^"]*rdb-block-data-time[^"]*"[^>]*>(.*?)</p>', block, flags=re.S)
        loc_match = re.search(r'<p[^>]*class="[^"]*has-dark-gray-color[^"]*"[^>]*>(.*?)</p>', block, flags=re.S)
        href_match = re.search(r'<a[^>]+class="[^"]*wp-block-button__link rdb-button[^"]*"[^>]*href="([^"]+)"', block)
        if not title_match or not href_match:
            continue
        title = html.unescape(re.sub(r'<[^>]+>', '', title_match.group(1)).strip())
        url = html.unescape(href_match.group(1).strip())
        if url in seen:
            continue
        seen.add(url)
        detail_time = html.unescape(re.sub(r'<[^>]+>', '', time_match.group(1)).strip()) if time_match else ''
        location = html.unescape(re.sub(r'<[^>]+>', '', loc_match.group(1)).strip()) if loc_match else ''
        events.append({
            'title': title,
            'url': url,
            'location': location,
            'source': 'North Coast Journal',
            'detail_time': detail_time,
        })
        if len(events) >= MAX_EVENTS:
            break
    return events


def parse_eventbrite_location(loc):
    if not isinstance(loc, dict):
        return ''
    name = loc.get('name', '')
    address = loc.get('address', {})
    if isinstance(address, dict):
        locality = address.get('addressLocality', '')
        region = address.get('addressRegion', '')
        street = address.get('streetAddress', '')
        parts = [part for part in (name, street, locality, region) if part]
        return ', '.join(parts)
    return name or ''


def parse_eventbrite_datetime(value):
    if not value:
        return None, ''
    dt = parse_date(value)
    if not dt:
        return None, ''
    time_part = dt.strftime('%-I:%M %p') if dt.hour or dt.minute else ''
    return dt, time_part


def parse_eventbrite_events(html_text):
    events = []
    matches = re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>', html_text, flags=re.S)
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
            if not isinstance(item, dict):
                continue
            elements = item.get('itemListElement') if item.get('@type') == 'ItemList' else None
            if not elements and item.get('@type') == 'ListItem':
                elements = [item]
            if not elements:
                continue
            for element in elements:
                event_obj = element.get('item') if isinstance(element, dict) else None
                if not event_obj or event_obj.get('@type') != 'Event':
                    continue
                url = event_obj.get('url', '').strip()
                if not url:
                    continue
                title = event_obj.get('name', '').strip() or 'Eventbrite Event'
                start_date = event_obj.get('startDate', '').strip()
                dt, time_str = parse_eventbrite_datetime(start_date)
                location = parse_eventbrite_location(event_obj.get('location', {}))
                events.append({
                    'title': html.unescape(title),
                    'url': html.unescape(url),
                    'location': html.unescape(location),
                    'source': 'Eventbrite',
                    'startDate': start_date,
                    'detail_time': time_str,
                    'startDateIso': dt.isoformat() if dt else None,
                })
    return events


def parse_json_ld(html_text):
    matches = re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>', html_text, flags=re.S)
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
            type_val = item.get('@type') or ''
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
    if isinstance(value, datetime):
        return value
    value = value.strip()
    if value.endswith('Z'):
        value = value[:-1] + '+00:00'
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        for fmt in (
            '%B %d, %Y %I:%M %p',
            '%b %d, %Y %I:%M %p',
            '%a, %b %d • %I:%M %p',
            '%a, %b %d, %Y %I:%M %p',
            '%a, %b %d, %Y',
            '%B %d, %Y',
            '%B %d',
            '%b %d',
        ):
            try:
                dt = datetime.strptime(value, fmt)
                if dt.year == 1900:
                    dt = dt.replace(year=datetime.now().year)
                return dt
            except ValueError:
                continue
    return None


def enrich_event(event):
    try:
        detail_html = fetch(event['url'])
    except Exception as exc:
        print('Failed to fetch detail page:', event['url'], exc)
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
            if isinstance(address, dict):
                locality = address.get('addressLocality', '')
                region = address.get('addressRegion', '')
                street = address.get('streetAddress', '')
                if locality and region:
                    location = f"{name}, {street}, {locality}, {region}" if name else f"{street}, {locality}, {region}"
                else:
                    location = name or street or ''
            else:
                location = name or ''
            if location:
                event['location'] = location
    return event


def main():
    print('Fetching NCJ community page...')
    html_text = fetch(SEARCH_URL)
    print('Parsing NCJ event cards...')
    ncj_events = parse_community_cards(html_text)
    print(f'Found {len(ncj_events)} NCJ event cards.')
    enriched = []
    for idx, evt in enumerate(ncj_events, start=1):
        print(f'[{idx}/{len(ncj_events)}] Enriching NCJ event:', evt['title'])
        enriched_event = enrich_event(evt)
        enriched.append(enriched_event)
        time.sleep(SLEEP_SECONDS)

    eventbrite_events = []
    for page in range(1, EVENTBRITE_PAGES + 1):
        page_url = EVENTBRITE_URL if page == 1 else f'{EVENTBRITE_URL}?page={page}'
        print('Fetching Eventbrite page:', page_url)
        try:
            page_html = fetch(page_url)
            page_events = parse_eventbrite_events(page_html)
            print(f'Found {len(page_events)} Eventbrite events on page {page}.')
            eventbrite_events.extend(page_events)
        except Exception as exc:
            print('Failed to fetch Eventbrite page:', page_url, exc)
        time.sleep(SLEEP_SECONDS)

    print('Combining NCJ and Eventbrite events...')
    now = datetime.now().astimezone()
    combined = []
    seen_urls = set()
    for event in enriched + eventbrite_events:
        url = event.get('url', '').strip()
        if not url or url in seen_urls:
            continue
        start_iso = event.get('startDateIso') or event.get('startDate')
        if not start_iso:
            continue
        dt = parse_date(start_iso)
        if not dt or dt.date() < now.date():
            continue
        event['startDateIso'] = dt.isoformat()
        if 'detail_time' not in event:
            event['detail_time'] = ''
        combined.append(event)
        seen_urls.add(url)
        if len(combined) >= MAX_EVENTS:
            break

    combined.sort(key=lambda e: e.get('startDateIso', ''))

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(combined, f, ensure_ascii=False, indent=2)
    print(f'Wrote {OUTPUT_FILE} with {len(combined)} upcoming combined events.')


if __name__ == '__main__':
    main()
