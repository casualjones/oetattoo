#!/usr/bin/env python3
"""Build the daily California news feed used by events.html."""

import html
import json
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

OUTPUT_FILE = 'california-news.json'
MAX_STORIES = 30
MAX_TICKER_ITEMS = 8
USER_AGENT = 'OE-Tattoo-California-News/1.0'

FEEDS = [
    ('CalMatters', 'https://calmatters.org/feed/'),
    ('Google News California', 'https://news.google.com/rss/search?q=California%20news&hl=en-US&gl=US&ceid=US:en'),
    ('Google News Humboldt County', 'https://news.google.com/rss/search?q=Humboldt%20County%20California%20news&hl=en-US&gl=US&ceid=US:en'),
    ('NPR National News', 'https://feeds.npr.org/1001/rss.xml'),
]

TICKER_FEEDS = [
    ('weather', 'National Weather', 'https://news.google.com/rss/search?q=national%20weather%20forecast&hl=en-US&gl=US&ceid=US:en'),
    ('sports', 'Sports', 'https://www.espn.com/espn/rss/news'),
    ('sports', 'Sports Scores', 'https://news.google.com/rss/search?q=sports%20scores%20stats&hl=en-US&gl=US&ceid=US:en'),
]


def clean_text(value):
    value = html.unescape(value or '')
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', value)).strip()


def fetch(url):
    request = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    with urllib.request.urlopen(request, timeout=20) as response:
        return response.read()


def child_text(item, names):
    for name in names:
        element = item.find(name)
        if element is not None and element.text:
            return element.text.strip()
    return ''


def parse_date(value):
    if not value:
        return None
    try:
        parsed = parsedate_to_datetime(value)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(timezone.utc).isoformat()
    except (TypeError, ValueError, OverflowError):
        return None


def parse_feed(source, url):
    root = ET.fromstring(fetch(url))
    stories = []
    items = root.findall('.//item') or root.findall('.//{http://www.w3.org/2005/Atom}entry')
    for item in items:
        title = clean_text(child_text(item, ['title']))
        link = child_text(item, ['link'])
        if not link:
            link_element = item.find('{http://www.w3.org/2005/Atom}link')
            link = link_element.get('href', '') if link_element is not None else ''
        description = clean_text(child_text(item, ['description', '{http://purl.org/rss/1.0/modules/content/}encoded']))
        published = parse_date(child_text(item, ['pubDate', '{http://purl.org/dc/elements/1.1/}date', '{http://www.w3.org/2005/Atom}published', '{http://www.w3.org/2005/Atom}updated']))
        if not title or not link or not published:
            continue
        stories.append({
            'title': title,
            'url': link,
            'summary': description[:320],
            'source': source,
            'published': published,
        })
    return stories


def story_key(story):
    parsed = urllib.parse.urlsplit(story['url'])
    return (parsed.netloc.lower(), parsed.path.rstrip('/').lower())


def main():
    stories = []
    ticker = []
    errors = []
    for source, url in FEEDS:
        try:
            stories.extend(parse_feed(source, url))
        except Exception as error:  # Keep one unavailable source from breaking the feed.
            errors.append(f'{source}: {error}')

    for kind, source, url in TICKER_FEEDS:
        try:
            ticker.extend({**story, 'kind': kind, 'source': source} for story in parse_feed(source, url)[:MAX_TICKER_ITEMS])
        except Exception as error:
            errors.append(f'{source}: {error}')

    unique = {}
    for story in stories:
        unique.setdefault(story_key(story), story)

    output = sorted(unique.values(), key=lambda story: story['published'], reverse=True)[:MAX_STORIES]
    ticker = [
        item
        for kind in ('weather', 'sports')
        for item in sorted(
            (story for story in ticker if story['kind'] == kind),
            key=lambda story: story['published'],
            reverse=True,
        )[:MAX_TICKER_ITEMS // 2]
    ]
    payload = {
        'generatedAt': datetime.now(timezone.utc).isoformat(),
        'stories': output,
        'ticker': ticker,
        'sources': [source for source, _ in FEEDS],
        'sourceErrors': errors,
        'sourceErrors': errors,
    }
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as file:
        json.dump(payload, file, indent=2, ensure_ascii=False)
        file.write('\n')
    print(f'Wrote {len(output)} California news stories to {OUTPUT_FILE}')
    if errors:
        print('Unavailable sources:')
        for error in errors:
            print(f'  - {error}')


if __name__ == '__main__':
    main()
